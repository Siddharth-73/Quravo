"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientTagAssignments = exports.patientTags = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const patients_1 = require("./patients");
exports.patientTags = (0, pg_core_1.pgTable)('patient_tags', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    color: (0, pg_core_1.varchar)('color', { length: 20 }).default('#cccccc').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantTagNameIdx: (0, pg_core_1.uniqueIndex)('tenant_tag_name_idx').on(table.tenantId, table.name),
}));
exports.patientTagAssignments = (0, pg_core_1.pgTable)('patient_tag_assignments', {
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    tagId: (0, pg_core_1.uuid)('tag_id').notNull().references(() => exports.patientTags.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    patientTagIdx: (0, pg_core_1.uniqueIndex)('patient_tag_idx').on(table.patientId, table.tagId),
}));
