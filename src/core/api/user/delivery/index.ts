import { fetchClient } from "../../client";

export interface DeliveryZone {
  id: string;
  name: string;
  estimated_fee: number;
}

// Estimated fee only — the customer pays the courier directly, in cash, on
// delivery. This is never charged online.
export const getDeliveryZones = async (): Promise<DeliveryZone[]> => {
  return fetchClient<DeliveryZone[]>("/api/v1/delivery/zones");
};
