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
    });
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    const databases = await db.serverDatabase.findMany({
      where: { serverId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(databases);
  } catch (error) {
    console.error('Error fetching databases:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
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
    const { name, host, port, username, password } = body;

    if (!name || !username) {
      return NextResponse.json({ error: 'Name and username are required' }, { status: 400 });
    }

    const server = await db.server.findFirst({
      where: { id, ownerId: session.user.id },
    });
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    const database = await db.serverDatabase.create({
      data: {
        name,
        host: host || 'localhost',
        port: port || 3306,
        username,
        password: password || null,
        serverId: id,
      },
    });

    return NextResponse.json(database, { status: 201 });
  } catch (error) {
    console.error('Error creating database:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
