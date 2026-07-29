"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantMemberships = exports.membershipStatusEnum = exports.membershipRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
const tenants_1 = require("./tenants");
exports.membershipRoleEnum = (0, pg_core_1.pgEnum)('membership_role', [
    'owner',
    'admin',
    'doctor',
    'nurse',
    'receptionist',
    'accountant',
    'staff',
    'patient',
]);
exports.membershipStatusEnum = (0, pg_core_1.pgEnum)('membership_status', ['active', 'invited', 'suspended']);
exports.tenantMemberships = (0, pg_core_1.pgTable)('tenant_memberships', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    role: (0, exports.membershipRoleEnum)('role').default('staff').notNull(),
    status: (0, exports.membershipStatusEnum)('status').default('active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tenantUserIdx: (0, pg_core_1.uniqueIndex)('tenant_user_idx').on(table.tenantId, table.userId),
}));
