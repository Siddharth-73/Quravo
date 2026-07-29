"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantModules = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
exports.tenantModules = (0, pg_core_1.pgTable)('tenant_modules', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    moduleKey: (0, pg_core_1.varchar)('module_key', { length: 100 }).notNull(),
    enabled: (0, pg_core_1.boolean)('enabled').default(true).notNull(),
    enabledAt: (0, pg_core_1.timestamp)('enabled_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantModuleIdx: (0, pg_core_1.uniqueIndex)('tenant_module_idx').on(table.tenantId, table.moduleKey),
}));
