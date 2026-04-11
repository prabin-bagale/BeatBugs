import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const coverFile = formData.get('cover') as File | null;
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const genre = formData.get('genre') as string;
    const bpm = parseInt(formData.get('bpm') as string) || 90;
    const key = (formData.get('key') as string) || 'Cm';
    const mood = (formData.get('mood') as string) || '';
    const tags = (formData.get('tags') as string) || '[]';
    const basicPrice = parseFloat(formData.get('basicPrice') as string) || 999;
    const premiumPrice = parseFloat(formData.get('premiumPrice') as string) || 2999;
    const exclusivePrice = parseFloat(formData.get('exclusivePrice') as string) || 9999;
    const producerId = formData.get('producerId') as string;

    if (!title || !genre || !producerId) {
      return NextResponse.json({ error: 'Missing required fields: title, genre, producerId' }, { status: 400 });
    }

    // Ensure upload directories exist
    const audioDir = join(process.cwd(), 'public', 'audio');
    const coverDir = join(process.cwd(), 'public', 'covers');
    if (!existsSync(audioDir)) mkdirSync(audioDir, { recursive: true });
    if (!existsSync(coverDir)) mkdirSync(coverDir, { recursive: true });

    // Generate unique filename
    const filePrefix = `${Date.now()}-${title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    let audioUrl = '';
    let coverUrl = '';

    // Save audio file
    if (audioFile) {
      const audioExt = audioFile.name.split('.').pop() || 'mp3';
      const audioFileName = `${filePrefix}.${audioExt}`;
      const audioBytes = Buffer.from(await audioFile.arrayBuffer());
      writeFileSync(join(audioDir, audioFileName), audioBytes);
      audioUrl = `/audio/${audioFileName}`;
    }

    // Save cover image
    if (coverFile) {
      const coverExt = coverFile.name.split('.').pop() || 'jpg';
      const coverFileName = `${filePrefix}.${coverExt}`;
      const coverBytes = Buffer.from(await coverFile.arrayBuffer());
      writeFileSync(join(coverDir, coverFileName), coverBytes);
      coverUrl = `/covers/${coverFileName}`;
    }

    // If no cover was uploaded, generate a placeholder
    if (!coverUrl) {
      coverUrl = `https://picsum.photos/seed/${filePrefix}/600/600`;
    }

    // If no audio was uploaded, keep empty (preview won't work)
    if (!audioUrl) {
      audioUrl = '';
    }

    // Create beat in database
    const beat = await db.beat.create({
      data: {
        title,
        description,
        genre,
        bpm,
        key,
        mood,
        tags,
        coverUrl,
        audioPreviewUrl: audioUrl,
        audioFileUrl: audioUrl,
        basicPrice,
        premiumPrice,
        exclusivePrice,
        producerId,
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
