"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clinicBranches = exports.branchStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
exports.branchStatusEnum = (0, pg_core_1.pgEnum)('branch_status', ['active', 'inactive', 'maintenance']);
exports.clinicBranches = (0, pg_core_1.pgTable)('clinic_branches', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 50 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    address: (0, pg_core_1.varchar)('address', { length: 500 }),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 100 }),
    postalCode: (0, pg_core_1.varchar)('postal_code', { length: 20 }),
    country: (0, pg_core_1.varchar)('country', { length: 100 }).default('US'),
    isMain: (0, pg_core_1.boolean)('is_main').default(false).notNull(),
    status: (0, exports.branchStatusEnum)('status').default('active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
