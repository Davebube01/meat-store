import type { Product, WalkInItemPayload } from "@/core/api";

/** One line on the sale being rung up (prices here are a preview; the server prices the sale). */
export interface TicketLine {
  key: string;
  product: Product;
  quantity: number;
  weightOption?: string;
  part?: string;
  /** Weighed amount, in the product's stock unit. */
  amount?: number;
  /** Price of one of this line (for a weighed line, the whole line). */
  unitPrice: number;
  /** Stock one of this line uses. */
  stockUnits: number;
}

export const naira = (value: number) => `₦${(Math.round(value * 100) / 100).toLocaleString("en-NG")}`;

export const stockUnit = (product: Pick<Product, "category">) => (product.category === "per-kg" ? "kg" : "units");

export const lineLabel = (line: TicketLine) =>
  [line.amount !== undefined ? `${line.amount}${stockUnit(line.product) === "kg" ? "kg" : " units"} (weighed)` : line.weightOption, line.part]
    .filter(Boolean)
    .join(" · ");

export const toPayload = (line: TicketLine): WalkInItemPayload => ({
  product_id: line.product.id,
  quantity: line.quantity,
  weight_option: line.weightOption,
  part: line.part,
  amount: line.amount,
});
