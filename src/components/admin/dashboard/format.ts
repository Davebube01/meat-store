export const naira = (value: number) =>
  `₦${Math.round(value).toLocaleString("en-NG")}`;

/** ₦1.2M / ₦640K — for chart axes where full amounts don't fit. */
export const nairaCompact = (value: number) =>
  `₦${new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`;

/** Percent change vs the previous period; null when there's nothing to compare against. */
export const percentChange = (current: number, previous: number): number | null =>
  previous > 0 ? ((current - previous) / previous) * 100 : null;

// Admin-facing status names and chart colours. Hues match the badge
// classes in lib/orderStatus.ts so a status looks the same everywhere.
export const STATUS_META: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "#9ca3af" },
  awaiting_verification: { label: "Awaiting payment", color: "#f97316" },
  paid: { label: "Paid", color: "#14b8a6" },
  processing: { label: "Processing", color: "#3b82f6" },
  in_transit: { label: "In transit", color: "#a855f7" },
  delivered: { label: "Delivered", color: "#22c55e" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
};

export const statusMeta = (status: string) =>
  STATUS_META[status] ?? { label: status.replace(/_/g, " "), color: "#9ca3af" };
