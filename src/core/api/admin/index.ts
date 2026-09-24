import { fetchClient, API_BASE_URL, authFetch } from "../client";
import { Product, Category } from "../user";

export const uploadAdminImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await authFetch('/admin/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) {
    const { handleApiResponseError } = await import("@/core/errors/errorHandler");
    await handleApiResponseError(res);
  }
  
  const data = await res.json();
  return `${API_BASE_URL}${data.imageUrl}`;
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
    method: 'DELETE',
  });
  return true;
  } catch (error) {
    return false;
  }
};

export const createAdminCategory = async (category: any): Promise<Category> => {
  return fetchClient<Category>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
};

export const updateAdminCategory = async (id: string, categoryData: any): Promise<Category> => {
  return fetchClient<Category>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
};

export const deleteAdminCategory = async (id: string): Promise<boolean> => {
  try {
  await fetchClient(`/admin/categories/${id}`, {
    method: 'DELETE',
  });
  return true;
  } catch (error) {
    return false;
  }
};

export const authenticateAdmin = async (payload: any) => {
  return fetchClient<any>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getAdminMe = async () => {
  return fetchClient<any>("/admin/auth/me");
};
