import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      username: string;
      isAdmin: boolean;
      language: string;
      twoFactorEnabled: boolean;
      createdAt: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    username?: string;
    isAdmin?: boolean;
    language?: string;
    twoFactorEnabled?: boolean;
    createdAt?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    isAdmin: boolean;
    language: string;
    twoFactorEnabled: boolean;
    createdAt: string;
  }
}
