import { db } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const coverFile = formData.get('cover') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const genre = formData.get('genre') as string;
    const bpm = parseInt(formData.get('bpm') as string) || 120;
    const key = formData.get('key') as string || 'Cm';
    const mood = formData.get('mood') as string || '';
    const tags = formData.get('tags') as string || '[]';
    const basicPrice = parseFloat(formData.get('basicPrice') as string) || 999;
    const premiumPrice = parseFloat(formData.get('premiumPrice') as string) || 2999;
    const exclusivePrice = parseFloat(formData.get('exclusivePrice') as string) || 9999;
    const producerId = formData.get('producerId') as string;

    // Validate required fields
    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: 'Beat title is required' }, { status: 400 });
    }
    if (!genre) {
      return NextResponse.json({ error: 'Genre is required' }, { status: 400 });
    }
    if (!producerId) {
      return NextResponse.json({ error: 'Producer ID is required' }, { status: 400 });
    }

    // Validate producer exists
    const producer = await db.user.findUnique({ where: { id: producerId } });
    if (!producer) {
      return NextResponse.json({ error: 'Producer not found' }, { status: 404 });
    }

    // Generate unique beat ID
    const beatId = randomUUID();

    // Ensure upload directories exist
    const audioDir = join(process.cwd(), 'public', 'uploads', 'audio');
    const coverDir = join(process.cwd(), 'public', 'uploads', 'covers');
    await mkdir(audioDir, { recursive: true });
    await mkdir(coverDir, { recursive: true });

    // Save audio file
    const audioExt = audioFile.name.split('.').pop() || 'mp3';
    const audioFilename = `${beatId}.${audioExt}`;
    const audioPath = join(audioDir, audioFilename);
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    await writeFile(audioPath, audioBuffer);
    const audioPreviewUrl = `/uploads/audio/${audioFilename}`;

    // Save cover file (optional)
    let coverUrl = `https://picsum.photos/seed/${beatId}/600/600`;
    if (coverFile) {
      const coverExt = coverFile.name.split('.').pop() || 'jpg';
      const coverFilename = `${beatId}.${coverExt}`;
      const coverPath = join(coverDir, coverFilename);
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
      await writeFile(coverPath, coverBuffer);
      coverUrl = `/uploads/covers/${coverFilename}`;
    }

    // Create beat in database
    const beat = await db.beat.create({
      data: {
        id: beatId,
        title,
        description,
        genre,
        bpm,
        key,
        mood,
        tags: JSON.stringify(tags.split(',').map((t: string) => t.trim()).filter(Boolean)),
        coverUrl,
        audioPreviewUrl,
        basicPrice,
        premiumPrice,
        exclusivePrice,
        producerId,
        status: 'active',
      },
    });

    return NextResponse.json({
      beat,
      message: 'Beat uploaded successfully!',
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading beat:', error);
    return NextResponse.json({ error: 'Failed to upload beat' }, { status: 500 });
  }
}
