import { pgTable, uuid, integer, varchar, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { clinicBranches } from './clinic-branches';

export const branchWorkingHours = pgTable(
  'branch_working_hours',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => clinicBranches.id, { onDelete: 'cascade' }),
    dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    openTime: varchar('open_time', { length: 10 }).default('09:00').notNull(),
    closeTime: varchar('close_time', { length: 10 }).default('17:00').notNull(),
    isClosed: boolean('is_closed').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    branchDayIdx: uniqueIndex('branch_day_idx').on(table.branchId, table.dayOfWeek),
  })
);

export type BranchWorkingHour = typeof branchWorkingHours.$inferSelect;
export type NewBranchWorkingHour = typeof branchWorkingHours.$inferInsert;
