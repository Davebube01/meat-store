import type { MessageTopic } from "@/core/api/admin/messages";

export const TOPIC_LABELS: Record<MessageTopic, string> = {
  order: "Order",
  delivery: "Delivery",
  bulk: "Bulk order",
  feedback: "Feedback",
  other: "Other",
};

export const TOPIC_STYLES: Record<MessageTopic, string> = {
  order: "bg-blue-50 text-blue-700",
  delivery: "bg-amber-50 text-amber-700",
  bulk: "bg-purple-50 text-purple-700",
  feedback: "bg-green-50 text-green-700",
  other: "bg-gray-100 text-gray-600",
};

const WAT = "Africa/Lagos";

/** "10:42" today, "Tue" this week, "12 Sep" before that. */
export function shortWhen(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const day = (x: Date) => x.toLocaleDateString("en-CA", { timeZone: WAT });
  if (day(d) === day(now)) return d.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", timeZone: WAT });
  if (now.getTime() - d.getTime() < 6 * 86_400_000) return d.toLocaleDateString("en-NG", { weekday: "short", timeZone: WAT });
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", timeZone: WAT });
}

export const longWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: WAT });

export const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "").replace(/^0/, "234")}`;
