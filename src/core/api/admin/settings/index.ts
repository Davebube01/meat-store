import { fetchClient } from "../../client";

export interface StoreDetails {
  store_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  pickup_address: string | null;
  pickup_instructions: string | null;
  about_headline: string | null;
  about_story: string | null;
  low_stock_threshold: number;
}

export interface AdminDeliveryZone {
  id: string;
  name: string;
  fee: number;
  is_active: boolean;
  sort_order: number;
  orders_count: number;
}

/** A zone as sent back to the API; `id` is omitted for new zones. */
export interface DeliveryZoneInput {
  id?: string;
  name: string;
  fee: number;
  is_active: boolean;
}

export interface PaymentStatus {
  provider: string;
  configured: boolean;
  mode: "test" | "live" | null;
  public_key_hint: string | null;
  webhook_url: string;
}

export interface AdminSettings {
  store: StoreDetails;
  zones: AdminDeliveryZone[];
  payments: PaymentStatus;
}

export const getAdminSettings = async (): Promise<AdminSettings> =>
  fetchClient<AdminSettings>("/admin/settings", { cache: "no-store" });

export const updateStoreDetails = async (details: StoreDetails): Promise<StoreDetails> =>
  fetchClient<StoreDetails>("/admin/settings/store", { method: "PUT", body: JSON.stringify(details) });

/** Saves the whole list in display order. Zones left out are switched off, not deleted. */
export const updateDeliveryZones = async (zones: DeliveryZoneInput[]): Promise<AdminDeliveryZone[]> =>
  fetchClient<AdminDeliveryZone[]>("/admin/settings/zones", { method: "PUT", body: JSON.stringify({ zones }) });
