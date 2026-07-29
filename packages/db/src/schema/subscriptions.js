"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptions = exports.billingProviderEnum = exports.subscriptionStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const tenants_2 = require("./tenants");
exports.subscriptionStatusEnum = (0, pg_core_1.pgEnum)('subscription_status', ['trialing', 'active', 'past_due', 'canceled', 'unpaid']);
exports.billingProviderEnum = (0, pg_core_1.pgEnum)('billing_provider', ['mock', 'stripe', 'razorpay', 'lemonsqueezy']);
exports.subscriptions = (0, pg_core_1.pgTable)('subscriptions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().unique().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    planTier: (0, tenants_2.planTierEnum)('plan_tier').default('starter').notNull(),
    status: (0, exports.subscriptionStatusEnum)('status').default('trialing').notNull(),
    billingProvider: (0, exports.billingProviderEnum)('billing_provider').default('mock').notNull(),
    externalSubscriptionId: (0, pg_core_1.varchar)('external_subscription_id', { length: 255 }),
    externalCustomerId: (0, pg_core_1.varchar)('external_customer_id', { length: 255 }),
    currentPeriodStart: (0, pg_core_1.timestamp)('current_period_start', { withTimezone: true }).defaultNow().notNull(),
    currentPeriodEnd: (0, pg_core_1.timestamp)('current_period_end', { withTimezone: true }).notNull(),
    cancelAtPeriodEnd: (0, pg_core_1.boolean)('cancel_at_period_end').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
