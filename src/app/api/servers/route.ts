import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const servers = await db.server.findMany({
      where: { ownerId: session.id },
      include: { node: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
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
    const { name, description, nodeId, category, egg, memoryLimit, diskLimit, maxPlayers, ip, port } = body;

    if (!name || !nodeId) {
      return NextResponse.json({ error: 'Name and node are required' }, { status: 400 });
    }

    const node = await db.node.findUnique({ where: { id: nodeId } });
    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    const server = await db.server.create({
      data: {
        name,
        description: description || null,
        nodeId,
        ownerId: session.id,
        category: category || null,
        egg: egg || null,
        memoryLimit: memoryLimit || 1024,
        diskLimit: diskLimit || 10240,
        maxPlayers: maxPlayers || 20,
        ip: ip || null,
        port: port || 25565,
      },
      include: { node: true },
    });

    return NextResponse.json(server, { status: 201 });
  } catch (error) {
    console.error('Error creating server:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
