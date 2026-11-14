import { NextResponse } from 'next/server';
import { db, schema } from '@/db/index';

export async function GET() {
  try {
    const presets = await db.select().from(schema.ratePresets).orderBy(schema.ratePresets.name);
    
    return NextResponse.json({
      presets: presets.map(p => ({
        id: p.id,
        name: p.name,
        attendeeCount: p.attendeeCount,
        hourlyRate: Number(p.hourlyRate),
      })),
    });
  } catch (error) {
    console.error('Preset lookup failed:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}