"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customDomains = exports.domainStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
exports.domainStatusEnum = (0, pg_core_1.pgEnum)('domain_status', ['pending', 'active', 'failed', 'verification_required']);
exports.customDomains = (0, pg_core_1.pgTable)('custom_domains', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    domain: (0, pg_core_1.varchar)('domain', { length: 255 }).notNull().unique(),
    status: (0, exports.domainStatusEnum)('status').default('pending').notNull(),
    isPrimary: (0, pg_core_1.boolean)('is_primary').default(false).notNull(),
    sslConfigured: (0, pg_core_1.boolean)('ssl_configured').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
