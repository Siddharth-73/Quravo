import { pgTable, uuid, varchar, timestamp, pgEnum, index, uniqueIndex, numeric } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { clinicBranches } from './clinic-branches';
import { patients } from './patients';
import { users } from './users';

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',
  'pending', // Issued, awaiting payment
  'paid',
  'partially_paid',
  'cancelled',
  'voided'
]);

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => clinicBranches.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    invoiceNumber: varchar('invoice_number', { length: 100 }).notNull(),
    status: invoiceStatusEnum('status').default('draft').notNull(),
    
    // Monetary fields (using numeric/decimal for precision)
    subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull().default('0.00'),
    taxAmount: numeric('tax_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
    discountAmount: numeric('discount_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
    totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
    amountDue: numeric('amount_due', { precision: 10, scale: 2 }).notNull().default('0.00'),
    
    dueDate: timestamp('due_date', { withTimezone: true }),
    issuedAt: timestamp('issued_at', { withTimezone: true }),
    
    notes: varchar('notes', { length: 2000 }),
    
    createdById: uuid('created_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantInvoiceNoIdx: uniqueIndex('tenant_invoice_no_idx').on(table.tenantId, table.invoiceNumber),
    tenantStatusIdx: index('tenant_status_idx').on(table.tenantId, table.status),
    patientInvoicesIdx: index('patient_invoices_idx').on(table.tenantId, table.patientId),
  })
);

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
