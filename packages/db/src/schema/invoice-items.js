"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceItems = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const invoices_1 = require("./invoices");
exports.invoiceItems = (0, pg_core_1.pgTable)('invoice_items', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    invoiceId: (0, pg_core_1.uuid)('invoice_id').notNull().references(() => invoices_1.invoices.id, { onDelete: 'cascade' }),
    description: (0, pg_core_1.varchar)('description', { length: 500 }).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull().default(1),
    unitPrice: (0, pg_core_1.numeric)('unit_price', { precision: 10, scale: 2 }).notNull(),
    taxRate: (0, pg_core_1.numeric)('tax_rate', { precision: 5, scale: 2 }).notNull().default('0.00'), // e.g., 5.00 for 5%
    total: (0, pg_core_1.numeric)('total', { precision: 10, scale: 2 }).notNull(),
    // Polymorphic reference to source (e.g., 'appointment', 'prescription_item')
    referenceType: (0, pg_core_1.varchar)('reference_type', { length: 100 }),
    referenceId: (0, pg_core_1.uuid)('reference_id'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    invoiceItemsIdx: (0, pg_core_1.index)('invoice_items_idx').on(table.tenantId, table.invoiceId),
    referenceIdx: (0, pg_core_1.index)('reference_idx').on(table.tenantId, table.referenceType, table.referenceId),
}));
