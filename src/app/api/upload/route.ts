import { db } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const formData = await request.formData();

    const audio = formData.get('audio') as File | null;
    const cover = formData.get('cover') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const genre = formData.get('genre') as string;
    const bpm = formData.get('bpm') as string;
    const key = formData.get('key') as string || 'Cm';
    const mood = formData.get('mood') as string || '';
    const tagsStr = formData.get('tags') as string || '[]';
    const basicPrice = formData.get('basicPrice') as string;
    const premiumPrice = formData.get('premiumPrice') as string;
    const exclusivePrice = formData.get('exclusivePrice') as string;
    const producerId = formData.get('producerId') as string;

    if (!audio) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    // Validate audio file size (max 10MB)
    if (audio.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Audio file must be under 10MB' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Beat title is required' }, { status: 400 });
    }

    if (!genre) {
      return NextResponse.json({ error: 'Genre is required' }, { status: 400 });
    }

    if (!bpm) {
      return NextResponse.json({ error: 'BPM is required' }, { status: 400 });
    }

    if (!producerId) {
      return NextResponse.json({ error: 'Producer ID is required' }, { status: 400 });
    }

    // Verify producer exists
    const producer = await db.user.findUnique({
      where: { id: producerId },
    });

    if (!producer || producer.role !== 'producer') {
      return NextResponse.json({ error: 'Producer not found' }, { status: 404 });
    }

    // Convert audio file to base64 data URI
    const audioBuffer = Buffer.from(await audio.arrayBuffer());
    const audioMime = audio.type || 'audio/mpeg';
    const audioBase64 = audioBuffer.toString('base64');
    const audioPreviewUrl = `data:${audioMime};base64,${audioBase64}`;

    // Convert cover file to base64 data URI (optional)
    let coverUrl = `https://picsum.photos/seed/${Date.now()}/400/400`;
    if (cover) {
      const coverBuffer = Buffer.from(await cover.arrayBuffer());
      const coverMime = cover.type || 'image/jpeg';
      const coverBase64 = coverBuffer.toString('base64');
      coverUrl = `data:${coverMime};base64,${coverBase64}`;
    }

    // Parse tags
    let tags: string[] = [];
    try {
      if (tagsStr.startsWith('[')) {
        tags = JSON.parse(tagsStr);
      } else {
        tags = tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    } catch {
      tags = tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    // Create beat in database
    const beat = await db.beat.create({
      data: {
        title,
        description: description || null,
        genre,
        bpm: parseInt(bpm),
        key,
        mood: mood || null,
        tags: JSON.stringify(tags),
        coverUrl,
        audioPreviewUrl,
        basicPrice: parseFloat(basicPrice) || 999,
        premiumPrice: parseFloat(premiumPrice) || 2999,
        exclusivePrice: parseFloat(exclusivePrice) || 9999,
        producerId,
        status: 'active',
      },
      include: {
        producer: {
          select: { id: true, name: true, avatar: true, verified: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      beat,
      message: 'Beat uploaded successfully!',
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading beat:', error);
    return NextResponse.json(
      { error: 'Failed to upload beat. Please try again.' },
      { status: 500 }
    );
  }
}
