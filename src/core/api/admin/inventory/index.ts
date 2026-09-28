import { fetchClient } from "../../client";

export type MovementReason = "initial_stock" | "order_placed" | "order_cancelled" | "restock" | "correction";

export interface InventorySummary {
  active_products: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
  units_on_hand: number;
  stock_value: number;
  /** stock × cost price, over products that have one. */
  stock_cost_value: number;
  /** Active products with no cost price (left out of stock_cost_value). */
  products_without_cost: number;
  low_stock_threshold: number;
}

export interface RestockItem {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  category: string;
  price: number;
  stock_quantity: number;
  /** The threshold in effect for this product. */
  low_stock_threshold: number;
  sold_last_7_days: number;
  days_left: number | null;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string | null;
  change: number;
  previous_quantity: number;
  new_quantity: number;
  reason: MovementReason | string;
  note: string | null;
  order_id: string | null;
  admin_name: string | null;
  created_at: string;
}

export interface AdminInventory {
  summary: InventorySummary;
  needs_restock: RestockItem[];
  movements: InventoryMovement[];
  movements_total: number;
}

export const getAdminInventory = async (params: { reason?: MovementReason; skip?: number; limit?: number } = {}): Promise<AdminInventory> => {
  const q = new URLSearchParams();
  if (params.reason) q.set("reason", params.reason);
  q.set("skip", String(params.skip ?? 0));
  q.set("limit", String(params.limit ?? 30));
  return fetchClient<AdminInventory>(`/admin/inventory?${q}`, { cache: "no-store" });
};
