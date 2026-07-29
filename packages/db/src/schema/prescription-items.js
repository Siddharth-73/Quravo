"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionItems = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const prescriptions_1 = require("./prescriptions");
exports.prescriptionItems = (0, pg_core_1.pgTable)('prescription_items', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    prescriptionId: (0, pg_core_1.uuid)('prescription_id').notNull().references(() => prescriptions_1.prescriptions.id, { onDelete: 'cascade' }),
    medicationName: (0, pg_core_1.varchar)('medication_name', { length: 255 }).notNull(),
    dosage: (0, pg_core_1.varchar)('dosage', { length: 100 }).notNull(), // e.g. 500mg, 10ml
    frequency: (0, pg_core_1.varchar)('frequency', { length: 100 }).notNull(), // e.g. 1-0-1, twice daily
    duration: (0, pg_core_1.varchar)('duration', { length: 100 }).notNull(), // e.g. 5 days, 2 weeks
    route: (0, pg_core_1.varchar)('route', { length: 100 }).default('oral').notNull(), // oral, topical, IV
    specialInstructions: (0, pg_core_1.varchar)('special_instructions', { length: 500 }), // take after meals
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantRxItemIdx: (0, pg_core_1.index)('tenant_rx_item_idx').on(table.tenantId, table.prescriptionId),
}));
