import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

function createDbClient() {
  const connectionString = process.env['DATABASE_URL';
  if (!connectionString) {
    if (process.env['NODE_ENV'] === 'test') {
      return null as unknown as ReturnType<typeof drizzle>;
    }
    throw new Error('DATABASE_URL environment variable is mandatory for database connection.');
  }
  const sql = neon(connectionString);
  return drizzle({ client: sql, schema });
}

export const db = createDbClient();
export { schema };