"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTenantRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
class BaseTenantRepository {
    db;
    table;
    tenantColumn;
    constructor(db, table, tenantColumn) {
        this.db = db;
        this.table = table;
        this.tenantColumn = tenantColumn;
    }
    /**
     * Helper to build a query condition filtered strictly by tenantId.
     */
    withTenant(tenantId, additionalCondition) {
        if (!tenantId) {
            throw new Error('Tenant Context Violation: tenantId is required for tenant-scoped operations.');
        }
        const tenantClause = (0, drizzle_orm_1.eq)(this.tenantColumn, tenantId);
        return additionalCondition ? (0, drizzle_orm_1.and)(tenantClause, additionalCondition) : tenantClause;
    }
}
exports.BaseTenantRepository = BaseTenantRepository;
