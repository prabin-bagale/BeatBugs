import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const genre = searchParams.get('genre') || '';
    const mood = searchParams.get('mood') || '';
    const bpmMin = parseInt(searchParams.get('bpmMin') || '0');
    const bpmMax = parseInt(searchParams.get('bpmMax') || '200');
    const sortBy = searchParams.get('sortBy') || 'newest'; // newest, popular, price_low, price_high
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const producerId = searchParams.get('producerId') || '';
    const featured = searchParams.get('featured') === 'true';

    const where: Record<string, unknown> = {
      status: 'active',
    };

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { genre: { contains: query } },
        { mood: { contains: query } },
        { tags: { contains: query } },
      ];
    }

    if (genre) where.genre = genre;
    if (mood) where.mood = mood;
    if (producerId) where.producerId = producerId;

    where.bpm = { gte: bpmMin, lte: bpmMax };

    if (featured) {
      where.sales = { gte: 40 };
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' };
    switch (sortBy) {
      case 'popular':
        orderBy = { plays: 'desc' };
        break;
      case 'price_low':
        orderBy = { basicPrice: 'asc' };
        break;
      case 'price_high':
        orderBy = { basicPrice: 'desc' };
        break;
      case 'best_selling':
        orderBy = { sales: 'desc' };
        break;
    }

    const [beats, total] = await Promise.all([
      db.beat.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          producer: {
            select: { id: true, name: true, avatar: true, verified: true },
          },
        },
      }),
      db.beat.count({ where }),
    ]);

    return NextResponse.json({ beats, total, page, limit });
  } catch (error) {
    console.error('Error fetching beats:', error);
    return NextResponse.json({ error: 'Failed to fetch beats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      genre,
      bpm,
      key,
      mood,
      tags,
      coverUrl,
      audioPreviewUrl,
      basicPrice,
      premiumPrice,
      exclusivePrice,
      producerId,
    } = body;

    const beat = await db.beat.create({
      data: {
        title,
        description,
        genre,
        bpm: parseInt(bpm),
        key: key || 'Cm',
        mood,
        tags: JSON.stringify(tags || []),
        coverUrl,
        audioPreviewUrl,
        basicPrice: parseFloat(basicPrice),
        premiumPrice: parseFloat(premiumPrice),
        exclusivePrice: parseFloat(exclusivePrice),
        producerId,
      },
    });

    return NextResponse.json({ beat }, { status: 201 });
  } catch (error) {
    console.error('Error creating beat:', error);
    return NextResponse.json({ error: 'Failed to create beat' }, { status: 500 });
  }
}
