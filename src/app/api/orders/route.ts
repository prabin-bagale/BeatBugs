import { db } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await ensureSeeded();
    const searchParams = request.nextUrl.searchParams;
    const buyerId = searchParams.get('buyerId') || '';
    const producerId = searchParams.get('producerId') || '';

    const where: Record<string, unknown> = {};

    if (buyerId) where.buyerId = buyerId;
    if (producerId) {
      where.beat = { producerId };
    }

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: {
          select: { id: true, name: true, avatar: true },
        },
        beat: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            genre: true,
            basicPrice: true,
            premiumPrice: true,
            exclusivePrice: true,
            producer: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();
    const { buyerId, beatId, licenseType, paymentMethod } = body;

    // Find beat and get correct price
    const beat = await db.beat.findUnique({ where: { id: beatId } });
    if (!beat) {
      return NextResponse.json({ error: 'Beat not found' }, { status: 404 });
    }

    // Check if exclusive already sold
    if (licenseType === 'exclusive' && beat.exclusiveSold) {
      return NextResponse.json({ error: 'Exclusive license already sold' }, { status: 400 });
    }

    let amount = beat.basicPrice;
    if (licenseType === 'premium') amount = beat.premiumPrice;
    if (licenseType === 'exclusive') amount = beat.exclusivePrice;

    const order = await db.order.create({
      data: {
        buyerId,
        beatId,
        licenseType,
        amount,
        paymentMethod: paymentMethod || 'esewa',
        status: 'completed',
      },
    });

    // Update beat sales and exclusive status
    await db.beat.update({
      where: { id: beatId },
      data: {
        sales: { increment: 1 },
        ...(licenseType === 'exclusive' ? { exclusiveSold: true, status: 'sold_exclusive' } : {}),
      },
    });

    const fullOrder = await db.order.findUnique({
      where: { id: order.id },
      include: {
        beat: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            genre: true,
            producer: { select: { id: true, name: true } },
          },
        },
        buyer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ order: fullOrder }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
