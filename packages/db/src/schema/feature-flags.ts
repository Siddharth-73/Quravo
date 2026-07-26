import { pgTable, uuid, varchar, boolean, integer, jsonb, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const featureFlags = pgTable(
  'feature_flags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    flagKey: varchar('flag_key', { length: 100 }).notNull(),
    enabled: boolean('enabled').default(false).notNull(),
    percentageRollout: integer('percentage_rollout').default(100).notNull(), // 0 to 100
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantFlagIdx: uniqueIndex('tenant_flag_idx').on(table.tenantId, table.flagKey),
  })
);

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type NewFeatureFlag = typeof featureFlags.$inferInsert;
