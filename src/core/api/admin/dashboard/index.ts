import { fetchClient } from "../../client";

export type DashboardRange = "today" | "7d" | "30d";

export interface DashboardKpis {
  revenue: number;
  revenue_prev: number;
  orders: number;
  orders_prev: number;
  avg_order_value: number;
  avg_order_value_prev: number;
  awaiting_dispatch: number;
  overdue_dispatch: number;
}

export interface RevenuePoint {
  date: string; // YYYY-MM-DD, Abuja time
  revenue: number;
  orders: number;
  revenue_prev: number;
}

export interface DashboardOrder {
  id: string;
  customer_name: string;
  status: string;
  delivery_method: string | null;
  delivery_zone: string | null;
  time_slot: string | null;
  total_amount: number;
  items_count: number;
  created_at: string;
}

export interface SlotGroup {
  time_slot: string;
  state: "done" | "overdue" | "now" | "upcoming";
  orders: DashboardOrder[];
}

export interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  stock_quantity: number;
}

export interface TopProduct {
  product_id: string;
  name: string;
  slug: string | null;
  image_url: string | null;
  units: number;
  revenue: number;
}

export interface AdminDashboard {
  range: DashboardRange;
  generated_at: string;
  low_stock_threshold: number;
  kpis: DashboardKpis;
  revenue_series: RevenuePoint[];
  status_breakdown: { status: string; count: number }[];
  todays_deliveries: SlotGroup[];
  low_stock: LowStockProduct[];
  low_stock_count: number;
  out_of_stock_count: number;
  top_products: TopProduct[];
  recent_orders: DashboardOrder[];
}

export const getAdminDashboard = async (range: DashboardRange): Promise<AdminDashboard> => {
  return fetchClient<AdminDashboard>(`/admin/dashboard?range=${range}`);
};
