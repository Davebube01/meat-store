import { fetchClient } from "../../client";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  topic: "order" | "delivery" | "bulk" | "feedback" | "other";
  order_ref?: string;
  message: string;
  /** Honeypot: must stay empty. */
  website?: string;
}

export const sendContactMessage = async (body: ContactPayload) =>
  fetchClient<{ ok: boolean }>("/api/v1/contact", { method: "POST", body: JSON.stringify(body) });
