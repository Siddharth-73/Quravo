import { pgTable, uuid, varchar, integer, timestamp, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { clinicBranches } from './clinic-branches';
import { patients } from './patients';
import { users } from './users';

export const appointmentTypeEnum = pgEnum('appointment_type', ['scheduled', 'walk_in']);
export const appointmentStatusEnum = pgEnum('appointment_status', [
  'scheduled',
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
]);

export const appointments = pgTable(
  'appointments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => clinicBranches.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    doctorId: uuid('doctor_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    appointmentNumber: varchar('appointment_number', { length: 100 }).notNull(),
    type: appointmentTypeEnum('type').default('scheduled').notNull(),
    status: appointmentStatusEnum('status').default('scheduled').notNull(),
    startTime: timestamp('start_time', { withTimezone: true }).notNull(),
    endTime: timestamp('end_time', { withTimezone: true }).notNull(),
    tokenNumber: integer('token_number'), // Daily walk-in queue token sequence (#1, #2, #3...)
    chiefComplaint: varchar('chief_complaint', { length: 1000 }),
    notes: varchar('notes', { length: 2000 }),
    cancelledReason: varchar('cancelled_reason', { length: 500 }),
    createdById: uuid('created_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantAptNoIdx: uniqueIndex('tenant_apt_no_idx').on(table.tenantId, table.appointmentNumber),
    tenantBranchRangeIdx: index('tenant_branch_range_idx').on(table.tenantId, table.branchId, table.startTime, table.endTime),
    doctorScheduleIdx: index('doctor_schedule_idx').on(table.tenantId, table.doctorId, table.startTime, table.endTime),
  })
);

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
