import { NextResponse } from 'next/server';
import { db, schema } from '@/db/index';
import { eq } from 'drizzle-orm';

export async function GET(_req: Request, { params }: { params: Promise<{ publicId: string }> }) {
  try {
    const { publicId } = await params;

    const [session] = await db
      .select()
      .from(schema.meetingSessions)
      .where(eq(schema.meetingSessions.publicId, publicId));

    if (!session) {
      return NextResponse.json({ error: 'SESSION_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({
      publicId: session.publicId,
      attendeeCount: session.attendeeCount,
      hourlyRate: Number(session.hourlyRate),
      currencySymbol: session.currencySymbol,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      finalDurationSeconds: session.finalDurationSeconds,
      finalTotalCost: session.finalTotalCost ? Number(session.finalTotalCost) : null,
    });
  } catch (error) {
    console.error('Session lookup failed:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}