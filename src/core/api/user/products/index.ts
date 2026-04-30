import { fetchClient } from "../../client";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  weight_options: string[];
  parts?: string[];
  is_active: boolean;
}


export const getProducts = async (): Promise<Product[]> => {
  return fetchClient<Product[]>('/api/v1/products/', { cache: 'no-store' });
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
};
