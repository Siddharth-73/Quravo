"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushSubscriptions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const users_1 = require("./users");
exports.pushSubscriptions = (0, pg_core_1.pgTable)('push_subscriptions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    endpoint: (0, pg_core_1.text)('endpoint').notNull(),
    p256dh: (0, pg_core_1.varchar)('p256dh', { length: 255 }).notNull(),
    auth: (0, pg_core_1.varchar)('auth', { length: 255 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    userEndpointIdx: (0, pg_core_1.uniqueIndex)('user_endpoint_idx').on(table.userId, table.endpoint),
}));
