import { pgTable, uuid, timestamp, date, numeric, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { clinicBranches } from './clinic-branches';

export const analyticsSummaries = pgTable(
  'analytics_summaries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').references(() => clinicBranches.id, { onDelete: 'cascade' }), // Optional: aggregate by branch or across tenant
    
    summaryDate: date('summary_date').notNull(),
    
    // KPIs
    totalRevenue: numeric('total_revenue', { precision: 15, scale: 2 }).default('0.00').notNull(),
    totalAppointments: integer('total_appointments').default(0).notNull(),
    totalWalkIns: integer('total_walk_ins').default(0).notNull(),
    newPatients: integer('new_patients').default(0).notNull(),
    
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantDateIdx: uniqueIndex('tenant_date_idx').on(table.tenantId, table.branchId, table.summaryDate),
    tenantDateQueryIdx: index('tenant_date_query_idx').on(table.tenantId, table.summaryDate),
  })
);

export type AnalyticsSummary = typeof analyticsSummaries.$inferSelect;
export type NewAnalyticsSummary = typeof analyticsSummaries.$inferInsert;
