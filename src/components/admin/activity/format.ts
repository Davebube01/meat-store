import {
  Boxes, Inbox, LogIn, Settings, ShoppingBag, ShoppingCart, Store, Tags, UserCog, type LucideIcon,
} from "lucide-react";
import type { ActivityEntityType } from "@/core/api";

const WAT = "Africa/Lagos";

export const TYPES: { key: ActivityEntityType; label: string }[] = [
  { key: "product", label: "Products & stock" },
  { key: "order", label: "Orders" },
  { key: "sale", label: "Counter sales" },
  { key: "category", label: "Categories" },
  { key: "settings", label: "Settings" },
  { key: "staff", label: "Staff" },
  { key: "message", label: "Messages" },
  { key: "admin", label: "Sign-ins & exports" },
];

export const ICONS: Record<string, LucideIcon> = {
  product: ShoppingBag, order: ShoppingCart, sale: Store, category: Tags, settings: Settings, admin: LogIn, staff: UserCog, message: Inbox,
};
export const FALLBACK_ICON = Boxes;

export type RangeKey = "all" | "today" | "yesterday" | "7d" | "30d" | "custom";

export const RANGES: { key: RangeKey; label: string }[] = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "custom", label: "Custom dates" },
];

/** An Abuja calendar date, YYYY-MM-DD, `daysAgo` days back. */
export const abujaDate = (daysAgo = 0, now = new Date()) =>
  new Date(now.getTime() - daysAgo * 86_400_000).toLocaleDateString("en-CA", { timeZone: WAT });

/** The date_from/date_to a range means (inclusive Abuja days). */
export function rangeDates(range: RangeKey, from: string, to: string): { date_from?: string; date_to?: string } {
  switch (range) {
    case "today": return { date_from: abujaDate(0), date_to: abujaDate(0) };
    case "yesterday": return { date_from: abujaDate(1), date_to: abujaDate(1) };
    case "7d": return { date_from: abujaDate(6) };
    case "30d": return { date_from: abujaDate(29) };
    case "custom": return { date_from: from || undefined, date_to: to || undefined };
    default: return {};
  }
}

/** "Today", "Yesterday", or "Mon 28 Sept" — the day heading an entry goes under. */
export function dayLabel(iso: string, now = new Date()): string {
  const day = new Date(iso).toLocaleDateString("en-CA", { timeZone: WAT });
  if (day === abujaDate(0, now)) return "Today";
  if (day === abujaDate(1, now)) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: WAT });
}

export const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", timeZone: WAT });

const FIELD_NAMES: Record<string, string> = {
  cost_price: "Cost price", weight_options: "Sizes", parts: "Cuts", is_active: "Visible", low_stock_threshold: "Low-stock alert",
  image_url: "Image", stock: "Stock", status: "Status",
};

export const fieldLabel = (field: string, entityType: string) => {
  // Only products are "visible"; for staff accounts is_active means active.
  const name = (entityType === "product" ? FIELD_NAMES[field] : field === "is_active" ? "Active" : FIELD_NAMES[field])
    ?? field.replace(/_/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export function show(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString("en-NG");
  if (Array.isArray(value)) {
    return value.map((v) => (v && typeof v === "object" && "label" in v ? `${(v as { label: string }).label} ₦${(v as { price: number }).price?.toLocaleString("en-NG")}` : String(v))).join(", ") || "—";
  }
  if (typeof value === "string") return value.length > 80 ? `${value.slice(0, 80)}…` : value.replace(/_/g, " ");
  return JSON.stringify(value);
}
