"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoices = exports.invoiceStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const clinic_branches_1 = require("./clinic-branches");
const patients_1 = require("./patients");
const users_1 = require("./users");
exports.invoiceStatusEnum = (0, pg_core_1.pgEnum)('invoice_status', [
    'draft',
    'pending', // Issued, awaiting payment
    'paid',
    'partially_paid',
    'cancelled',
    'voided'
]);
exports.invoices = (0, pg_core_1.pgTable)('invoices', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    branchId: (0, pg_core_1.uuid)('branch_id').notNull().references(() => clinic_branches_1.clinicBranches.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    invoiceNumber: (0, pg_core_1.varchar)('invoice_number', { length: 100 }).notNull(),
    status: (0, exports.invoiceStatusEnum)('status').default('draft').notNull(),
    // Monetary fields (using numeric/decimal for precision)
    subtotal: (0, pg_core_1.numeric)('subtotal', { precision: 10, scale: 2 }).notNull().default('0.00'),
    taxAmount: (0, pg_core_1.numeric)('tax_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
    discountAmount: (0, pg_core_1.numeric)('discount_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
    totalAmount: (0, pg_core_1.numeric)('total_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
    amountDue: (0, pg_core_1.numeric)('amount_due', { precision: 10, scale: 2 }).notNull().default('0.00'),
    dueDate: (0, pg_core_1.timestamp)('due_date', { withTimezone: true }),
    issuedAt: (0, pg_core_1.timestamp)('issued_at', { withTimezone: true }),
    notes: (0, pg_core_1.varchar)('notes', { length: 2000 }),
    createdById: (0, pg_core_1.uuid)('created_by_id').references(() => users_1.users.id, { onDelete: 'set null' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantInvoiceNoIdx: (0, pg_core_1.uniqueIndex)('tenant_invoice_no_idx').on(table.tenantId, table.invoiceNumber),
    tenantStatusIdx: (0, pg_core_1.index)('tenant_status_idx').on(table.tenantId, table.status),
    patientInvoicesIdx: (0, pg_core_1.index)('patient_invoices_idx').on(table.tenantId, table.patientId),
}));
