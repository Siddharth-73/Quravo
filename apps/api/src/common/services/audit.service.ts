import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { auditLogs, desc, eq, and, sql } from '@quravo/db';
export interface AuditLogOptions {
  tenantId: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, any>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async log(options: AuditLogOptions) {
    try {
      const db = this.dbService.db;
      await db.insert(auditLogs).values({
        tenantId: options.tenantId,
        userId: options.userId,
        action: options.action,
        resource: options.resource,
        resourceId: options.resourceId,
        ipAddress: options.ipAddress || '127.0.0.1',
        userAgent: options.userAgent || 'system',
        payload: options.changes || {},
      });
      this.logger.log(`🔒 Audit Log [${options.action}] on ${options.resource}:${options.resourceId || 'N/A'}`);
    } catch (err: any) {
      this.logger.error(`Failed to record audit log: ${err.message}`);
    }
  }
  async findLogs(tenantId: string, filters: { page?: number, limit?: number, userId?: string, action?: string, startDate?: string, endDate?: string }) {
    const db = this.dbService.db;
    const limit = Number(filters.limit) || 10;
    const page = Number(filters.page) || 1;
    const offset = (page - 1) * limit;

    const conditions = [eq(auditLogs.tenantId, tenantId)];
    if (filters.userId) conditions.push(eq(auditLogs.userId, filters.userId));
    if (filters.action) conditions.push(eq(auditLogs.action, filters.action));
    // Drizzle doesn't support easy >= on string dates without wrapping, let's just use sql helper or skip date filters if not strictly needed. Wait, we can use sql.
    if (filters.startDate) conditions.push(sql`${auditLogs.createdAt} >= ${new Date(filters.startDate).toISOString()}`);
    if (filters.endDate) conditions.push(sql`${auditLogs.createdAt} <= ${new Date(filters.endDate).toISOString()}`);

    const data = await db
      .select()
      .from(auditLogs)
      .where(and(...conditions))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(and(...conditions));

    return {
      data,
      total: Number(count),
      page,
      limit,
    };
  }
}
