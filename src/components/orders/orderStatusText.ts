import { Check, ChefHat, Package, Store, Truck } from "lucide-react";
import type { UserOrder } from "@/core/api/user/orders";
import { getStatusInfo } from "@/lib/orderStatus";

// Wording and progress steps for an order, shared by the customer order
// pages and guest tracking so both describe an order the same way.

export const longDay = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Lagos" }) : null;

export function orderSteps(o: UserOrder) {
  const pickup = o.delivery_method === "pickup";
  const cod = o.payment_method === "cod";
  const rank = { pending: 0, awaiting_verification: 0, paid: 1, processing: 2, in_transit: 3, delivered: 4, cancelled: -1 }[o.status] ?? 0;
  const eff = cod ? Math.max(rank, 1) : rank; // cash orders don't wait for payment
  return [
    { label: "Order placed", icon: Package, done: true, current: false, at: o.created_at as string | null },
    { label: cod ? "Confirmed" : "Paid", icon: Check, done: eff >= 1, current: false, at: o.paid_at },
    { label: "Preparing", icon: ChefHat, done: eff >= 3, current: eff === 2, at: null },
    { label: pickup ? "Ready to collect" : "On the way", icon: pickup ? Store : Truck, done: eff >= 4, current: eff === 3, at: null },
    { label: pickup ? "Collected" : "Delivered", icon: Check, done: eff >= 4, current: false, at: null },
  ];
}

export function orderHeadline(o: UserOrder): { title: string; sub: string } {
  const pickup = o.delivery_method === "pickup";
  const slot = o.delivery?.time_slot ? `${longDay(o.delivery.delivery_date)}, ${o.delivery.time_slot}` : null;
  switch (o.status) {
    case "pending":
    case "awaiting_verification":
      return o.payment_method === "cod"
        ? { title: "We've got your order", sub: "We'll start preparing it shortly." }
        : { title: "Waiting for payment", sub: "Finish paying and we'll start preparing it." };
    case "paid":
      return { title: "Payment received", sub: "We'll start preparing your order shortly." };
    case "processing":
      return {
        title: "Your order is being prepared",
        sub: pickup ? "We'll let you know when it's ready to collect." : slot ? `Delivery booked for ${slot}.` : "It will be on its way soon.",
      };
    case "in_transit":
      return pickup
        ? { title: "Ready to collect", sub: "Come by the shop with your order number." }
        : { title: "Your order is on its way", sub: "Have your delivery PIN ready for the courier." };
    case "delivered":
      return { title: pickup ? "Collected. Enjoy!" : "Delivered. Enjoy!", sub: "Thanks for shopping with us." };
    case "cancelled":
      return { title: "This order was cancelled", sub: o.cancellation_reason ? `Reason: ${o.cancellation_reason}` : "" };
    default:
      return { title: getStatusInfo(o).label, sub: "" };
  }
}

