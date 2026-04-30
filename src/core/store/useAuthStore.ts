import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  full_name?: string;
  address?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  is_superuser: boolean;
  is_active: boolean;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  signOut: () => void;
  updateProfile: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      user: null,

      setAuth: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: !!user.is_superuser
        }),

      signOut: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isAdmin: false
        }),

      updateProfile: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
          isAdmin: updatedUser.is_superuser !== undefined ? !!updatedUser.is_superuser : state.isAdmin
        })),
    }),
    {
      name: 'meat-store-auth',
    }
  )
);
