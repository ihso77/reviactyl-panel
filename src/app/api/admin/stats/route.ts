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

    const [
      totalUsers,
      totalServers,
      totalNodes,
      totalDatabases,
      activeServers,
      suspendedServers,
    ] = await Promise.all([
      db.user.count(),
      db.server.count(),
      db.node.count(),
      db.serverDatabase.count(),
      db.server.count({ where: { status: 'online' } }),
      db.server.count({ where: { suspended: true } }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalServers,
      totalNodes,
      totalDatabases,
      activeServers,
      suspendedServers,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
