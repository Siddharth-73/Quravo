import { pgTable, uuid, varchar, timestamp, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { patients } from './patients';
import { users } from './users';
import { emrEncounters } from './emr-encounters';

export const prescriptionStatusEnum = pgEnum('prescription_status', ['active', 'discontinued', 'completed']);

export const prescriptions = pgTable(
  'prescriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    doctorId: uuid('doctor_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    encounterId: uuid('encounter_id').references(() => emrEncounters.id, { onDelete: 'set null' }),
    prescriptionNumber: varchar('prescription_number', { length: 100 }).notNull(),
    instructions: varchar('instructions', { length: 1000 }),
    status: prescriptionStatusEnum('status').default('active').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantRxNoIdx: uniqueIndex('tenant_rx_no_idx').on(table.tenantId, table.prescriptionNumber),
    tenantPatientRxIdx: index('tenant_patient_rx_idx').on(table.tenantId, table.patientId),
  })
);

export type Prescription = typeof prescriptions.$inferSelect;
export type NewPrescription = typeof prescriptions.$inferInsert;
