import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  Settings,
  Tags,
  Boxes,
  Store
} from "lucide-react";

export const ADMIN_ROUTES = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    label: "Products",
    icon: ShoppingBag,
    href: "/admin/products",
  },
  {
    label: "Categories",
    icon: Tags,
    href: "/admin/categories",
  },
  {
    label: "Inventory",
    icon: Boxes,
    href: "/admin/inventory",
  },
  {
    label: "Sales",
    icon: Store,
    href: "/admin/sales",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/admin/orders",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/admin/customers",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export const PUBLIC_ROUTES = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
