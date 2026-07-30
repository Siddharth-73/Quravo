import { pgTable, uuid, varchar, timestamp, pgEnum, text, jsonb } from 'drizzle-orm/pg-core';

export const tenantTypeEnum = pgEnum('tenant_type', [
  'clinic',
  'hospital',
  'diagnostic_center',
  'dental',
  'veterinary',
  'telemedicine',
  'custom',
]);

export const planTierEnum = pgEnum('plan_tier', [
  'free',
  'trial',
  'starter',
  'professional',
  'enterprise',
  'custom',
]);

export const tenantStatusEnum = pgEnum('tenant_status', [
  'active',
  'suspended',
  'pending',
  'archived',
]);

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  tenantType: tenantTypeEnum('tenant_type').default('clinic').notNull(),
  logo: varchar('logo', { length: 500 }),
  domain: varchar('domain', { length: 255 }),
  customDomain: varchar('custom_domain', { length: 255 }).unique(),
  planTier: planTierEnum('plan_tier').default('starter').notNull(),
  status: tenantStatusEnum('status').default('active').notNull(),
  trialEnd: timestamp('trial_end', { withTimezone: true }),
  region: varchar('region', { length: 100 }).default('US-East'),
  timezone: varchar('timezone', { length: 100 }).default('UTC'),
  country: varchar('country', { length: 100 }).default('US'),
  currency: varchar('currency', { length: 10 }).default('USD'),
  contactDetails: jsonb('contact_details').$type<{
    email?: string;
    phone?: string;
    address?: string;
    contactPerson?: string;
  }>(),
  branding: jsonb('branding').$type<{
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    themeName?: string;
    fontFamily?: string;
    loginScreenBg?: string;
    faviconUrl?: string;
  }>(),
  enabledModules: text('enabled_modules').array().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

