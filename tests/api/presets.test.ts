import { describe, it, expect, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { setDbForTest, schema } from '@/db/index';
import { GET } from '@/app/api/presets/route';

describe('GET /api/presets', () => {
  beforeEach(async () => {
    const pglite = new PGlite();
    const dbClient = drizzle(pglite);
    await migrate(dbClient, { migrationsFolder: './drizzle' });
    setDbForTest(dbClient);

    await dbClient.insert(schema.ratePresets).values([
      { name: 'Engineer', attendeeCount: 1, hourlyRate: '50.00', isSystemDefault: true },
      { name: 'Team', attendeeCount: 5, hourlyRate: '150.00', isSystemDefault: true }
    ]);
  });

  it('returns JSON list of presets (AC 1)', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.presets).toHaveLength(2);
    expect(data.presets[0].name).toBe('Engineer');
    expect(data.presets[0].attendeeCount).toBe(1);
  });
});