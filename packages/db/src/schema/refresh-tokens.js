"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
const tenants_1 = require("./tenants");
exports.refreshTokens = (0, pg_core_1.pgTable)('refresh_tokens', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tokenHash: (0, pg_core_1.varchar)('token_hash', { length: 255 }).notNull().unique(),
    familyId: (0, pg_core_1.uuid)('family_id').notNull(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    tenantId: (0, pg_core_1.uuid)('tenant_id').notNull().references(() => tenants_1.tenants.id, { onDelete: 'cascade' }),
    isRevoked: (0, pg_core_1.boolean)('is_revoked').default(false).notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
