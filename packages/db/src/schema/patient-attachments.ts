import { pgTable, uuid, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { patients } from './patients';
import { users } from './users';

export const patientAttachments = pgTable(
  'patient_attachments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileType: varchar('file_type', { length: 100 }).notNull(),
    fileSize: integer('file_size').notNull(), // in bytes
    storageKey: varchar('storage_key', { length: 500 }).notNull(),
    storageUrl: varchar('storage_url', { length: 1000 }).notNull(),
    category: varchar('category', { length: 100 }).default('general').notNull(), // lab_result, insurance_card, id_proof, scan
    uploadedById: uuid('uploaded_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantPatientAttachmentsIdx: index('tenant_patient_attachments_idx').on(table.tenantId, table.patientId),
  })
);

export type PatientAttachment = typeof patientAttachments.$inferSelect;
export type NewPatientAttachment = typeof patientAttachments.$inferInsert;
