import { pgTable, uuid, varchar, jsonb, timestamp, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { patients } from './patients';
import { users } from './users';
import { appointments } from './appointments';

export const encounterStatusEnum = pgEnum('encounter_status', ['draft', 'finalized', 'amended']);

export interface VitalsData {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  pulseRate?: number;
  temperatureCelsius?: number;
  weightKg?: number;
  heightCm?: number;
  bmi?: number;
  spo2Percentage?: number;
  respiratoryRate?: number;
}

export const emrEncounters = pgTable(
  'emr_encounters',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    doctorId: uuid('doctor_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    appointmentId: uuid('appointment_id').references(() => appointments.id, { onDelete: 'set null' }),
    encounterNumber: varchar('encounter_number', { length: 100 }).notNull(),
    encounterDate: timestamp('encounter_date', { withTimezone: true }).defaultNow().notNull(),
    chiefComplaint: varchar('chief_complaint', { length: 1000 }).notNull(),
    subjectiveNotes: varchar('subjective_notes', { length: 4000 }), // SOAP: S
    objectiveNotes: varchar('objective_notes', { length: 4000 }),  // SOAP: O
    assessmentDiagnosis: jsonb('assessment_diagnosis').$type<string[]>().default([]).notNull(), // SOAP: A
    treatmentPlan: varchar('treatment_plan', { length: 4000 }),     // SOAP: P
    vitals: jsonb('vitals').$type<VitalsData>().default({}).notNull(),
    status: encounterStatusEnum('status').default('draft').notNull(),
    finalizedAt: timestamp('finalized_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantEncounterNoIdx: uniqueIndex('tenant_encounter_no_idx').on(table.tenantId, table.encounterNumber),
    tenantPatientEncIdx: index('tenant_patient_enc_idx').on(table.tenantId, table.patientId, table.createdAt),
  })
);

export type EmrEncounter = typeof emrEncounters.$inferSelect;
export type NewEmrEncounter = typeof emrEncounters.$inferInsert;
