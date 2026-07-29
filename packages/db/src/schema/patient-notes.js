"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientNotes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const patients_1 = require("./patients");
const users_1 = require("./users");
exports.patientNotes = (0, pg_core_1.pgTable)('patient_notes', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    authorId: (0, pg_core_1.uuid)('author_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    note: (0, pg_core_1.text)('note').notNull(),
    visibility: (0, pg_core_1.varchar)('visibility', { length: 20 }).default('internal').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
