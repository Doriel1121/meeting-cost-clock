import { describe, it, expect, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { setDbForTest, schema } from '@/db/index.js';
import { GET as GET_SESSION } from '@/app/api/sessions/[publicId]/route.js';
import { POST as POST_END } from '@/app/api/sessions/[publicId]/end/route.js';
import { GET as GET_SUMMARY } from '@/app/api/sessions/[publicId]/summary/route.js';
import crypto from 'crypto';

describe('Meeting Session API Integration', () => {
  let dbClient: any;

  beforeEach(async () => {
    const pglite = new PGlite();
    dbClient = drizzle(pglite);
    await migrate(dbClient, { migrationsFolder: './drizzle' });
    setDbForTest(dbClient);
  });

  it('should retrieve session state (AC 1)', async () => {
    const publicId = crypto.randomUUID();
    await dbClient.insert(schema.meetingSessions).values({
      publicId,
      editKeyHash: 'hash',
      attendeeCount: 5,
      hourlyRate: '100.00',
    });

    const res = await GET_SESSION(new Request(`http://localhost/api/sessions/${publicId}`), { params: Promise.resolve({ publicId }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.publicId).toBe(publicId);
    expect(data.attendeeCount).toBe(5);
  });

  it('should terminate session with valid edit key (AC 2)', async () => {
    const publicId = crypto.randomUUID();
    const editKey = 'secret-key-123';
    const hash = crypto.createHash('sha256').update(editKey).digest('hex');

    await dbClient.insert(schema.meetingSessions).values({
      publicId,
      editKeyHash: hash,
      attendeeCount: 1,
      hourlyRate: '60.00',
    });

    const res = await POST_END(new Request(`http://localhost/api/sessions/${publicId}/end`, {
      headers: { 'X-Edit-Key': editKey }
    }), { params: Promise.resolve({ publicId }) });
    
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ended');
    expect(data.finalTotalCost).toBeGreaterThan(0);
  });

  it('should fail to terminate session without valid edit key (AC 3)', async () => {
    const publicId = crypto.randomUUID();
    await dbClient.insert(schema.meetingSessions).values({
      publicId,
      editKeyHash: 'some-hash',
      attendeeCount: 1,
      hourlyRate: '60.00',
    });

    const res = await POST_END(new Request(`http://localhost/api/sessions/${publicId}/end`, {
      headers: { 'X-Edit-Key': 'wrong-key' }
    }), { params: Promise.resolve({ publicId }) });
    
    expect(res.status).toBe(401);
  });

  it('should retrieve summary of ended meeting (AC 4)', async () => {
    const publicId = crypto.randomUUID();
    await dbClient.insert(schema.meetingSessions).values({
      publicId,
      editKeyHash: 'hash',
      attendeeCount: 1,
      hourlyRate: '60.00',
      status: 'ended',
      finalDurationSeconds: 3600,
      finalTotalCost: '60.00'
    });

    const res = await GET_SUMMARY(new Request(`http://localhost/api/sessions/${publicId}/summary`), { params: Promise.resolve({ publicId }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.summaryText).toContain('$60.00');
    expect(data.durationFormatted).toBe('60m 0s');
  });
});