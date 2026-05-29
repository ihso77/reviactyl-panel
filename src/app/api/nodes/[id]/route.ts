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

    const node = await db.node.findUnique({
      where: { id },
      include: {
        _count: { select: { servers: true } },
        servers: {
          select: { id: true, name: true, status: true },
        },
      },
    });

    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    return NextResponse.json(node);
  } catch (error) {
    console.error('Error fetching node:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const node = await db.node.findUnique({ where: { id } });
    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    const { name, location, fqdn, scheme, port, status } = body;

    const updated = await db.node.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(location !== undefined && { location }),
        ...(fqdn !== undefined && { fqdn }),
        ...(scheme !== undefined && { scheme }),
        ...(port !== undefined && { port }),
        ...(status !== undefined && { status }),
      },
      include: {
        _count: { select: { servers: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating node:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const node = await db.node.findUnique({
      where: { id },
      include: { _count: { select: { servers: true } } },
    });

    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    if (node._count.servers > 0) {
      return NextResponse.json(
        { error: 'Cannot delete node with servers. Move or delete servers first.' },
        { status: 400 }
      );
    }

    await db.node.delete({ where: { id } });

    return NextResponse.json({ message: 'Node deleted' });
  } catch (error) {
    console.error('Error deleting node:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
