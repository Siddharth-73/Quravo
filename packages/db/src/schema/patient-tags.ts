import { pgTable, uuid, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { patients } from './patients';

export const patientTags = pgTable(
  'patient_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    color: varchar('color', { length: 20 }).default('#cccccc').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantTagNameIdx: uniqueIndex('tenant_tag_name_idx').on(table.tenantId, table.name),
  })
);

export const patientTagAssignments = pgTable(
  'patient_tag_assignments',
  {
    patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id').notNull().references(() => patientTags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    patientTagIdx: uniqueIndex('patient_tag_idx').on(table.patientId, table.tagId),
  })
);

export type PatientTag = typeof patientTags.$inferSelect;
export type NewPatientTag = typeof patientTags.$inferInsert;
export type PatientTagAssignment = typeof patientTagAssignments.$inferSelect;
export type NewPatientTagAssignment = typeof patientTagAssignments.$inferInsert;
