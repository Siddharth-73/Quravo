"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenants = exports.tenantStatusEnum = exports.planTierEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.planTierEnum = (0, pg_core_1.pgEnum)('plan_tier', ['starter', 'growth', 'erp']);
exports.tenantStatusEnum = (0, pg_core_1.pgEnum)('tenant_status', ['active', 'suspended', 'pending']);
exports.tenants = (0, pg_core_1.pgTable)('tenants', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(),
    customDomain: (0, pg_core_1.varchar)('custom_domain', { length: 255 }).unique(),
    planTier: (0, exports.planTierEnum)('plan_tier').default('starter').notNull(),
    status: (0, exports.tenantStatusEnum)('status').default('active').notNull(),
    enabledModules: (0, pg_core_1.text)('enabled_modules').array().default([]),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
