import { useAdminAuthStore } from "./useAdminAuthStore";

/**
 * Admin permissions, as the server listed them for the signed-in staff
 * member (see backend app/core/permissions.py). This only shapes the UI —
 * the API enforces every permission itself.
 */
export type AdminPermission =
  | "dashboard" | "products.view" | "products.edit" | "stock.adjust" | "costs.view" | "inventory.view"
  | "orders.view" | "orders.manage" | "orders.cancel" | "sales.create" | "sales.view" | "sales.void"
  | "customers.view" | "customers.manage" | "exports" | "activity.view" | "settings.manage" | "staff.manage"
  | "notifications"
  | "messages";

export const hasPermission = (permissions: string[] | undefined, permission?: AdminPermission) =>
  !permission || !!permissions?.includes(permission);

/** `const can = useAdminCan(); can("sales.void")` */
export function useAdminCan() {
  const permissions = useAdminAuthStore((s) => s.user?.permissions);
  return (permission?: AdminPermission) => hasPermission(permissions, permission);
}
