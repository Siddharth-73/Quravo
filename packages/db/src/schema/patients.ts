import { pgTable, uuid, varchar, jsonb, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const patients = pgTable(
  'patients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    patientNumber: varchar('patient_number', { length: 100 }).notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    dateOfBirth: varchar('date_of_birth', { length: 20 }).notNull(), // YYYY-MM-DD
    gender: varchar('gender', { length: 20 }).notNull(), // male, female, other
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    emergencyContactName: varchar('emergency_contact_name', { length: 255 }),
    emergencyContactPhone: varchar('emergency_contact_phone', { length: 50 }),
    bloodGroup: varchar('blood_group', { length: 10 }),
    allergies: jsonb('allergies').$type<string[]>().default([]).notNull(),
    medicalHistory: jsonb('medical_history').$type<Record<string, any>>().default({}).notNull(),
    address: varchar('address', { length: 500 }),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }),
    status: varchar('status', { length: 20 }).default('active').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantPatientNoIdx: uniqueIndex('tenant_patient_no_idx').on(table.tenantId, table.patientNumber),
    tenantSearchIdx: index('tenant_patient_search_idx').on(table.tenantId, table.firstName, table.lastName, table.phone),
  })
);

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
