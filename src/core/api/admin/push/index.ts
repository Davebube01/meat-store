import { fetchClient } from "../../client";

export const getPushPublicKey = async (): Promise<string> =>
  (await fetchClient<{ public_key: string | null }>("/admin/push/public-key")).public_key ?? "";

export const subscribePush = async (subscription: PushSubscriptionJSON): Promise<void> =>
  fetchClient<void>("/admin/push/subscribe", {
    method: "POST",
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.keys!.p256dh, auth: subscription.keys!.auth },
    }),
  });

export const unsubscribePush = async (endpoint: string): Promise<void> =>
  fetchClient<void>("/admin/push/unsubscribe", { method: "POST", body: JSON.stringify({ endpoint }) });
