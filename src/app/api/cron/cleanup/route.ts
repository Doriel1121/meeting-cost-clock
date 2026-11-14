import { NextResponse } from 'next/server';
import { db, schema } from '@/db/index';
import { lt } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const cronSecret = process.env['CRON_SECRET'];

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleted = await db
      .delete(schema.meetingSessions)
      .where(lt(schema.meetingSessions.createdAt, thirtyDaysAgo))
      .returning();

    console.log(`Cron cleanup: deleted ${deleted.length} sessions.`);

    return NextResponse.json({ deletedCount: deleted.length }, { status: 200 });
  } catch (error) {
    console.error('Cron cleanup failed:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}