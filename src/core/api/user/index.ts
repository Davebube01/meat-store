import { fetchClient, API_BASE_URL } from "../client";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  weightOptions: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

export const getProducts = async (): Promise<Product[]> => {
  return fetchClient<Product[]>('/api/v1/products/', { cache: 'no-store' });
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
};

export const getCategories = async (): Promise<Category[]> => {
  return fetchClient<Category[]>('/api/v1/categories', { cache: 'no-store' });
};

export const authenticateUser = async (payload: any, isLogin: boolean) => {
  const endpoint = isLogin ? "/api/v1/auth/login/json" : "/api/v1/auth/register";
  return fetchClient<any>(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getUserMe = async () => {
  return fetchClient<any>("/api/v1/auth/me");
};
