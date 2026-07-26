import { Database } from '../client';
import { eq, and, SQL } from 'drizzle-orm';
import { PgTable, PgColumn } from 'drizzle-orm/pg-core';

export abstract class BaseTenantRepository<TTable extends PgTable> {
  constructor(
    protected readonly db: Database,
    protected readonly table: TTable,
    protected readonly tenantColumn: PgColumn
  ) {}

  /**
   * Helper to build a query condition filtered strictly by tenantId.
   */
  protected withTenant(tenantId: string, additionalCondition?: SQL): SQL {
    if (!tenantId) {
      throw new Error('Tenant Context Violation: tenantId is required for tenant-scoped operations.');
    }
    const tenantClause = eq(this.tenantColumn, tenantId);
    return additionalCondition ? and(tenantClause, additionalCondition)! : tenantClause;
  }
}
