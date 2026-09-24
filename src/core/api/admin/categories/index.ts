import { fetchClient } from "../../client";
import { Category } from "../../user/categories";

export interface AdminCategory extends Category {
  description?: string;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
}

/** Every category, inactive ones included, with its product count. */
export const getAdminCategories = async (): Promise<AdminCategory[]> => {
  return fetchClient<AdminCategory[]>('/admin/categories');
};

export const createAdminCategory = async (category: CategoryInput): Promise<AdminCategory> => {
  return fetchClient<AdminCategory>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
};

export const updateAdminCategory = async (id: string, categoryData: Partial<CategoryInput>): Promise<AdminCategory> => {
  return fetchClient<AdminCategory>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
};

/** Throws with the API's reason, e.g. when products still use the category. */
export const deleteAdminCategory = async (id: string): Promise<void> => {
  await fetchClient(`/admin/categories/${id}`, { method: 'DELETE' });
};

/** "Goat Parts & Offal" -> "goat-parts-offal" (matches the API's slug rule). */
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
