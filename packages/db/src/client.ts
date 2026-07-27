import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export type Database = PostgresJsDatabase<typeof schema>;

let dbInstance: Database | null = null;
let queryClient: ReturnType<typeof postgres> | null = null;

export interface DbConfig {
  connectionString: string;
  maxConnections?: number;
}

export function createDatabaseClient(config: DbConfig): { db: Database; client: typeof queryClient } {
  if (!dbInstance) {
    queryClient = postgres(config.connectionString, {
      max: config.maxConnections || 20,
      idle_timeout: 30,
      connect_timeout: 10,
    });
    dbInstance = drizzle(queryClient, { schema });
  }
  return { db: dbInstance, client: queryClient };
}

export function getDatabase(): Database {
  if (!dbInstance) {
    const connectionString = process.env.DATABASE_URL || 'postgres://quravo:quravo_secret@localhost:5433/quravo_db';
    return createDatabaseClient({ connectionString }).db;
  }
  return dbInstance;
}

export const db = getDatabase();
