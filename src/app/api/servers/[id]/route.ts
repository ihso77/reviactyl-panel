import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const server = await db.server.findFirst({
      where: { id, ownerId: session.user.id },
      include: {
        node: true,
        owner: { select: { id: true, email: true, username: true, name: true } },
        databases: true,
        backups: true,
        schedules: true,
      },
    });

    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    return NextResponse.json(server);
  } catch (error) {
    console.error('Error fetching server:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const server = await db.server.findFirst({
      where: { id, ownerId: session.user.id },
    });

    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    const { name, description, category, egg, memoryLimit, diskLimit, maxPlayers, status, suspended } = body;

    const updated = await db.server.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(egg !== undefined && { egg }),
        ...(memoryLimit !== undefined && { memoryLimit }),
        ...(diskLimit !== undefined && { diskLimit }),
        ...(maxPlayers !== undefined && { maxPlayers }),
        ...(status !== undefined && { status }),
        ...(suspended !== undefined && { suspended }),
      },
      include: { node: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating server:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const server = await db.server.findFirst({
      where: { id, ownerId: session.user.id },
    });

    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    await db.server.delete({ where: { id } });

    return NextResponse.json({ message: 'Server deleted' });
  } catch (error) {
    console.error('Error deleting server:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
