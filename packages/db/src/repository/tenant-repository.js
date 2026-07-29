"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRepository = void 0;
const base_repository_1 = require("./base.repository");
const drizzle_orm_1 = require("drizzle-orm");
class TenantRepository extends base_repository_1.BaseTenantRepository {
    constructor(db, table, tenantColumn) {
        super(db, table, tenantColumn);
    }
    async findMany(tenantId, additionalCondition) {
        const filter = this.withTenant(tenantId, additionalCondition);
        return this.db.select().from(this.table).where(filter);
    }
    async findFirst(tenantId, additionalCondition) {
        const filter = this.withTenant(tenantId, additionalCondition);
        const [result] = await this.db.select().from(this.table).where(filter).limit(1);
        return result || null;
    }
    async insert(tenantId, data) {
        if (!tenantId) {
            throw new Error('Tenant Context Violation: Cannot insert record without tenantId.');
        }
        const payload = { ...data, tenantId };
        const [inserted] = await this.db.insert(this.table).values(payload).returning();
        return inserted;
    }
    async update(tenantId, recordId, idColumn, data) {
        const filter = this.withTenant(tenantId, (0, drizzle_orm_1.eq)(idColumn, recordId));
        const [updated] = await this.db.update(this.table).set(data).where(filter).returning();
        return updated;
    }
    async delete(tenantId, recordId, idColumn) {
        const filter = this.withTenant(tenantId, (0, drizzle_orm_1.eq)(idColumn, recordId));
        const deleted = await this.db.delete(this.table).where(filter).returning();
        return deleted.length > 0;
    }
}
exports.TenantRepository = TenantRepository;
