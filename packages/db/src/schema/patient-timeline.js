"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientTimeline = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const patients_1 = require("./patients");
const users_1 = require("./users");
exports.patientTimeline = (0, pg_core_1.pgTable)('patient_timeline', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    eventType: (0, pg_core_1.varchar)('event_type', { length: 100 }).notNull(), // registered, attachment_added, note_added
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.varchar)('description', { length: 1000 }),
    metadata: (0, pg_core_1.jsonb)('metadata').$type().default({}).notNull(),
    createdById: (0, pg_core_1.uuid)('created_by_id').references(() => users_1.users.id, { onDelete: 'set null' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantPatientTimelineIdx: (0, pg_core_1.index)('tenant_patient_timeline_idx').on(table.tenantId, table.patientId, table.createdAt),
}));
