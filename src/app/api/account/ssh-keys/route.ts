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

    const keys = await db.sshKey.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(keys);
  } catch (error) {
    console.error('Error fetching SSH keys:', error);
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
    const { name, publicKey } = body;

    if (!name || !publicKey) {
      return NextResponse.json({ error: 'Name and public key are required' }, { status: 400 });
    }

    // Generate a simple fingerprint from the public key
    const fingerprint = `SHA256:${crypto.createHash('sha256').update(publicKey.trim()).digest('base64').substring(0, 32)}...`;

    const key = await db.sshKey.create({
      data: {
        name,
        publicKey: publicKey.trim(),
        fingerprint,
        userId: session.id,
      },
    });

    return NextResponse.json(key, { status: 201 });
  } catch (error) {
    console.error('Error creating SSH key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
