import { pgTable, uuid, varchar, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { appointments } from './appointments';

export const reminderTypeEnum = pgEnum('reminder_type', ['email', 'sms']);
export const reminderStatusEnum = pgEnum('reminder_status', ['pending', 'sent', 'failed']);

export const appointmentReminders = pgTable(
  'appointment_reminders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    appointmentId: uuid('appointment_id').notNull().references(() => appointments.id, { onDelete: 'cascade' }),
    reminderType: reminderTypeEnum('reminder_type').default('email').notNull(),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),
    status: reminderStatusEnum('status').default('pending').notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantReminderIdx: index('tenant_reminder_idx').on(table.tenantId, table.scheduledFor, table.status),
  })
);

export type AppointmentReminder = typeof appointmentReminders.$inferSelect;
export type NewAppointmentReminder = typeof appointmentReminders.$inferInsert;
