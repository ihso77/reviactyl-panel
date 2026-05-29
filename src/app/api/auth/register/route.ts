import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Email, username, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      if (existing.email === email) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email,
        username,
        name: name || username,
        password: hashedPassword,
        isAdmin: false,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed. Is the database connected?' }, { status: 500 });
  }
}
