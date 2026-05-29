import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setSessionCookie, deleteSessionCookie, getSession } from '@/lib/auth';

// POST /api/auth/login - Login
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'logout') {
      await deleteSessionCookie();
      return NextResponse.json({ success: true });
    }

    if (action === 'session') {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ user: null });
      }
      return NextResponse.json({ user: session });
    }

    // Default: login
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await authenticateUser(email, password);

    if (!result) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await setSessionCookie(result.token);

    return NextResponse.json({ user: result.user });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// GET /api/auth/login - Get current session
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user: session });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}
