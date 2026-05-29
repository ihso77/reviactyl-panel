import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keys = await db.apiKey.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(keys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { description, allowedIps } = body;

    const identifier = `rvt_${crypto.randomBytes(6).toString('hex')}`;
    const token = `rvt_sk_${crypto.randomBytes(24).toString('hex')}`;

    const key = await db.apiKey.create({
      data: {
        identifier,
        description: description || null,
        allowedIps: allowedIps || '*',
        token,
        userId: session.id,
      },
    });

    return NextResponse.json(key, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
