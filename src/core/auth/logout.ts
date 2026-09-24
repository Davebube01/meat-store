import { useAuthStore } from "@/core/store/useAuthStore";
import { useAdminAuthStore } from "@/core/store/useAdminAuthStore";
import { logoutCustomer } from "@/core/api/user/auth";
import { logoutAdmin } from "@/core/api/admin/auth";

/**
 * Signs out locally right away (so the UI responds instantly), then tells the
 * server to revoke the refresh session — without that, clearing local state
 * would leave a live session cookie behind that could still mint tokens.
 */
export async function logout(realm: "customer" | "admin" = "customer"): Promise<void> {
  const store = realm === "admin" ? useAdminAuthStore : useAuthStore;
  store.getState().signOut();
  try {
    await (realm === "admin" ? logoutAdmin() : logoutCustomer());
  } catch {
    // Offline or already expired: the server-side session dies on its own.
  }
}
