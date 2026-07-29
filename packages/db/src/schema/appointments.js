"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointments = exports.appointmentStatusEnum = exports.appointmentTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const clinic_branches_1 = require("./clinic-branches");
const patients_1 = require("./patients");
const users_1 = require("./users");
exports.appointmentTypeEnum = (0, pg_core_1.pgEnum)('appointment_type', ['scheduled', 'walk_in']);
exports.appointmentStatusEnum = (0, pg_core_1.pgEnum)('appointment_status', [
    'scheduled',
    'checked_in',
    'in_progress',
    'completed',
    'cancelled',
    'no_show',
]);
exports.appointments = (0, pg_core_1.pgTable)('appointments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    branchId: (0, pg_core_1.uuid)('branch_id').notNull().references(() => clinic_branches_1.clinicBranches.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    doctorId: (0, pg_core_1.uuid)('doctor_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    appointmentNumber: (0, pg_core_1.varchar)('appointment_number', { length: 100 }).notNull(),
    type: (0, exports.appointmentTypeEnum)('type').default('scheduled').notNull(),
    status: (0, exports.appointmentStatusEnum)('status').default('scheduled').notNull(),
    startTime: (0, pg_core_1.timestamp)('start_time', { withTimezone: true }).notNull(),
    endTime: (0, pg_core_1.timestamp)('end_time', { withTimezone: true }).notNull(),
    tokenNumber: (0, pg_core_1.integer)('token_number'), // Daily walk-in queue token sequence (#1, #2, #3...)
    chiefComplaint: (0, pg_core_1.varchar)('chief_complaint', { length: 1000 }),
    notes: (0, pg_core_1.varchar)('notes', { length: 2000 }),
    cancelledReason: (0, pg_core_1.varchar)('cancelled_reason', { length: 500 }),
    createdById: (0, pg_core_1.uuid)('created_by_id').references(() => users_1.users.id, { onDelete: 'set null' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantAptNoIdx: (0, pg_core_1.uniqueIndex)('tenant_apt_no_idx').on(table.tenantId, table.appointmentNumber),
    tenantBranchRangeIdx: (0, pg_core_1.index)('tenant_branch_range_idx').on(table.tenantId, table.branchId, table.startTime, table.endTime),
    doctorScheduleIdx: (0, pg_core_1.index)('doctor_schedule_idx').on(table.tenantId, table.doctorId, table.startTime, table.endTime),
}));
