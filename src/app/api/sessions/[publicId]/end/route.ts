import { NextResponse } from 'next/server';
import { db, schema } from '@/db/index';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ publicId: string }> }) {
  try {
    const { publicId } = await params;
    const editKey = req.headers.get('X-Edit-Key');

    if (!editKey) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const [session] = await db
      .select()
      .from(schema.meetingSessions)
      .where(eq(schema.meetingSessions.publicId, publicId));

    if (!session) {
      return NextResponse.json({ error: 'SESSION_NOT_FOUND' }, { status: 404 });
    }

    if (session.status === 'ended') {
      return NextResponse.json({ error: 'SESSION_ALREADY_ENDED' }, { status: 409 });
    }

    const providedHash = crypto.createHash('sha256').update(editKey).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(providedHash), Buffer.from(session.editKeyHash))) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const now = new Date();
    const startTime = new Date(session.startedAt);
    const diffSeconds = Math.max(0, Math.floor((now.getTime() - startTime.getTime()) / 1000));
    const totalCost = (diffSeconds / 3600) * Number(session.hourlyRate) * session.attendeeCount;

    const [updated] = await db
      .update(schema.meetingSessions)
      .set({
        status: 'ended',
        endedAt: now,
        finalDurationSeconds: diffSeconds,
        finalTotalCost: totalCost.toString(),
      })
      .where(eq(schema.meetingSessions.publicId, publicId))
      .returning();

    return NextResponse.json({
      publicId: updated.publicId,
      status: updated.status,
      finalDurationSeconds: updated.finalDurationSeconds,
      finalTotalCost: Number(updated.finalTotalCost),
    });
  } catch (error) {
    console.error('Session end failed:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}