import { pgTable, uuid, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

export const patientFamilyMembers = pgTable(
  'patient_family_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    primaryUserId: uuid('primary_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    linkedUserId: uuid('linked_user_id').references(() => users.id, { onDelete: 'set null' }),
    relationship: varchar('relationship', { length: 50 }).notNull(), // parent, child, spouse, etc.
    firstName: varchar('first_name', { length: 100 }), // for unregistered dependents
    lastName: varchar('last_name', { length: 100 }),
    dateOfBirth: varchar('date_of_birth', { length: 20 }),
    gender: varchar('gender', { length: 20 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  }
);

export type PatientFamilyMember = typeof patientFamilyMembers.$inferSelect;
export type NewPatientFamilyMember = typeof patientFamilyMembers.$inferInsert;
