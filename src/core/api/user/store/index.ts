import { fetchClient } from "../../client";

/** The store's public contact and pickup details (set in admin Settings). */
export interface StoreInfo {
  store_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  pickup_address: string | null;
  pickup_instructions: string | null;
}

export const getStoreInfo = async (): Promise<StoreInfo> => fetchClient<StoreInfo>("/api/v1/store");
