import { pgTable, uuid, varchar, timestamp, pgEnum, index, numeric } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { payments } from './payments';
import { invoices } from './invoices';
import { users } from './users';

export const refundStatusEnum = pgEnum('refund_status', [
  'pending',
  'completed',
  'failed'
]);

export const refunds = pgTable(
  'refunds',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    paymentId: uuid('payment_id').notNull().references(() => payments.id, { onDelete: 'cascade' }),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }), // Denormalized for convenience
    
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    reason: varchar('reason', { length: 1000 }).notNull(),
    status: refundStatusEnum('status').default('pending').notNull(),
    
    processedById: uuid('processed_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    paymentRefundsIdx: index('payment_refunds_idx').on(table.tenantId, table.paymentId),
    invoiceRefundsIdx: index('invoice_refunds_idx').on(table.tenantId, table.invoiceId),
  })
);

export type Refund = typeof refunds.$inferSelect;
export type NewRefund = typeof refunds.$inferInsert;
