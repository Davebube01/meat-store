import type { CounterPayment, Product, WalkInItemPayload } from "@/core/api";

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

/** ₦1,250.50. A missing or non-numeric amount shows as a dash, never "₦NaN". */
export const naira = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? `₦${(Math.round(value * 100) / 100).toLocaleString("en-NG")}` : "—";

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

export interface TicketExtras {
  payment: CounterPayment | null;
  customerName: string;
  customerPhone: string;
  discountInput: string;
  discountNote: string;
  tenderedInput: string;
}

/** Round-up notes a customer is likely to hand over for this total. */
export function cashSuggestions(total: number): number[] {
  // The next ₦1,000, ₦5,000 and ₦10,000 above the total (a round total gets the next one up).
  const ups = [1000, 5000, 10000].map((step) => {
    const up = Math.ceil(total / step) * step;
    return up > total ? up : up + step;
  });
  return [...new Set(ups)].sort((a, b) => a - b).slice(0, 3);
}

export const parseMoney = (v: string) => (v.trim() === "" ? NaN : Number(v.replace(/[,\s₦]/g, "")));

export function totals(lines: TicketLine[], extras: TicketExtras) {
  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
  const discount = parseMoney(extras.discountInput) || 0;
  const total = Math.max(0, subtotal - discount);
  const tendered = parseMoney(extras.tenderedInput);
  const discountProblem =
    discount < 0 ? "Discount can't be negative"
      : discount > subtotal ? "Discount is more than the sale"
        : discount > 0 && !extras.discountNote.trim() ? "Say why the discount was given"
          : null;
  const cashProblem =
    extras.payment === "cash" && Number.isFinite(tendered) && tendered + 0.005 < total ? "That's less than the total" : null;
  return { subtotal, discount, total, tendered, discountProblem, cashProblem };
}
