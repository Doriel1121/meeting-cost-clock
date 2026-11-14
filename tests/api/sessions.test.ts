import { describe, it, expect, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { POST } from '@/app/api/sessions/route';
import { setDbForTest, schema } from '@/db/index';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

describe('POST /api/sessions', () => {
  let dbClient: any;

  beforeEach(async () => {
    const pglite = new PGlite();
    dbClient = drizzle(pglite);
    await migrate(dbClient, { migrationsFolder: './drizzle' });
    setDbForTest(dbClient);
  });

  it('should create session and return publicId, editKey, and startedAt (AC 1)', async () => {
    const req = new Request('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ attendeeCount: 5, hourlyRate: 50.00 }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.publicId).toBeDefined();
    expect(data.editKey).toBeDefined();
    expect(data.startedAt).toBeDefined();

    const saved = await dbClient.select().from(schema.meetingSessions).where(eq(schema.meetingSessions.publicId, data.publicId));
    expect(saved.length).toBe(1);
  });

  it('should store SHA-256 hash of editKey (AC 2)', async () => {
    const req = new Request('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ attendeeCount: 1, hourlyRate: 100.00 }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    const data = await res.json();
    
    const saved = await dbClient.select().from(schema.meetingSessions).where(eq(schema.meetingSessions.publicId, data.publicId));
    const expectedHash = crypto.createHash('sha256').update(data.editKey).digest('hex');
    
    expect(saved[0].editKeyHash).toBe(expectedHash);
  });

  it('should fail on invalid inputs (AC 3)', async () => {
    const req1 = new Request('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ attendeeCount: 0, hourlyRate: 50.00 }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res1 = await POST(req1);
    expect(res1.status).toBe(400);

    const req2 = new Request('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ attendeeCount: 5, hourlyRate: -10.00 }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res2 = await POST(req2);
    expect(res2.status).toBe(400);
  });

  it('should respond within latency budget (AC 4)', async () => {
    const req = new Request('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ attendeeCount: 1, hourlyRate: 50.00 }),
      headers: { 'Content-Type': 'application/json' },
    });
    const start = performance.now();
    await POST(req);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(150);
  });
});