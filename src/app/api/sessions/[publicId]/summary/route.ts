import { NextResponse } from 'next/server';
import { db, schema } from '@/db/index';
import { eq } from 'drizzle-orm';
import { formatDuration, formatCurrency } from '@/lib/utils';

export async function GET(_req: Request, { params }: { params: Promise<{ publicId: string }> }) {
  try {
    const { publicId } = await params;

    const [session] = await db
      .select()
      .from(schema.meetingSessions)
      .where(eq(schema.meetingSessions.publicId, publicId));

    if (!session || session.status !== 'ended') {
      return NextResponse.json({ error: 'SUMMARY_NOT_FOUND' }, { status: 404 });
    }

    const durationFormatted = formatDuration(session.finalDurationSeconds!);
    const totalCostFormatted = formatCurrency(session.finalTotalCost!);

    return NextResponse.json({
      publicId: session.publicId,
      durationFormatted,
      totalCostFormatted,
      summaryText: `Meeting duration: ${durationFormatted}, Total Cost: ${totalCostFormatted}`,
    });
  } catch (error) {
    console.error('Summary fetch failed:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}