import { fetchClient } from "../../client";

export interface ProfileUpdate {
  full_name: string;
  phone: string | null;
}

export interface SavedAddressInput {
  label: string;
  zone_id: string;
  address: string;
  apartment?: string | null;
  landmark?: string | null;
  instructions?: string | null;
  is_default?: boolean;
}

export interface SavedAddress extends SavedAddressInput {
  id: string;
  zone_name: string | null;
  /** Current estimated courier fee; null if deliveries there were switched off. */
  zone_fee: number | null;
  is_default: boolean;
  created_at: string;
}

export const updateMyProfile = async (body: ProfileUpdate) =>
  fetchClient<{ id: string; full_name: string | null; phone: string | null }>("/api/v1/account/profile", {
    method: "PATCH",
    body: JSON.stringify(body),
  });

/** Signs out every other session; this one stays signed in. */
export const changeMyPassword = async (current_password: string, new_password: string) =>
  fetchClient<{ ok: boolean; other_sessions_ended: number }>("/api/v1/auth/password", {
    method: "POST",
    body: JSON.stringify({ current_password, new_password }),
    credentials: "include", // the session cookie tells the API which session to keep
  });

export const signOutOtherSessions = async () =>
  fetchClient<{ ok: boolean; other_sessions_ended: number }>("/api/v1/auth/sessions/sign-out-others", {
    method: "POST",
    credentials: "include",
  });

export const getMyAddresses = async () => fetchClient<SavedAddress[]>("/api/v1/account/addresses", { cache: "no-store" });

export const addMyAddress = async (body: SavedAddressInput) =>
  fetchClient<SavedAddress>("/api/v1/account/addresses", { method: "POST", body: JSON.stringify(body) });

export const updateMyAddress = async (id: string, body: SavedAddressInput) =>
  fetchClient<SavedAddress>(`/api/v1/account/addresses/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const setMyDefaultAddress = async (id: string) =>
  fetchClient<SavedAddress>(`/api/v1/account/addresses/${id}/default`, { method: "POST" });

export const deleteMyAddress = async (id: string) =>
  fetchClient<void>(`/api/v1/account/addresses/${id}`, { method: "DELETE" });
