import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

function createDbClient() {
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    if (process.env['NODE_ENV'] === 'test') {
      return null as unknown as ReturnType<typeof drizzle>;
    }
    throw new Error('DATABASE_URL environment variable is mandatory for database connection. Set it in your environment variables.');
  }
  const sql = neon(connectionString);
  return drizzle({ client: sql, schema });
}

export let db = createDbClient();

export function setDbForTest(client: any) {
  db = client;
}

export { schema };