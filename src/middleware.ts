import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/server', '/account', '/admin'];

export function middleware(request: NextRequest) {
  // Auth paths should redirect to dashboard if already logged in
  // Since auth is client-side with Zustand, we don't block server-side
  // The client-side layout handles redirects
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|public).*)',
  ],
};
