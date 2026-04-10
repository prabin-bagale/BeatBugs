import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET producers list
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role') || '';

    const where: Record<string, unknown> = {};
    if (role) where.role = role;

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        verified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST login/signup (simulated)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, role, action } = body; // action: 'login' or 'signup'

    if (action === 'signup') {
      // Check if user exists
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      const user = await db.user.create({
        data: {
          email,
          name,
          role: role || 'buyer',
          avatar: `https://picsum.photos/seed/${email}/200/200`,
        },
      });

      return NextResponse.json({ user }, { status: 201 });
    }

    // Login
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in auth:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
