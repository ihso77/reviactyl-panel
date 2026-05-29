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

    const key = await db.sshKey.findFirst({
      where: { id, userId: session.id },
    });

    if (!key) {
      return NextResponse.json({ error: 'SSH key not found' }, { status: 404 });
    }

    await db.sshKey.delete({ where: { id } });

    return NextResponse.json({ message: 'SSH key deleted' });
  } catch (error) {
    console.error('Error deleting SSH key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
