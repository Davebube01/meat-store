import { fetchClient } from "../../client";

export interface InitializePaymentPayload {
  email: string;
  amount: number;       // total in NGN e.g. 15000.00
  delivery_fee: number;
  delivery_address: string;
  order_id: string;
}

export interface InitializePaymentResponse {
  authorization_url: string;
  reference: string;
  public_key: string;
}

export const initializePayment = async (
  payload: InitializePaymentPayload
): Promise<InitializePaymentResponse> => {
  return fetchClient<InitializePaymentResponse>("/api/v1/payments/initialize", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const simulateWebhook = async (reference: string): Promise<{ status: string; message: string }> => {
  return fetchClient("/api/v1/payments/webhook/simulate", {
    method: "POST",
    body: JSON.stringify({ reference }),
  });
};

export const updateOrderStatusApi = async (
  orderId: string,
  status: string
): Promise<unknown> => {
  return fetchClient(`/api/v1/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};
