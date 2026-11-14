import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { setDbForTest, schema } from '@/db/index.js';
import { POST } from '@/app/api/cron/cleanup/route.js';
import { sql } from 'drizzle-orm';

describe('POST /api/cron/cleanup', () => {
  let dbClient: any;

  beforeEach(async () => {
    const pglite = new PGlite();
    dbClient = drizzle(pglite);
    await migrate(dbClient, { migrationsFolder: './drizzle' });
    setDbForTest(dbClient);
    vi.stubEnv('CRON_SECRET', 'test-secret');
  });

  it('should return 401 when token is missing or invalid (AC 2)', async () => {
    const res = await POST(new Request('http://localhost/api/cron/cleanup', { 
      headers: { 'Authorization': 'Bearer wrong' } 
    }));
    expect(res.status).toBe(401);
  });

  it('should delete sessions older than 30 days (AC 1, 4)', async () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 31);
    
    await dbClient.insert(schema.meetingSessions).values({
      publicId: 'expired-1',
      editKeyHash: 'h1',
      attendeeCount: 1,
      hourlyRate: '10.00',
      createdAt: oldDate
    });

    const res = await POST(new Request('http://localhost/api/cron/cleanup', { 
      headers: { 'Authorization': 'Bearer test-secret' } 
    }));
    
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.deletedCount).toBe(1);

    const remaining = await dbClient.execute(sql`SELECT count(*) FROM meeting_sessions`);
    expect(remaining.rows[0].count).toBe('0');
  });
});