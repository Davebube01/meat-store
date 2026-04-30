import { fetchClient } from "../../client";

export interface Customer {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  phone: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

export const getCustomers = async (): Promise<Customer[]> => {
  return fetchClient<Customer[]>('/admin/customers');
};

export const getCustomerById = async (id: string): Promise<any> => {
  return fetchClient<any>(`/admin/customers/${id}`);
};
