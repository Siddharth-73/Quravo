"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptions = exports.prescriptionStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const patients_1 = require("./patients");
const users_1 = require("./users");
const emr_encounters_1 = require("./emr-encounters");
exports.prescriptionStatusEnum = (0, pg_core_1.pgEnum)('prescription_status', ['active', 'discontinued', 'completed']);
exports.prescriptions = (0, pg_core_1.pgTable)('prescriptions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id').notNull().references(() => patients_1.patients.id, { onDelete: 'cascade' }),
    doctorId: (0, pg_core_1.uuid)('doctor_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    encounterId: (0, pg_core_1.uuid)('encounter_id').references(() => emr_encounters_1.emrEncounters.id, { onDelete: 'set null' }),
    prescriptionNumber: (0, pg_core_1.varchar)('prescription_number', { length: 100 }).notNull(),
    instructions: (0, pg_core_1.varchar)('instructions', { length: 1000 }),
    status: (0, exports.prescriptionStatusEnum)('status').default('active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantRxNoIdx: (0, pg_core_1.uniqueIndex)('tenant_rx_no_idx').on(table.tenantId, table.prescriptionNumber),
    tenantPatientRxIdx: (0, pg_core_1.index)('tenant_patient_rx_idx').on(table.tenantId, table.patientId),
}));
