import { fetchClient } from "../../client";

export type StaffRole = "owner" | "manager" | "cashier";

export interface StaffMember {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: StaffRole;
  is_active: boolean;
  created_at: string;
  last_signed_in_at: string | null;
}

export interface StaffList {
  staff: StaffMember[];
  roles: { key: StaffRole; label: string; permissions: string[] }[];
  /** permission -> what it lets someone do */
  permissions: Record<string, string>;
}

export interface NewStaff {
  email: string;
  full_name: string;
  phone?: string;
  role: StaffRole;
  password: string;
}

export const getStaff = async (): Promise<StaffList> => fetchClient<StaffList>("/admin/staff", { cache: "no-store" });

export const addStaff = async (data: NewStaff): Promise<StaffMember> =>
  fetchClient<StaffMember>("/admin/staff", { method: "POST", body: JSON.stringify(data) });

export const updateStaff = async (
  id: string,
  data: Partial<{ full_name: string; phone: string; role: StaffRole; is_active: boolean }>,
): Promise<StaffMember> => fetchClient<StaffMember>(`/admin/staff/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const resetStaffPassword = async (id: string, password: string): Promise<void> =>
  fetchClient<void>(`/admin/staff/${id}/reset-password`, { method: "POST", body: JSON.stringify({ password }) });

export const changeOwnPassword = async (current_password: string, new_password: string): Promise<void> =>
  fetchClient<void>("/admin/auth/change-password", { method: "POST", body: JSON.stringify({ current_password, new_password }) });

/** A readable first password to hand over, e.g. "goat-7342-fresh". The staff member changes it after signing in. */
export function suggestPassword(): string {
  const words = ["goat", "fresh", "grill", "suya", "pepper", "market", "butcher", "spice", "onion", "cut"];
  const pick = () => words[crypto.getRandomValues(new Uint32Array(1))[0] % words.length];
  const digits = String(crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, "0");
  return `${pick()}-${digits}-${pick()}`;
}
