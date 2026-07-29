"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id'),
    action: (0, pg_core_1.varchar)('action', { length: 100 }).notNull(),
    resource: (0, pg_core_1.varchar)('resource', { length: 100 }).notNull(),
    resourceId: (0, pg_core_1.varchar)('resource_id', { length: 255 }),
    payload: (0, pg_core_1.jsonb)('payload'),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 45 }),
    userAgent: (0, pg_core_1.varchar)('user_agent', { length: 500 }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
