'use client';

import { cn } from '@/lib/utils';
import { Gamepad2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[oklch(0.15_0.02_155)] to-[oklch(0.12_0_0)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.6_0.17_155_/_0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_oklch(0.5_0.15_260_/_0.1),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Gamepad2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Reviactyl</h1>
              <p className="text-xs text-white/50">Game Server Management</p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Manage your game servers with ease
            </h2>
            <p className="text-lg text-white/60 max-w-md">
              Powerful, modern, and intuitive panel for managing all your game servers in one place.
            </p>
          </div>
          <p className="text-xs text-white/30">© 2024 Reviactyl. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Gamepad2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold">Reviactyl</h1>
              <p className="text-[10px] text-muted-foreground">Game Server Panel</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
