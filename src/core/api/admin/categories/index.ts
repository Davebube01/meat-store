import { fetchClient } from "../../client";
import { Category } from "../../user/categories";

export const createAdminCategory = async (category: Omit<Category, 'id' | 'is_active'>): Promise<Category> => {
  return fetchClient<Category>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
};

export const updateAdminCategory = async (id: string, categoryData: Partial<Category>): Promise<Category> => {
  return fetchClient<Category>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
};

export const deleteAdminCategory = async (id: string): Promise<boolean> => {
  try {
  await fetchClient(`/admin/categories/${id}`, {
    method: 'DELETE'
  });
  return true;
  } catch (error) {
    return false;
  }
};
