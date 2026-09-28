import { fetchClient } from "../../client";
import type { Order } from "../orders";

/** How the customer paid at the counter. "pos" = card on a POS terminal. */
export type CounterPayment = "cash" | "transfer" | "pos";

export const COUNTER_PAYMENTS: { key: CounterPayment; label: string }[] = [
  { key: "cash", label: "Cash" },
  { key: "transfer", label: "Transfer" },
  { key: "pos", label: "POS" },
];

export interface WalkInItemPayload {
  product_id: string;
  quantity: number;
  weight_option?: string;
  part?: string;
  /** Weighed amount in the product's stock unit (e.g. 1.7 for 1.7kg); use instead of weight_option. */
  amount?: number;
}

export interface WalkInSalePayload {
  items: WalkInItemPayload[];
  payment_method: CounterPayment;
  customer_name?: string;
  customer_phone?: string;
  discount_amount?: number;
  discount_note?: string;
}

export interface WalkInSale extends Order {
  channel: "walk_in";
  discount_amount: number;
  discount_note: string | null;
  served_by_name: string | null;
}

export interface SalesDay {
  date: string;
  summary: {
    count: number;
    total: number;
    by_payment_method: Record<CounterPayment, number>;
    voided_count: number;
    voided_total: number;
  };
  sales: WalkInSale[];
}

export const getSalesDay = async (day?: string): Promise<SalesDay> =>
  fetchClient<SalesDay>(`/admin/sales${day ? `?day=${day}` : ""}`, { cache: "no-store" });

export const getSale = async (id: string): Promise<WalkInSale> =>
  fetchClient<WalkInSale>(`/admin/sales/${id}`, { cache: "no-store" });

export const createSale = async (payload: WalkInSalePayload): Promise<WalkInSale> =>
  fetchClient<WalkInSale>("/admin/sales", { method: "POST", body: JSON.stringify(payload) });

export const voidSale = async (id: string, reason: string): Promise<WalkInSale> =>
  fetchClient<WalkInSale>(`/admin/sales/${id}/void`, { method: "POST", body: JSON.stringify({ reason }) });

/** What one unit of stock sells for: the best per-unit rate among its sizes (mirrors the server). */
export const pricePerStockUnit = (product: { price: number; weight_options?: { price: number; stock_units: number }[] }) =>
  product.weight_options?.length
    ? Math.min(...product.weight_options.map((o) => o.price / o.stock_units))
    : product.price;
