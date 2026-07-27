import { pgTable, uuid, varchar, timestamp, numeric, integer, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { invoices } from './invoices';

export const invoiceItems = pgTable(
  'invoice_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
    
    description: varchar('description', { length: 500 }).notNull(),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
    taxRate: numeric('tax_rate', { precision: 5, scale: 2 }).notNull().default('0.00'), // e.g., 5.00 for 5%
    total: numeric('total', { precision: 10, scale: 2 }).notNull(),
    
    // Polymorphic reference to source (e.g., 'appointment', 'prescription_item')
    referenceType: varchar('reference_type', { length: 100 }),
    referenceId: uuid('reference_id'),
    
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    invoiceItemsIdx: index('invoice_items_idx').on(table.tenantId, table.invoiceId),
    referenceIdx: index('reference_idx').on(table.tenantId, table.referenceType, table.referenceId),
  })
);

export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;
