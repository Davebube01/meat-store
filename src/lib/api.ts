import { products as initialProducts, Product } from '@/data/products';

let products = [...initialProducts];

export const getProducts = async (): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
  return products;
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
  return products.find((p) => p.slug === slug);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
  products.push(newProduct);
  return newProduct;
};

export const updateProduct = async (slug: string, productData: Partial<Product>): Promise<Product | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = products.findIndex((p) => p.slug === slug);
  if (index === -1) return undefined;
  
  products[index] = { ...products[index], ...productData };
  return products[index];
};

export const deleteProduct = async (slug: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const initialLength = products.length;
  products = products.filter((p) => p.slug !== slug);
  return products.length !== initialLength;
};
