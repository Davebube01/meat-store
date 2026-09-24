import { fetchClient } from "../../client";
import { Product } from "../products";

export interface UserOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  selected_option: string | null;
  price_at_time: number;
  product: Product;
}

export interface UserOrderDelivery {
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
  // Set by the admin at dispatch time — who's carrying the order.
  courier_name: string | null;
  courier_phone: string | null;
  courier_service: string | null;
  courier_reference: string | null;
  delivery_pin: string | null;
}

export type OrderStatus =
  | "pending"
  | "awaiting_verification"
  | "paid"
  | "processing"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface UserOrder {
  id: string;
  user_id: string | null;
  guest_info: any | null;
  status: OrderStatus;
  delivery_method: "delivery" | "pickup";
  payment_method: string | null;
  payment_reference: string | null;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  items: UserOrderItem[];
  delivery: UserOrderDelivery | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  cancellation_reason: string | null;
  cancelled_by: "customer" | "admin" | "system" | null;
  cancelled_at: string | null;
}

export const getUserOrderById = async (orderId: string): Promise<UserOrder> => {
  return fetchClient<UserOrder>(`/api/v1/orders/${orderId}`, { cache: "no-store" });
};

export interface OrderSummary {
  all: number;
  ongoing: number;
  completed: number;
  cancelled: number;
}

export interface UserOrdersQuery {
  group?: "all" | "ongoing" | "completed" | "cancelled";
  skip?: number;
  limit?: number;
}

export const getUserOrders = async ({ group = "all", skip = 0, limit = 100 }: UserOrdersQuery = {}): Promise<UserOrder[]> => {
  return fetchClient<UserOrder[]>(`/api/v1/orders/me/orders?group=${group}&skip=${skip}&limit=${limit}`, { cache: "no-store" });
};

export const getOrderSummary = async (): Promise<OrderSummary> => {
  return fetchClient<OrderSummary>('/api/v1/orders/me/summary', { cache: "no-store" });
};

export const cancelUserOrder = async (orderId: string, reason: string): Promise<UserOrder> => {
  return fetchClient<UserOrder>(`/api/v1/orders/${orderId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
};

export const getPublicOrderTrack = async (orderId: string, email: string): Promise<UserOrder> => {
  return fetchClient<UserOrder>(`/api/v1/orders/track?order_number=${orderId}&email=${encodeURIComponent(email)}`, { cache: "no-store" });
};

export interface OrderCreatePayload {
  is_guest?: boolean;
  guest_info?: any;
  delivery_info?: any;
  delivery_method?: "delivery" | "pickup";
  payment_method: string;
  items?: any[];
  cart_id?: string;
}

export const checkoutOrder = async (payload: OrderCreatePayload): Promise<UserOrder> => {
  return fetchClient<UserOrder>('/api/v1/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

