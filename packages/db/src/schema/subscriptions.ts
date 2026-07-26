import { pgTable, uuid, varchar, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { planTierEnum } from './tenants';

export const subscriptionStatusEnum = pgEnum('subscription_status', ['trialing', 'active', 'past_due', 'canceled', 'unpaid']);
export const billingProviderEnum = pgEnum('billing_provider', ['mock', 'stripe', 'razorpay', 'lemonsqueezy']);

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().unique().references(() => tenants.id, { onDelete: 'cascade' }),
  planTier: planTierEnum('plan_tier').default('starter').notNull(),
  status: subscriptionStatusEnum('status').default('trialing').notNull(),
  billingProvider: billingProviderEnum('billing_provider').default('mock').notNull(),
  externalSubscriptionId: varchar('external_subscription_id', { length: 255 }),
  externalCustomerId: varchar('external_customer_id', { length: 255 }),
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }).defaultNow().notNull(),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }).notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
