import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let API routes and static files pass through
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  // Allow auth pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/setup') {
    return NextResponse.next();
  }

  // For all other routes, let the client handle auth via the protected layout
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|logo.svg).*)',
  ],
};
