import { fetchClient } from "../../client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
  return fetchClient<Category[]>('/api/v1/categories', { cache: 'no-store' });
};
