import { describe, it, expect, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { meetingSessions, ratePresets } from '../src/db/schema.js';
import { sql } from 'drizzle-orm';

describe('Database Schema & Migrations', () => {
  let dbClient: any;

  beforeEach(async () => {
    const pglite = new PGlite();
    dbClient = drizzle(pglite);
    await migrate(dbClient, { migrationsFolder: './drizzle' });
  });

  it('should have meeting_sessions and rate_presets tables defined (AC 2)', async () => {
    expect(meetingSessions).toBeDefined();
    expect(ratePresets).toBeDefined();
    const tables = await dbClient.execute(sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`);
    const tableNames = tables.rows.map((r: any) => r.tablename);
    expect(tableNames).toContain('meeting_sessions');
    expect(tableNames).toContain('rate_presets');
  });

  it('should enforce attendee_count >= 1 and hourly_rate >= 0 (AC 2)', async () => {
    await expect(dbClient.insert(meetingSessions).values({
      publicId: 'test-1',
      editKeyHash: 'hash',
      attendeeCount: 0,
      hourlyRate: '50.00'
    })).rejects.toThrow(/check_attendee_count/);
    await expect(dbClient.insert(meetingSessions).values({
      publicId: 'test-2',
      editKeyHash: 'hash',
      attendeeCount: 1,
      hourlyRate: '-10.00'
    })).rejects.toThrow(/check_hourly_rate/);
  });

  it('should successfully apply initial migration to PGlite (AC 3)', async () => {
    const result = await dbClient.execute(sql`SELECT count(*) FROM meeting_sessions`);
    expect(result.rows[0].count).toBe('0');
  });
});