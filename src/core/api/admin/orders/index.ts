import { fetchClient } from "../../client";

export type AdminOrderStatus = 'pending' | 'awaiting_verification' | 'paid' | 'processing' | 'in_transit' | 'shipped' | 'delivered' | 'cancelled';
/** @deprecated use AdminOrderStatus */
export type OrderStatus = AdminOrderStatus;

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  product: any;
  selected_option?: string;
  price_at_time: number;
}

export interface OrderDelivery {
  id: string;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  landmark: string | null;
  zip_code: string | null;
  instructions: string | null;
  delivery_zone: string;
  delivery_date: string | null;
  time_slot: string | null;
  tracking_number: string | null;
  delivery_status: string | null;
  courier_name: string | null;
  courier_phone: string | null;
  courier_service: string | null;
  courier_reference: string | null;
  delivery_pin: string | null;
}

export interface Order {
  id: string;
  user_id: string | null;
  guest_info: any | null;
  status: AdminOrderStatus;
  payment_method: string | null;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  items: any[];
  delivery: OrderDelivery | null;
  created_at: string;
  updated_at: string;
  cancellation_reason?: string | null;
  cancelled_by?: "customer" | "admin" | "system" | null;
  cancelled_at?: string | null;
  paid_at?: string | null;
  payment_expires_at?: string | null;
  delivery_method?: "delivery" | "pickup";
  payment_reference?: string | null;
  // Present on list and detail responses (not on action responses).
  customer_name?: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  is_guest?: boolean;
  /** The delivery slot has ended but the order hasn't gone out yet. */
  overdue?: boolean;
  delivery_zone_name?: string | null;
  /** Statuses PUT /status accepts right now. */
  allowed_moves?: string[];
}

export type OrderView = "all" | "needs_action" | "unpaid" | "paid" | "processing" | "in_transit" | "delivered" | "cancelled";

export interface OrderListParams {
  view?: OrderView;
  search?: string;
  method?: "delivery" | "pickup";
  zone?: string;
  date_from?: string; // YYYY-MM-DD
  date_to?: string;
  sort?: "newest" | "oldest";
  skip?: number;
  limit?: number;
}

export interface OrdersSummary {
  counts: Record<OrderView, number>;
  overdue: number;
}

export interface DispatchPayload {
  courier_name: string;
  courier_phone: string;
  courier_service: string;
  courier_reference?: string;
}

export const getOrders = async (params: OrderListParams | number = {}, legacyLimit?: number): Promise<Order[]> => {
  // Older callers pass (skip, limit).
  const p: OrderListParams = typeof params === "number" ? { skip: params, limit: legacyLimit } : params;
  const q = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && !(k === "view" && v === "all")) q.set(k, String(v));
  });
  const qs = q.toString();
  return fetchClient<Order[]>(`/admin/orders/${qs ? `?${qs}` : ""}`);
};

export const getOrdersSummary = async (): Promise<OrdersSummary> =>
  fetchClient<OrdersSummary>("/admin/orders/summary");

export const getOrderById = async (id: string): Promise<Order> => {
  return fetchClient<Order>(`/admin/orders/${id}`);
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  return fetchClient<Order>(`/admin/orders/${id}/status?status=${status}`, {
    method: "PUT"
  });
};

export const dispatchOrder = async (id: string, payload: DispatchPayload): Promise<Order> => {
  return fetchClient<Order>(`/admin/orders/${id}/dispatch`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const cancelAdminOrder = async (id: string, reason: string): Promise<Order> => {
  return fetchClient<Order>(`/admin/orders/${id}/cancel`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
};

export const confirmDelivery = async (id: string, pin: string): Promise<Order> => {
  return fetchClient<Order>(`/admin/orders/${id}/confirm-delivery`, {
    method: "PUT",
    body: JSON.stringify({ pin }),
  });
};

/** Alias to avoid ambiguity when both admin and user order modules are imported */
export const updateAdminOrderStatus = updateOrderStatus;
