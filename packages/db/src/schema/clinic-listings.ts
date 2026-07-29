import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';

export const clinicListings = pgTable(
  'clinic_listings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clinicName: varchar('clinic_name', { length: 255 }).notNull(),
    ownerName: varchar('owner_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }).notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    specialty: varchar('specialty', { length: 255 }),
    estimatedMonthlyPatients: varchar('estimated_monthly_patients', { length: 100 }),
    additionalNotes: text('additional_notes'),
    status: varchar('status', { length: 50 }).default('pending').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('clinic_listings_email_idx').on(table.email),
    statusIdx: index('clinic_listings_status_idx').on(table.status),
  })
);

export type ClinicListing = typeof clinicListings.$inferSelect;
export type NewClinicListing = typeof clinicListings.$inferInsert;
