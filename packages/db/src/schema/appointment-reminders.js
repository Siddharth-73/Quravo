"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentReminders = exports.reminderStatusEnum = exports.reminderTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const appointments_1 = require("./appointments");
exports.reminderTypeEnum = (0, pg_core_1.pgEnum)('reminder_type', ['email', 'sms']);
exports.reminderStatusEnum = (0, pg_core_1.pgEnum)('reminder_status', ['pending', 'sent', 'failed']);
exports.appointmentReminders = (0, pg_core_1.pgTable)('appointment_reminders', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    appointmentId: (0, pg_core_1.uuid)('appointment_id').notNull().references(() => appointments_1.appointments.id, { onDelete: 'cascade' }),
    reminderType: (0, exports.reminderTypeEnum)('reminder_type').default('email').notNull(),
    scheduledFor: (0, pg_core_1.timestamp)('scheduled_for', { withTimezone: true }).notNull(),
    status: (0, exports.reminderStatusEnum)('status').default('pending').notNull(),
    sentAt: (0, pg_core_1.timestamp)('sent_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantReminderIdx: (0, pg_core_1.index)('tenant_reminder_idx').on(table.tenantId, table.scheduledFor, table.status),
}));
