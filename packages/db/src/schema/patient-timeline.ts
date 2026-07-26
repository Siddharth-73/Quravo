import { pgTable, uuid, varchar, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { patients } from './patients';
import { users } from './users';

export const patientTimeline = pgTable(
  'patient_timeline',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    eventType: varchar('event_type', { length: 100 }).notNull(), // registered, attachment_added, note_added
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 1000 }),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}).notNull(),
    createdById: uuid('created_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantPatientTimelineIdx: index('tenant_patient_timeline_idx').on(table.tenantId, table.patientId, table.createdAt),
  })
);

export type PatientTimelineEntry = typeof patientTimeline.$inferSelect;
export type NewPatientTimelineEntry = typeof patientTimeline.$inferInsert;
