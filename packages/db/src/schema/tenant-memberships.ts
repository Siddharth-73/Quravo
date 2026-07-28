import { pgTable, uuid, varchar, timestamp, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';
import { tenants } from './tenants';

export const membershipRoleEnum = pgEnum('membership_role', [
  'owner',
  'admin',
  'doctor',
  'nurse',
  'receptionist',
  'accountant',
  'staff',
]);

export const membershipStatusEnum = pgEnum('membership_status', ['active', 'invited', 'suspended']);

export const tenantMemberships = pgTable(
  'tenant_memberships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: membershipRoleEnum('role').default('staff').notNull(),
    status: membershipStatusEnum('status').default('active').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tenantUserIdx: uniqueIndex('tenant_user_idx').on(table.tenantId, table.userId),
  })
);

export type TenantMembership = typeof tenantMemberships.$inferSelect;
export type NewTenantMembership = typeof tenantMemberships.$inferInsert;
