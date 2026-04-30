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
  created_at: string;
  updated_at: string;
  paid_at: string | null;
}

export const getUserOrderById = async (orderId: string): Promise<UserOrder> => {
  return fetchClient<UserOrder>(`/api/v1/orders/${orderId}`, { cache: "no-store" });
};

export const getUserOrders = async (): Promise<UserOrder[]> => {
  return fetchClient<UserOrder[]>('/api/v1/orders/me/orders', { cache: "no-store" });
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

export const updateOrderStatus = async (orderId: string, status: string): Promise<UserOrder> => {
  return fetchClient<UserOrder>(`/api/v1/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

