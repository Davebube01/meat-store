import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  Settings,
  Tags,
  Boxes,
  Store,
  History,
  FileDown,
  UserCog,
} from "lucide-react";
import { hasPermission, type AdminPermission } from "@/core/store/useAdminCan";

export const ADMIN_ROUTES: { label: string; icon: typeof LayoutDashboard; href: string; permission: AdminPermission }[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", permission: "dashboard" },
  { label: "Sales", icon: Store, href: "/admin/sales", permission: "sales.view" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders", permission: "orders.view" },
  { label: "Products", icon: ShoppingBag, href: "/admin/products", permission: "products.view" },
  { label: "Categories", icon: Tags, href: "/admin/categories", permission: "products.edit" },
  { label: "Inventory", icon: Boxes, href: "/admin/inventory", permission: "inventory.view" },
  { label: "Customers", icon: Users, href: "/admin/customers", permission: "customers.view" },
  { label: "Exports", icon: FileDown, href: "/admin/exports", permission: "exports" },
  { label: "Activity", icon: History, href: "/admin/activity", permission: "activity.view" },
  { label: "Staff", icon: UserCog, href: "/admin/staff", permission: "staff.manage" },
  { label: "Settings", icon: Settings, href: "/admin/settings", permission: "settings.manage" },
];

// Pages below a section that need more than seeing it.
const PAGE_PERMISSIONS: { match: RegExp; permission: AdminPermission }[] = [
  { match: /^\/admin\/sales\/new$/, permission: "sales.create" },
  { match: /^\/admin\/products\/create$/, permission: "products.edit" },
  { match: /^\/admin\/products\/[^/]+\/edit$/, permission: "products.edit" },
];

/** The permission a page needs, or undefined for pages every staff member may open (e.g. their account). */
export function permissionForPath(pathname: string): AdminPermission | undefined {
  const page = PAGE_PERMISSIONS.find((p) => p.match.test(pathname));
  if (page) return page.permission;
  return ADMIN_ROUTES.find((r) => pathname === r.href || pathname.startsWith(`${r.href}/`))?.permission;
}

/** Where a staff member lands after signing in: the first section their role opens. */
export function adminLandingPath(permissions: string[] | undefined): string {
  return ADMIN_ROUTES.find((r) => hasPermission(permissions, r.permission))?.href ?? "/admin/account";
}

export const PUBLIC_ROUTES = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
