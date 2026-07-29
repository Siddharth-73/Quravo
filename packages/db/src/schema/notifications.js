"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifications = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const users_1 = require("./users");
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    message: (0, pg_core_1.varchar)('message', { length: 1000 }).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 100 }).notNull(), // e.g., 'billing', 'appointment'
    isRead: (0, pg_core_1.boolean)('is_read').default(false).notNull(),
    readAt: (0, pg_core_1.timestamp)('read_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    notificationTenantUserIdx: (0, pg_core_1.index)('notification_tenant_user_idx').on(table.tenantId, table.userId, table.isRead),
}));
