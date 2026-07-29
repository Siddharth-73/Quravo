"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureFlags = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
exports.featureFlags = (0, pg_core_1.pgTable)('feature_flags', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    flagKey: (0, pg_core_1.varchar)('flag_key', { length: 100 }).notNull(),
    enabled: (0, pg_core_1.boolean)('enabled').default(false).notNull(),
    percentageRollout: (0, pg_core_1.integer)('percentage_rollout').default(100).notNull(), // 0 to 100
    metadata: (0, pg_core_1.jsonb)('metadata').$type().default({}).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantFlagIdx: (0, pg_core_1.uniqueIndex)('tenant_flag_idx').on(table.tenantId, table.flagKey),
}));
