"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.userStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userStatusEnum = (0, pg_core_1.pgEnum)('user_status', ['active', 'suspended', 'pending']);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.varchar)('password_hash', { length: 255 }).notNull(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    dob: (0, pg_core_1.varchar)('dob', { length: 20 }), // YYYY-MM-DD
    gender: (0, pg_core_1.varchar)('gender', { length: 20 }),
    avatar: (0, pg_core_1.varchar)('avatar', { length: 500 }),
    preferredLanguage: (0, pg_core_1.varchar)('preferred_language', { length: 20 }).default('en').notNull(),
    notificationPreferences: (0, pg_core_1.jsonb)('notification_preferences').$type().default({
        email: true,
        sms: true,
        push: true,
    }).notNull(),
    isEmailVerified: (0, pg_core_1.boolean)('is_email_verified').default(false).notNull(),
    status: (0, exports.userStatusEnum)('status').default('active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
