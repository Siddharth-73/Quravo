"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emrReports = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const patients_1 = require("./patients");
const users_1 = require("./users");
const emr_encounters_1 = require("./emr-encounters");
exports.emrReports = (0, pg_core_1.pgTable)('emr_reports', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    encounterId: (0, pg_core_1.uuid)('encounter_id').references(() => emr_encounters_1.emrEncounters.id, { onDelete: 'set null' }),
    reportTitle: (0, pg_core_1.varchar)('report_title', { length: 255 }).notNull(),
    reportType: (0, pg_core_1.varchar)('report_type', { length: 100 }).notNull(), // lab_result, radiology_xray, pathology
    storageKey: (0, pg_core_1.varchar)('storage_key', { length: 500 }).notNull(),
    storageUrl: (0, pg_core_1.varchar)('storage_url', { length: 1000 }).notNull(),
    summaryNotes: (0, pg_core_1.varchar)('summary_notes', { length: 2000 }),
    createdById: (0, pg_core_1.uuid)('created_by_id').references(() => users_1.users.id, { onDelete: 'set null' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantPatientReportIdx: (0, pg_core_1.index)('tenant_patient_report_idx').on(table.tenantId, table.patientId),
}));
