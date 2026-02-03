import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (name: string) => void;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      signIn: (name: string) =>
        set({
          isAuthenticated: true,
          user: {
            name,
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          },
        }),
      signOut: () => set({ isAuthenticated: false, user: null }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'meat-store-auth',
    }
  )
);
