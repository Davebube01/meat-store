import { fetchClient } from "../../client";

export type MessageTopic = "order" | "delivery" | "bulk" | "feedback" | "other";
export type MessageStatus = "new" | "handled";

export interface ContactReply {
  id: string;
  body: string;
  sent_by: string | null;
  sent_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: MessageTopic;
  order_ref: string | null;
  /** The order that order_ref points at, when it matches exactly one. */
  order_id: string | null;
  message: string;
  user_id: string | null;
  status: MessageStatus;
  handled_at: string | null;
  handled_by: string | null;
  created_at: string;
  replies: ContactReply[];
}

export interface MessagesQuery {
  status?: MessageStatus | "all";
  topic?: MessageTopic;
  q?: string;
  limit?: number;
}

export interface MessagesInbox {
  messages: ContactMessage[];
  /** Counts follow the topic and search, not the status tab. */
  new_count: number;
  handled_count: number;
}

export const getAdminMessages = async ({ status = "all", topic, q, limit }: MessagesQuery = {}) => {
  const params = new URLSearchParams({ status });
  if (topic) params.set("topic", topic);
  if (q) params.set("q", q);
  if (limit) params.set("limit", String(limit));
  return fetchClient<MessagesInbox>(`/admin/messages?${params}`, { cache: "no-store" });
};

export const getAdminMessage = async (id: string) =>
  fetchClient<ContactMessage>(`/admin/messages/${id}`, { cache: "no-store" });

export const setAdminMessageStatus = async (id: string, status: MessageStatus) =>
  fetchClient<ContactMessage>(`/admin/messages/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });

/** Emails the customer and keeps the reply on the message. */
export const replyToAdminMessage = async (id: string, body: string, mark_handled: boolean) =>
  fetchClient<ContactMessage>(`/admin/messages/${id}/reply`, { method: "POST", body: JSON.stringify({ body, mark_handled }) });

export const deleteAdminMessage = async (id: string) =>
  fetchClient<void>(`/admin/messages/${id}`, { method: "DELETE" });
