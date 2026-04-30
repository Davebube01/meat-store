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
  delivery: any | null;
  created_at: string;
  updated_at: string;
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

/** Alias to avoid ambiguity when both admin and user order modules are imported */
export const updateAdminOrderStatus = updateOrderStatus;
