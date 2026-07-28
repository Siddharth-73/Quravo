import { pgTable, uuid, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

export const patientFavorites = pgTable(
  'patient_favorites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    targetType: varchar('target_type', { length: 50 }).notNull(), // doctor, clinic
    targetId: uuid('target_id').notNull(), // reference to either users.id (doctor) or tenants.id (clinic)
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userFavoriteIdx: uniqueIndex('user_favorite_idx').on(table.userId, table.targetType, table.targetId),
  })
);

export type PatientFavorite = typeof patientFavorites.$inferSelect;
export type NewPatientFavorite = typeof patientFavorites.$inferInsert;
