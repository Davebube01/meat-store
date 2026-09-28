import { fetchClient } from "../../client";

export interface AdminNotification {
  id: string;
  kind: "low_stock" | "out_of_stock" | string;
  title: string;
  body: string | null;
  /** Admin page to open, e.g. "/admin/products/goat-leg". */
  link: string | null;
  product_id: string | null;
  read_at: string | null;
  created_at: string;
}

export interface AdminNotificationList {
  unread_count: number;
  /** Unread first (newest first), then recent read ones. */
  items: AdminNotification[];
}

export const getAdminNotifications = async (limit = 20): Promise<AdminNotificationList> =>
  fetchClient<AdminNotificationList>(`/admin/notifications?limit=${limit}`, { cache: "no-store" });

export const markAdminNotificationRead = async (id: string): Promise<void> => {
  await fetchClient(`/admin/notifications/${id}/read`, { method: "POST" });
};

export const markAllAdminNotificationsRead = async (): Promise<void> => {
  await fetchClient(`/admin/notifications/read-all`, { method: "POST" });
};
