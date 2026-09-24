import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

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
  email_verified: boolean;
}

// "Remember me" sessions persist in localStorage; otherwise the session lives
// in sessionStorage and ends when the browser closes. The choice travels with
// the persisted state itself (rememberMe), so reads check both places.
const authStorage: StateStorage = {
  getItem: (name) =>
    typeof window === "undefined" ? null : localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    let remember = true;
    try {
      remember = JSON.parse(value)?.state?.rememberMe !== false;
    } catch {}
    (remember ? localStorage : sessionStorage).setItem(name, value);
    (remember ? sessionStorage : localStorage).removeItem(name);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

interface AuthState {
  // In memory only — never written to storage, so a script injected into the
  // page can't lift a long-lived credential out of localStorage. After a page
  // load it's re-obtained from the httpOnly refresh cookie (core/api/client.ts).
  token: string | null;
  // Persisted hint that a session probably exists (so the UI doesn't flash
  // "signed out" while the token is being restored).
  isAuthenticated: boolean;
  rememberMe: boolean;
  user: User | null;
  setAuth: (token: string, user: User | null, rememberMe?: boolean) => void;
  signOut: () => void;
  updateProfile: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      rememberMe: true,
      user: null,

      // rememberMe is optional so the second setAuth call (once the user
      // profile is loaded) keeps whatever the first call chose.
      setAuth: (token, user, rememberMe) =>
        set((state) => ({
          token,
          user,
          isAuthenticated: true,
          rememberMe: rememberMe ?? state.rememberMe,
        })),

      signOut: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          rememberMe: true,
        }),

      updateProfile: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: 'meat-store-auth',
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
        user: state.user,
      }),
      // Sessions saved by older versions also contained a token; never load it.
      merge: (persisted, current) => ({ ...current, ...(persisted as object), token: null }),
    }
  )
);

// See useCart.ts for why this is needed: this store's automatic
// hydrate-on-creation doesn't reliably fire in this app's setup. Triggering
// it once, early, here avoids auth state randomly lagging behind (or being
// overwritten by) a late, unpredictable rehydration elsewhere.
if (typeof window !== "undefined") {
  useAuthStore.persist.rehydrate();
}
