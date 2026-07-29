"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientFavorites = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.patientFavorites = (0, pg_core_1.pgTable)('patient_favorites', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    targetType: (0, pg_core_1.varchar)('target_type', { length: 50 }).notNull(), // doctor, clinic
    targetId: (0, pg_core_1.uuid)('target_id').notNull(), // reference to either users.id (doctor) or tenants.id (clinic)
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    userFavoriteIdx: (0, pg_core_1.uniqueIndex)('user_favorite_idx').on(table.userId, table.targetType, table.targetId),
}));
