import { pgTable, uuid, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { patients } from './patients';
import { users } from './users';

export const patientNotes = pgTable('patient_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  note: text('note').notNull(),
  visibility: varchar('visibility', { length: 20 }).default('internal').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PatientNote = typeof patientNotes.$inferSelect;
export type NewPatientNote = typeof patientNotes.$inferInsert;
