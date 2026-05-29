import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const server = await db.server.findFirst({
      where: { id, ownerId: session.id },
    });
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Return activity logs related to this server
    const activityLogs = await db.activityLog.findMany({
      where: {
        userId: session.id,
        OR: [
          { action: { contains: 'server' } },
          { description: { contains: server.name } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const consoleLines = activityLogs.map((log) => ({
      id: log.id,
      timestamp: log.createdAt.toLocaleTimeString('en-US', { hour12: false }),
      content: log.description,
      type: log.action.includes(':start') || log.action.includes(':create') ? 'success'
        : log.action.includes(':stop') || log.action.includes(':kill') ? 'error'
        : log.action.includes(':restart') || log.action.includes(':update') ? 'warn'
        : 'info',
    }));

    return NextResponse.json(consoleLines);
  } catch (error) {
    console.error('Error fetching console:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
