"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refunds = exports.refundStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const payments_1 = require("./payments");
const invoices_1 = require("./invoices");
const users_1 = require("./users");
exports.refundStatusEnum = (0, pg_core_1.pgEnum)('refund_status', [
    'pending',
    'completed',
    'failed'
]);
exports.refunds = (0, pg_core_1.pgTable)('refunds', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    paymentId: (0, pg_core_1.uuid)('payment_id').notNull().references(() => payments_1.payments.id, { onDelete: 'cascade' }),
    invoiceId: (0, pg_core_1.uuid)('invoice_id').notNull().references(() => invoices_1.invoices.id, { onDelete: 'cascade' }), // Denormalized for convenience
    amount: (0, pg_core_1.numeric)('amount', { precision: 10, scale: 2 }).notNull(),
    reason: (0, pg_core_1.varchar)('reason', { length: 1000 }).notNull(),
    status: (0, exports.refundStatusEnum)('status').default('pending').notNull(),
    processedById: (0, pg_core_1.uuid)('processed_by_id').references(() => users_1.users.id, { onDelete: 'set null' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    paymentRefundsIdx: (0, pg_core_1.index)('payment_refunds_idx').on(table.tenantId, table.paymentId),
    invoiceRefundsIdx: (0, pg_core_1.index)('invoice_refunds_idx').on(table.tenantId, table.invoiceId),
}));
