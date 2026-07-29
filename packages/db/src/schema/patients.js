"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patients = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const users_1 = require("./users");
exports.patients = (0, pg_core_1.pgTable)('patients', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id').references(() => users_1.users.id, { onDelete: 'set null' }),
    patientNumber: (0, pg_core_1.varchar)('patient_number', { length: 100 }).notNull(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }).notNull(),
    dateOfBirth: (0, pg_core_1.varchar)('date_of_birth', { length: 20 }).notNull(), // YYYY-MM-DD
    gender: (0, pg_core_1.varchar)('gender', { length: 20 }).notNull(), // male, female, other
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    emergencyContactName: (0, pg_core_1.varchar)('emergency_contact_name', { length: 255 }),
    emergencyContactPhone: (0, pg_core_1.varchar)('emergency_contact_phone', { length: 50 }),
    bloodGroup: (0, pg_core_1.varchar)('blood_group', { length: 10 }),
    maritalStatus: (0, pg_core_1.varchar)('marital_status', { length: 50 }),
    occupation: (0, pg_core_1.varchar)('occupation', { length: 100 }),
    nationality: (0, pg_core_1.varchar)('nationality', { length: 100 }),
    address: (0, pg_core_1.varchar)('address', { length: 500 }),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 100 }),
    postalCode: (0, pg_core_1.varchar)('postal_code', { length: 20 }),
    isVip: (0, pg_core_1.boolean)('is_vip').default(false).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantPatientNoIdx: (0, pg_core_1.uniqueIndex)('tenant_patient_no_idx').on(table.tenantId, table.patientNumber),
    tenantSearchIdx: (0, pg_core_1.index)('tenant_patient_search_idx').on(table.tenantId, table.firstName, table.lastName, table.phone),
}));
