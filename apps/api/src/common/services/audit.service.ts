import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { auditLogs } from '@quravo/db';

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
}
