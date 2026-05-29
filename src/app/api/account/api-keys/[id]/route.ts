import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const key = await db.apiKey.findFirst({
      where: { id, userId: session.id },
    });

    if (!key) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    await db.apiKey.delete({ where: { id } });

    return NextResponse.json({ message: 'API key deleted' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
