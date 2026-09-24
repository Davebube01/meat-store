import { fetchClient } from "../../client";
import { Product } from "../../user/products";

export const getAdminProducts = async (): Promise<Product[]> => {
  return fetchClient<Product[]>('/admin/products', { cache: 'no-store' });
};

export const getAdminProductById = async (id: string): Promise<Product> => {
  return fetchClient<Product>(`/admin/products/${id}`, { cache: 'no-store' });
};

export const getAdminProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const products = await getAdminProducts();
  return products.find((p) => p.slug === slug);
};

export const createAdminProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  return fetchClient<Product>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
};

export const updateAdminProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  return fetchClient<Product>(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const deleteAdminProduct = async (id: string): Promise<boolean> => {
  try {
  await fetchClient(`/admin/products/${id}`, {
    method: 'DELETE'
  });
  return true;
  } catch (error) {
    return false;
  }
};

export interface StockMovement {
  id: string;
  product_id: string;
  change: number;
  previous_quantity: number;
  new_quantity: number;
  reason: string;
  note: string | null;
  order_id: string | null;
  admin_id: string | null;
  created_at: string;
}

export interface StockAdjustmentPayload {
  change: number;
  reason: string;
  note?: string;
}

export const adjustProductStock = async (id: string, payload: StockAdjustmentPayload): Promise<Product> => {
  return fetchClient<Product>(`/admin/products/${id}/stock`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getProductStockMovements = async (id: string, skip = 0, limit = 50): Promise<StockMovement[]> => {
  return fetchClient<StockMovement[]>(`/admin/products/${id}/stock-movements?skip=${skip}&limit=${limit}`, { cache: 'no-store' });
};
