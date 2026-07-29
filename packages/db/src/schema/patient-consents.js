"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientConsents = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const patients_1 = require("./patients");
exports.patientConsents = (0, pg_core_1.pgTable)('patient_consents', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    consentType: (0, pg_core_1.varchar)('consent_type', { length: 100 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).notNull(), // active, revoked, expired
    version: (0, pg_core_1.varchar)('version', { length: 20 }).notNull(),
    signedAt: (0, pg_core_1.timestamp)('signed_at', { withTimezone: true }),
    revokedAt: (0, pg_core_1.timestamp)('revoked_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
