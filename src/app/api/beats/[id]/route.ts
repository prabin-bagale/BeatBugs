import { db } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSeeded();
    const { id } = await params;
    const beat = await db.beat.findUnique({
      where: { id },
      include: {
        producer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            verified: true,
            beats: {
              where: { status: 'active' },
              take: 5,
              orderBy: { plays: 'desc' },
              select: { id: true, title: true, coverUrl: true, genre: true, bpm: true },
            },
          },
        },
      },
    });

    if (!beat) {
      return NextResponse.json({ error: 'Beat not found' }, { status: 404 });
    }

    // Increment plays
    await db.beat.update({
      where: { id },
      data: { plays: { increment: 1 } },
    });

    return NextResponse.json({ beat: { ...beat, plays: beat.plays + 1 } });
  } catch (error) {
    console.error('Error fetching beat:', error);
    return NextResponse.json({ error: 'Failed to fetch beat' }, { status: 500 });
  }
}
