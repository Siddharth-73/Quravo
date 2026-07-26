import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { prescriptions } from './prescriptions';

export const prescriptionItems = pgTable(
  'prescription_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    prescriptionId: uuid('prescription_id').notNull().references(() => prescriptions.id, { onDelete: 'cascade' }),
    medicationName: varchar('medication_name', { length: 255 }).notNull(),
    dosage: varchar('dosage', { length: 100 }).notNull(), // e.g. 500mg, 10ml
    frequency: varchar('frequency', { length: 100 }).notNull(), // e.g. 1-0-1, twice daily
    duration: varchar('duration', { length: 100 }).notNull(), // e.g. 5 days, 2 weeks
    route: varchar('route', { length: 100 }).default('oral').notNull(), // oral, topical, IV
    specialInstructions: varchar('special_instructions', { length: 500 }), // take after meals
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantRxItemIdx: index('tenant_rx_item_idx').on(table.tenantId, table.prescriptionId),
  })
);

export type PrescriptionItem = typeof prescriptionItems.$inferSelect;
export type NewPrescriptionItem = typeof prescriptionItems.$inferInsert;
