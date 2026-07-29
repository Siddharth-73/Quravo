import { pgTable, uuid, varchar, timestamp, pgEnum, index, numeric } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { invoices } from './invoices';
import { patients } from './patients';
import { users } from './users';

export const paymentMethodEnum = pgEnum('payment_method', [
  'cash',
  'credit_card',
  'debit_card',
  'bank_transfer',
  'online_gateway'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded', // Fully refunded
  'partially_refunded'
]);

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    status: paymentStatusEnum('status').default('pending').notNull(),
    
    transactionId: varchar('transaction_id', { length: 255 }), // Gateway payment ID (e.g. Razorpay payment_id)
    gatewayProvider: varchar('gateway_provider', { length: 50 }), // e.g. 'razorpay'
    gatewayOrderId: varchar('gateway_order_id', { length: 255 }), // e.g. Razorpay order_id, used to correlate + prevent replay
    paymentDate: timestamp('payment_date', { withTimezone: true }).defaultNow().notNull(),
    
    notes: varchar('notes', { length: 1000 }),
    
    collectedById: uuid('collected_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    invoicePaymentsIdx: index('invoice_payments_idx').on(table.tenantId, table.invoiceId),
    patientPaymentsIdx: index('patient_payments_idx').on(table.tenantId, table.patientId),
    gatewayOrderIdx: index('gateway_order_idx').on(table.tenantId, table.gatewayOrderId),
  })
);

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
