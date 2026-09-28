import { fetchClient } from "../../client";

export interface Customer {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  phone: string;
  address: string;
  /** Orders placed and not cancelled (includes ones still awaiting payment). */
  ordersCount: number;
  /** Money actually taken: paid online, or cash-on-delivery once delivered. */
  totalSpent: number;
  status: 'active' | 'inactive';
  joinDate: string;
  email_verified?: boolean;
  paid_orders?: number;
  last_order_at?: string | null;
}

export type CustomerSort = "recent" | "spent" | "orders" | "name" | "last_order";

export interface CustomerListParams {
  search?: string;
  status?: "active" | "inactive";
  sort?: CustomerSort;
  skip?: number;
  limit?: number;
}

export interface CustomersSummary {
  total_customers: number;
  new_this_month: number;
  active_last_30_days: number;
  repeat_customers: number;
  verified: number;
  guest_customers: number;
}

export interface CustomerOrderSummary {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: { id: string; quantity: number }[];
  delivery_method: string | null;
  payment_method: string | null;
  delivery_zone: string | null;
}

export interface CustomerDetail extends Customer {
  recent_orders: CustomerOrderSummary[];
  cancelled_orders: number;
  avg_order_value: number;
  first_order_at: string | null;
  favourites: { product_id: string; name: string; slug: string | null; image_url: string | null; units: number; times_ordered: number }[];
  addresses: { address: string; zone: string | null; times_used: number; last_used: string }[];
}

export const getCustomers = async (params: CustomerListParams = {}): Promise<Customer[]> => {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.status) q.set("status", params.status);
  if (params.sort) q.set("sort", params.sort);
  if (params.skip) q.set("skip", String(params.skip));
  if (params.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  return fetchClient<Customer[]>(`/admin/customers${qs ? `?${qs}` : ""}`);
};

export const getCustomersSummary = async (): Promise<CustomersSummary> =>
  fetchClient<CustomersSummary>("/admin/customers/summary");

export const getCustomerById = async (id: string): Promise<CustomerDetail> => {
  return fetchClient<CustomerDetail>(`/admin/customers/${id}`);
};

/** Deactivating blocks sign-in and ends their sessions. */
export const setCustomerActive = async (id: string, isActive: boolean): Promise<CustomerDetail> =>
  fetchClient<CustomerDetail>(`/admin/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
