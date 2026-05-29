import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'reviactyl-default-secret-change-me'
);

const COOKIE_NAME = 'reviactyl-session';

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  name: string | null;
  isAdmin: boolean;
  language: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  username: string;
  name: string | null;
  isAdmin: boolean;
  language: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  exp: number;
  iat: number;
}

// Create a JWT token
async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    isAdmin: user.isAdmin,
    language: user.language,
    twoFactorEnabled: user.twoFactorEnabled,
    createdAt: user.createdAt,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// Verify a JWT token
async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Authenticate with email and password - returns user data and sets cookie
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: SessionUser; token: string } | null> {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    isAdmin: user.isAdmin,
    language: user.language,
    twoFactorEnabled: user.twoFactorEnabled,
    createdAt: user.createdAt.toISOString(),
  };

  const token = await createToken(sessionUser);
  return { user: sessionUser, token };
}

// Get current session from cookies (for use in API routes)
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    return {
      id: payload.userId,
      email: payload.email,
      username: payload.username,
      name: payload.name,
      isAdmin: payload.isAdmin,
      language: payload.language,
      twoFactorEnabled: payload.twoFactorEnabled,
      createdAt: payload.createdAt,
    };
  } catch {
    return null;
  }
}

// Set session cookie (for use in API routes after login)
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Delete session cookie (logout)
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
