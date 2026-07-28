import { pgTable, uuid, varchar, boolean, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const userStatusEnum = pgEnum('user_status', ['active', 'suspended', 'pending']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  dob: varchar('dob', { length: 20 }), // YYYY-MM-DD
  gender: varchar('gender', { length: 20 }),
  avatar: varchar('avatar', { length: 500 }),
  preferredLanguage: varchar('preferred_language', { length: 20 }).default('en').notNull(),
  notificationPreferences: jsonb('notification_preferences').$type<Record<string, boolean>>().default({
    email: true,
    sms: true,
    push: true,
  }).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  status: userStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
