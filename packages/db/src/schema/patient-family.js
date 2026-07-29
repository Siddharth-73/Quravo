"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientFamilyMembers = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.patientFamilyMembers = (0, pg_core_1.pgTable)('patient_family_members', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    primaryUserId: (0, pg_core_1.uuid)('primary_user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    linkedUserId: (0, pg_core_1.uuid)('linked_user_id').references(() => users_1.users.id, { onDelete: 'set null' }),
    relationship: (0, pg_core_1.varchar)('relationship', { length: 50 }).notNull(), // parent, child, spouse, etc.
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }), // for unregistered dependents
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }),
    dateOfBirth: (0, pg_core_1.varchar)('date_of_birth', { length: 20 }),
    gender: (0, pg_core_1.varchar)('gender', { length: 20 }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
