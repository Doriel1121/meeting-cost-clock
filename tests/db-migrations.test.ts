import { describe, it, expect } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import fs from 'fs';
import path from 'path';

describe('Database Migrations (AC 1, 3)', () => {
  it('should apply and rollback the initial schema successfully', async () => {
    const pglite = new PGlite();
    const db = drizzle(pglite);
    const migrationsFolder = './drizzle';

    await migrate(db, { migrationsFolder });
    
    const tables = await pglite.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    const tableNames = (tables as any).rows.map((r: any) => r.tablename);
    expect(tableNames).toContain('meeting_sessions');
    expect(tableNames).toContain('rate_presets');

    const rollbackSql = fs.readFileSync(path.join(migrationsFolder, '0000_rollback.sql'), 'utf-8');
    await pglite.query(rollbackSql);

    const postRollbackTables = await pglite.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    expect((postRollbackTables as any).rows.length).toBe(0);
  });
});