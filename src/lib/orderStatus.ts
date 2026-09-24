export type OrderTab = "all" | "ongoing" | "completed" | "cancelled";

export const ORDER_TABS: { key: OrderTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export const isOrderTab = (value: string | null): value is OrderTab =>
  ORDER_TABS.some((t) => t.key === value);

export const CUSTOMER_CANCEL_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better price",
  "Delivery is taking too long",
  "Other",
];

export const ADMIN_CANCEL_REASONS = [
  "Out of stock",
  "Can't deliver to this location",
  "Customer requested cancellation",
  "Payment issue",
  "Other",
];

interface OrderLike {
  status: string;
  payment_method?: string | null;
  delivery_method?: string | null;
}

// Not yet paid for / accepted. Customers can still cancel these on their own.
export const isUnpaid = (status: string) => status === "pending" || status === "awaiting_verification";

export const isFinished = (status: string) => status === "delivered" || status === "cancelled";

export function getStatusInfo(order: OrderLike): { label: string; className: string } {
  const pickup = order.delivery_method === "pickup";

  switch (order.status) {
    case "pending":
      // Cash on delivery is never "awaiting payment" — it's simply received.
      return order.payment_method === "cod"
        ? { label: "Order received", className: "bg-gray-100 text-gray-700 border-gray-200" }
        : { label: "Awaiting payment", className: "bg-orange-100 text-orange-700 border-orange-200" };
    case "awaiting_verification":
      return { label: "Awaiting payment", className: "bg-orange-100 text-orange-700 border-orange-200" };
    case "paid":
      return { label: "Paid", className: "bg-teal-100 text-teal-700 border-teal-200" };
    case "processing":
      return { label: "Being prepared", className: "bg-blue-100 text-blue-700 border-blue-200" };
    case "in_transit":
      return pickup
        ? { label: "Ready for pickup", className: "bg-purple-100 text-purple-700 border-purple-200" }
        : { label: "Out for delivery", className: "bg-purple-100 text-purple-700 border-purple-200" };
    case "delivered":
      return { label: pickup ? "Picked up" : "Delivered", className: "bg-green-100 text-green-700 border-green-200" };
    case "cancelled":
      return { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" };
    default:
      return { label: order.status.replace(/_/g, " "), className: "bg-gray-100 text-gray-600 border-gray-200" };
  }
}

export function describeCancelledBy(by: string | null | undefined): string {
  switch (by) {
    case "customer":
      return "You cancelled this order";
    case "admin":
      return "Cancelled by our team";
    case "system":
      return "Cancelled automatically";
    default:
      return "Cancelled";
  }
}

export const shortOrderId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;
