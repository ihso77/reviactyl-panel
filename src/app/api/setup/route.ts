import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const adminCount = await db.user.count({
      where: { isAdmin: true },
    });

    return NextResponse.json({ setupRequired: adminCount === 0 });
  } catch (error) {
    // If database is not configured yet, setup is required
    return NextResponse.json({ setupRequired: true });
  }
}

export async function POST(request: Request) {
  try {
    const adminCount = await db.user.count({
      where: { isAdmin: true },
    });

    if (adminCount > 0) {
      return NextResponse.json({ error: 'Setup already completed' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Email, username, and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        username,
        name: name || 'Admin',
        password: hashedPassword,
        isAdmin: true,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
    }, { status: 201 });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
