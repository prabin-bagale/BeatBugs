import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const producerId = searchParams.get('producerId') || '';

    if (!producerId) {
      return NextResponse.json({ error: 'Producer ID required' }, { status: 400 });
    }

    // Get producer stats
    const [producer, totalBeats, totalSales, totalEarnings, recentOrders] = await Promise.all([
      db.user.findUnique({
        where: { id: producerId },
        select: { id: true, name: true, avatar: true, bio: true, verified: true, role: true },
      }),
      db.beat.count({ where: { producerId } }),
      db.order.count({
        where: { beat: { producerId } },
      }),
      db.order.aggregate({
        where: { beat: { producerId }, status: 'completed' },
        _sum: { amount: true },
      }),
      db.order.findMany({
        where: { beat: { producerId } },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          beat: { select: { id: true, title: true, coverUrl: true } },
          buyer: { select: { id: true, name: true, avatar: true } },
        },
      }),
    ]);

    if (!producer) {
      return NextResponse.json({ error: 'Producer not found' }, { status: 404 });
    }

    const myBeats = await db.beat.findMany({
      where: { producerId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      producer,
      stats: {
        totalBeats,
        totalSales,
        totalEarnings: totalEarnings._sum.amount || 0,
      },
      recentOrders,
      myBeats,
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
  }
}
