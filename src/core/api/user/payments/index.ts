import { fetchClient } from "../../client";

export interface InitializePaymentPayload {
  email: string;
  order_id: string;
  // No amount field on purpose: the backend always charges the order's own
  // server-computed total_amount — never a client-supplied figure.
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
