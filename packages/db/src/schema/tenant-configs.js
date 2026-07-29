"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantConfigs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
exports.tenantConfigs = (0, pg_core_1.pgTable)('tenant_configs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().unique().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    logoUrl: (0, pg_core_1.varchar)('logo_url', { length: 500 }),
    primaryColor: (0, pg_core_1.varchar)('primary_color', { length: 50 }).default('#0284c7').notNull(),
    accentColor: (0, pg_core_1.varchar)('accent_color', { length: 50 }).default('#0f172a').notNull(),
    timezone: (0, pg_core_1.varchar)('timezone', { length: 100 }).default('UTC').notNull(),
    currency: (0, pg_core_1.varchar)('currency', { length: 10 }).default('USD').notNull(),
    settings: (0, pg_core_1.jsonb)('settings').$type().default({}).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
