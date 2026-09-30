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
  /** Cash only: what the customer handed over, for the change on the receipt. */
  cash_tendered?: number;
  /** One per ticket: sending the same sale twice (double tap, retry) only sells once. */
  client_ref?: string;
}

export interface WalkInSale extends Order {
  channel: "walk_in";
  discount_amount: number;
  discount_note: string | null;
  served_by_name: string | null;
  cash_tendered: number | null;
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
  /** The day's cash sales: what should be in the till on top of the float. */
  cash_expected: number;
  till: TillCount | null;
  /** Best sellers by takings, up to 5. */
  top_items: { product_id: string; name: string; quantity: number; total: number }[];
  /** Sales per Abuja hour (only hours with sales). */
  hourly: { hour: number; count: number; total: number }[];
  /** Only for roles that can see costs. */
  profit: number | null;
  /** False when some items have no cost price, so profit reads high. */
  profit_complete: boolean;
}

export interface TillCount {
  day: string;
  opening_float: number;
  counted_cash: number;
  /** Float + cash sales when the count was saved. */
  expected_cash: number;
  /** counted - expected: negative means short. */
  difference: number;
  note: string | null;
  counted_by: string | null;
  counted_at: string;
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

/** Cash up a day (counting again replaces the count). */
export const saveTillCount = async (day: string, body: { opening_float: number; counted_cash: number; note?: string }) =>
  fetchClient<TillCount>(`/admin/sales/till/${day}`, { method: "PUT", body: JSON.stringify(body) });
