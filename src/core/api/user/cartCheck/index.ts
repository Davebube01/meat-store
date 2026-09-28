import { fetchClient } from "../../client";

export interface CartCheckLine {
  key: string;
  product_id: string;
  weight_option?: string;
  part?: string;
  quantity: number;
  unit_price?: number;
}

export type CartLineStatus = "ok" | "price_changed" | "reduced" | "out_of_stock" | "unavailable";

export interface CartCheckResult {
  key: string;
  status: CartLineStatus;
  unit_price: number | null;
  /** Most of this line that can be bought now (lines of one product share its stock). */
  max_quantity: number;
  name: string | null;
  image_url: string | null;
  slug: string | null;
  message: string | null;
}

/** Re-price the cart against live prices and stock, the same way checkout will. */
export const checkCart = async (items: CartCheckLine[]): Promise<CartCheckResult[]> => {
  const res = await fetchClient<{ lines: CartCheckResult[] }>("/api/v1/cart/check", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
  return res.lines;
};
