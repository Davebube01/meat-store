import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  is_superuser: boolean;
  is_active: boolean;
  /** "owner" | "manager" | "cashier" */
  role?: string;
  /** What this role may do; the admin UI hides what isn't listed. */
  permissions?: string[];
}

interface AdminAuthState {
  // In memory only — never written to storage. After a page load it's
  // re-obtained from the httpOnly admin refresh cookie (see core/api/client.ts).
  token: string | null;
  isAuthenticated: boolean;
  user: AdminUser | null;
  setAuth: (token: string, user: AdminUser | null) => void;
  signOut: () => void;
}

// The admin session ends with the browser tab/window — no "remember me" here.
const sessionOnly: StateStorage = {
  getItem: (name) => (typeof window === "undefined" ? null : sessionStorage.getItem(name)),
  setItem: (name, value) => {
    if (typeof window !== "undefined") sessionStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window !== "undefined") sessionStorage.removeItem(name);
  },
};

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,

      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      signOut: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "meat-store-admin-auth",
      storage: createJSONStorage(() => sessionOnly),
      // Only the "someone is signed in" hint survives a reload, never the token.
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
      merge: (persisted, current) => ({ ...current, ...(persisted as object), token: null }),
    }
  )
);

// Same reasoning as useAuthStore: kick off hydration explicitly.
if (typeof window !== "undefined") {
  useAdminAuthStore.persist.rehydrate();
}
