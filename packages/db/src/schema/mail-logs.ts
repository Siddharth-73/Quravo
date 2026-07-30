import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const mailLogs = pgTable('mail_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  to: varchar('to', { length: 255 }).notNull(),
  from: varchar('from', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  template: varchar('template', { length: 100 }),
  status: varchar('status', { length: 50 }).notNull().default('sent'), // 'sent', 'failed', 'queued'
  error: text('error'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type MailLog = typeof mailLogs.$inferSelect;
export type NewMailLog = typeof mailLogs.$inferInsert;
