'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { DashboardLayout } from '@/components/panel/dashboard-layout';
import type { User } from '@/lib/types';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, setUser } = useAuthStore();
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    fetch('/api/auth/session')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((session) => {
        if (session?.user) {
          const u: User = {
            id: session.user.id,
            email: session.user.email,
            username: session.user.username,
            name: session.user.name || session.user.username,
            isAdmin: session.user.isAdmin,
            createdAt: session.user.createdAt,
            language: session.user.language,
            twoFactorEnabled: session.user.twoFactorEnabled,
          };
          setUser(u);
        } else {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router, setUser]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
