import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { db, schema } from '@/db/index';

const createSessionSchema = z.object({
  attendeeCount: z.number().int().min(1),
  hourlyRate: z.number().min(0),
  currencySymbol: z.string().optional().default('$'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = createSessionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { attendeeCount, hourlyRate, currencySymbol } = validation.data;

    const publicId = crypto.randomUUID();
    const editKey = crypto.randomBytes(32).toString('hex');
    const editKeyHash = crypto.createHash('sha256').update(editKey).digest('hex');

    const [session] = await db
      .insert(schema.meetingSessions)
      .values({
        publicId,
        editKeyHash,
        attendeeCount,
        hourlyRate: hourlyRate,
        currencySymbol,
        status: 'running',
      })
      .returning({ startedAt: schema.meetingSessions.startedAt });

    return NextResponse.json(
      {
        publicId,
        editKey,
        startedAt: session.startedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Session creation failed:', error);
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}