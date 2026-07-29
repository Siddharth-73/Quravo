"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchWorkingHours = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const clinic_branches_1 = require("./clinic-branches");
exports.branchWorkingHours = (0, pg_core_1.pgTable)('branch_working_hours', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    branchId: (0, pg_core_1.uuid)('branch_id').notNull().references(() => clinic_branches_1.clinicBranches.id, { onDelete: 'cascade' }),
    dayOfWeek: (0, pg_core_1.integer)('day_of_week').notNull(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    openTime: (0, pg_core_1.varchar)('open_time', { length: 10 }).default('09:00').notNull(),
    closeTime: (0, pg_core_1.varchar)('close_time', { length: 10 }).default('17:00').notNull(),
    isClosed: (0, pg_core_1.boolean)('is_closed').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    branchDayIdx: (0, pg_core_1.uniqueIndex)('branch_day_idx').on(table.branchId, table.dayOfWeek),
}));
