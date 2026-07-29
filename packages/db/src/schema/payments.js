"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payments = exports.paymentStatusEnum = exports.paymentMethodEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const invoices_1 = require("./invoices");
const patients_1 = require("./patients");
const users_1 = require("./users");
exports.paymentMethodEnum = (0, pg_core_1.pgEnum)('payment_method', [
    'cash',
    'credit_card',
    'debit_card',
    'bank_transfer',
    'online_gateway'
]);
exports.paymentStatusEnum = (0, pg_core_1.pgEnum)('payment_status', [
    'pending',
    'completed',
    'failed',
    'refunded', // Fully refunded
    'partially_refunded'
]);
exports.payments = (0, pg_core_1.pgTable)('payments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    invoiceId: (0, pg_core_1.uuid)('invoice_id').notNull().references(() => invoices_1.invoices.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    amount: (0, pg_core_1.numeric)('amount', { precision: 10, scale: 2 }).notNull(),
    paymentMethod: (0, exports.paymentMethodEnum)('payment_method').notNull(),
    status: (0, exports.paymentStatusEnum)('status').default('pending').notNull(),
    transactionId: (0, pg_core_1.varchar)('transaction_id', { length: 255 }), // Gateway payment ID (e.g. Razorpay payment_id)
    gatewayProvider: (0, pg_core_1.varchar)('gateway_provider', { length: 50 }), // e.g. 'razorpay'
    gatewayOrderId: (0, pg_core_1.varchar)('gateway_order_id', { length: 255 }), // e.g. Razorpay order_id, used to correlate + prevent replay
    paymentDate: (0, pg_core_1.timestamp)('payment_date', { withTimezone: true }).defaultNow().notNull(),
    notes: (0, pg_core_1.varchar)('notes', { length: 1000 }),
    collectedById: (0, pg_core_1.uuid)('collected_by_id').references(() => users_1.users.id, { onDelete: 'set null' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    invoicePaymentsIdx: (0, pg_core_1.index)('invoice_payments_idx').on(table.tenantId, table.invoiceId),
    patientPaymentsIdx: (0, pg_core_1.index)('patient_payments_idx').on(table.tenantId, table.patientId),
    gatewayOrderIdx: (0, pg_core_1.index)('gateway_order_idx').on(table.tenantId, table.gatewayOrderId),
}));
