"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationTokens = exports.tokenTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.tokenTypeEnum = (0, pg_core_1.pgEnum)('token_type', ['email_verification', 'password_reset']);
exports.verificationTokens = (0, pg_core_1.pgTable)('verification_tokens', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    tokenHash: (0, pg_core_1.varchar)('token_hash', { length: 255 }).notNull().unique(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    type: (0, exports.tokenTypeEnum)('type').notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
