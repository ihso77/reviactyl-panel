import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const logs = await db.activityLog.findMany({
      include: {
        user: {
          select: { username: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
