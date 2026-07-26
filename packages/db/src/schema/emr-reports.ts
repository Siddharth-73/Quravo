import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { patients } from './patients';
import { users } from './users';
import { emrEncounters } from './emr-encounters';

export const emrReports = pgTable(
  'emr_reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    encounterId: uuid('encounter_id').references(() => emrEncounters.id, { onDelete: 'set null' }),
    reportTitle: varchar('report_title', { length: 255 }).notNull(),
    reportType: varchar('report_type', { length: 100 }).notNull(), // lab_result, radiology_xray, pathology
    storageKey: varchar('storage_key', { length: 500 }).notNull(),
    storageUrl: varchar('storage_url', { length: 1000 }).notNull(),
    summaryNotes: varchar('summary_notes', { length: 2000 }),
    createdById: uuid('created_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantPatientReportIdx: index('tenant_patient_report_idx').on(table.tenantId, table.patientId),
  })
);

export type EmrReport = typeof emrReports.$inferSelect;
export type NewEmrReport = typeof emrReports.$inferInsert;
