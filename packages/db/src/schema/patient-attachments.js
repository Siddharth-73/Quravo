"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientAttachments = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const patients_1 = require("./patients");
const users_1 = require("./users");
exports.patientAttachments = (0, pg_core_1.pgTable)('patient_attachments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    fileName: (0, pg_core_1.varchar)('file_name', { length: 255 }).notNull(),
    fileType: (0, pg_core_1.varchar)('file_type', { length: 100 }).notNull(),
    fileSize: (0, pg_core_1.integer)('file_size').notNull(), // in bytes
    storageKey: (0, pg_core_1.varchar)('storage_key', { length: 500 }).notNull(),
    storageUrl: (0, pg_core_1.varchar)('storage_url', { length: 1000 }).notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 100 }).default('general').notNull(), // lab_result, insurance_card, id_proof, scan
    uploadedById: (0, pg_core_1.uuid)('uploaded_by_id').references(() => users_1.users.id, { onDelete: 'set null' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantPatientAttachmentsIdx: (0, pg_core_1.index)('tenant_patient_attachments_idx').on(table.tenantId, table.patientId),
}));
