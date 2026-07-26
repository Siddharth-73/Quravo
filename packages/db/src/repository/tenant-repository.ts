import { Database } from '../client';
import { BaseTenantRepository } from './base.repository';
import { PgTable, PgColumn } from 'drizzle-orm/pg-core';
import { eq, and, SQL } from 'drizzle-orm';

export class TenantRepository<TTable extends PgTable> extends BaseTenantRepository<TTable> {
  constructor(
    db: Database,
    table: TTable,
    tenantColumn: PgColumn
  ) {
    super(db, table, tenantColumn);
  }

  async findMany(tenantId: string, additionalCondition?: SQL): Promise<any[]> {
    const filter = this.withTenant(tenantId, additionalCondition);
    return this.db.select().from(this.table as any).where(filter);
  }

  async findFirst(tenantId: string, additionalCondition?: SQL): Promise<any | null> {
    const filter = this.withTenant(tenantId, additionalCondition);
    const [result] = await this.db.select().from(this.table as any).where(filter).limit(1);
    return result || null;
  }

  async insert(tenantId: string, data: Record<string, any>): Promise<any> {
    if (!tenantId) {
      throw new Error('Tenant Context Violation: Cannot insert record without tenantId.');
    }
    const payload = { ...data, tenantId };
    const [inserted] = await this.db.insert(this.table as any).values(payload).returning();
    return inserted;
  }

  async update(tenantId: string, recordId: string, idColumn: PgColumn, data: Record<string, any>): Promise<any> {
    const filter = this.withTenant(tenantId, eq(idColumn, recordId));
    const [updated] = await this.db.update(this.table as any).set(data).where(filter).returning();
    return updated;
  }

  async delete(tenantId: string, recordId: string, idColumn: PgColumn): Promise<boolean> {
    const filter = this.withTenant(tenantId, eq(idColumn, recordId));
    const deleted = await this.db.delete(this.table as any).where(filter).returning();
    return deleted.length > 0;
  }
}
