import { pgTable, uuid, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const tenantConfigs = pgTable('tenant_configs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().unique().references(() => tenants.id, { onDelete: 'cascade' }),
  logoUrl: varchar('logo_url', { length: 500 }),
  primaryColor: varchar('primary_color', { length: 50 }).default('#0284c7').notNull(),
  accentColor: varchar('accent_color', { length: 50 }).default('#0f172a').notNull(),
  timezone: varchar('timezone', { length: 100 }).default('UTC').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD').notNull(),
  settings: jsonb('settings').$type<Record<string, any>>().default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TenantConfig = typeof tenantConfigs.$inferSelect;
export type NewTenantConfig = typeof tenantConfigs.$inferInsert;
