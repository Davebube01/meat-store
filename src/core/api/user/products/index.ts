import { fetchClient } from "../../client";

/** One size a product is sold in. `stock_units` is how much stock one uses (e.g. 2 for "2kg"). */
export interface WeightOption {
  label: string;
  price: number;
  stock_units: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  /** For products with sizes, the cheapest size's price. */
  price: number;
  description: string;
  image_url: string;
  category: string;
  weight_options: WeightOption[];
  /** Cost per unit of stock. Only returned by admin endpoints. */
  cost_price?: number | null;
  /** Admin only: this product's own alert level (null = store default)... */
  low_stock_threshold?: number | null;
  /** ...and the level actually in effect. */
  effective_low_stock_threshold?: number;
  parts?: string[];
  stock_quantity: number;
  is_active: boolean;
}


/** True when sizes cost different amounts, so a single price needs a "from". */
export const hasVaryingPrices = (product: Product): boolean =>
  new Set((product.weight_options ?? []).map((o) => o.price)).size > 1;

export const getProducts = async (): Promise<Product[]> => {
  return fetchClient<Product[]>('/api/v1/products/', { cache: 'no-store' });
};

export interface ProductDetail {
  product: Product;
  /** Display name of product.category; null if it isn't an active category. */
  category_name: string | null;
  related: Product[];
}

/** The product page's data in one request; undefined if there's no such active product. */
export const getProductDetail = async (slug: string): Promise<ProductDetail | undefined> => {
  try {
    return await fetchClient<ProductDetail>(`/api/v1/products/slug/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  } catch (err) {
    if ((err as { status?: number }).status === 404) return undefined;
    throw err;
  }
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
};
