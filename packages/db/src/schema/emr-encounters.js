"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emrEncounters = exports.encounterStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const patients_1 = require("./patients");
const users_1 = require("./users");
const appointments_1 = require("./appointments");
exports.encounterStatusEnum = (0, pg_core_1.pgEnum)('encounter_status', ['draft', 'finalized', 'amended']);
exports.emrEncounters = (0, pg_core_1.pgTable)('emr_encounters', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    doctorId: (0, pg_core_1.uuid)('doctor_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    appointmentId: (0, pg_core_1.uuid)('appointment_id').references(() => appointments_1.appointments.id, { onDelete: 'set null' }),
    encounterNumber: (0, pg_core_1.varchar)('encounter_number', { length: 100 }).notNull(),
    encounterDate: (0, pg_core_1.timestamp)('encounter_date', { withTimezone: true }).defaultNow().notNull(),
    chiefComplaint: (0, pg_core_1.varchar)('chief_complaint', { length: 1000 }).notNull(),
    subjectiveNotes: (0, pg_core_1.varchar)('subjective_notes', { length: 4000 }), // SOAP: S
    objectiveNotes: (0, pg_core_1.varchar)('objective_notes', { length: 4000 }), // SOAP: O
    assessmentDiagnosis: (0, pg_core_1.jsonb)('assessment_diagnosis').$type().default([]).notNull(), // SOAP: A
    treatmentPlan: (0, pg_core_1.varchar)('treatment_plan', { length: 4000 }), // SOAP: P
    vitals: (0, pg_core_1.jsonb)('vitals').$type().default({}).notNull(),
    status: (0, exports.encounterStatusEnum)('status').default('draft').notNull(),
    finalizedAt: (0, pg_core_1.timestamp)('finalized_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantEncounterNoIdx: (0, pg_core_1.uniqueIndex)('tenant_encounter_no_idx').on(table.tenantId, table.encounterNumber),
    tenantPatientEncIdx: (0, pg_core_1.index)('tenant_patient_enc_idx').on(table.tenantId, table.patientId, table.createdAt),
}));
