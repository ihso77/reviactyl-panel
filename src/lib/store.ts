import { create } from 'zustand';
import type { User } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const defaultUser: User = {
  id: 'usr-001',
  email: 'admin@example.com',
  username: 'admin',
  name: 'Admin User',
  isAdmin: true,
  createdAt: '2024-01-01',
  language: 'en',
  twoFactorEnabled: false,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: defaultUser,
  isAuthenticated: true,
  login: (user: User) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (data: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
