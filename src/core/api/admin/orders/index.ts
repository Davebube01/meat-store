import { fetchClient } from "../../client";

export type AdminOrderStatus = 'pending' | 'paid' | 'processing' | 'in_transit' | 'shipped' | 'delivered' | 'cancelled';
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
}

export interface DispatchPayload {
  courier_name: string;
  courier_phone: string;
  courier_service: string;
  courier_reference?: string;
}

export const getOrders = async (skip: number = 0, limit: number = 100): Promise<Order[]> => {
  return fetchClient<Order[]>(`/admin/orders?skip=${skip}&limit=${limit}`);
};

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
