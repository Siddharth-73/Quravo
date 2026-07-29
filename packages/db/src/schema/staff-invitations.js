"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffInvitations = exports.inviteStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const clinic_branches_1 = require("./clinic-branches");
const users_1 = require("./users");
exports.inviteStatusEnum = (0, pg_core_1.pgEnum)('invite_status', ['pending', 'accepted', 'expired', 'revoked']);
exports.staffInvitations = (0, pg_core_1.pgTable)('staff_invitations', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    branchId: (0, pg_core_1.uuid)('branch_id').references(() => clinic_branches_1.clinicBranches.id, { onDelete: 'set null' }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull(),
    role: (0, pg_core_1.varchar)('role', { length: 50 }).default('staff').notNull(),
    tokenHash: (0, pg_core_1.varchar)('token_hash', { length: 255 }).notNull().unique(),
    invitedByUserId: (0, pg_core_1.uuid)('invited_by_user_id').references(() => users_1.users.id, { onDelete: 'set null' }),
    status: (0, exports.inviteStatusEnum)('status').default('pending').notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
