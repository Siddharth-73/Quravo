"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsSummaries = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const clinic_branches_1 = require("./clinic-branches");
exports.analyticsSummaries = (0, pg_core_1.pgTable)('analytics_summaries', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    branchId: (0, pg_core_1.uuid)('branch_id').references(() => clinic_branches_1.clinicBranches.id, { onDelete: 'cascade' }), // Optional: aggregate by branch or across tenant
    summaryDate: (0, pg_core_1.date)('summary_date').notNull(),
    // KPIs
    totalRevenue: (0, pg_core_1.numeric)('total_revenue', { precision: 15, scale: 2 }).default('0.00').notNull(),
    totalAppointments: (0, pg_core_1.integer)('total_appointments').default(0).notNull(),
    totalWalkIns: (0, pg_core_1.integer)('total_walk_ins').default(0).notNull(),
    newPatients: (0, pg_core_1.integer)('new_patients').default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantDateIdx: (0, pg_core_1.uniqueIndex)('tenant_date_idx').on(table.tenantId, table.branchId, table.summaryDate),
    tenantDateQueryIdx: (0, pg_core_1.index)('tenant_date_query_idx').on(table.tenantId, table.summaryDate),
}));
