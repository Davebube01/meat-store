import { authFetch, fetchClient } from "../../client";

export type ActivityEntityType = "product" | "category" | "order" | "sale" | "settings" | "admin";

export interface ActivityEntry {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  /** e.g. "product.updated", "order.cancelled", "sale.voided" */
  action: string;
  entity_type: ActivityEntityType;
  entity_id: string | null;
  entity_label: string | null;
  summary: string;
  /** For edits: { field: { from, to } } */
  changes: Record<string, { from: unknown; to: unknown }> | null;
  created_at: string;
}

export interface ActivityPage {
  items: ActivityEntry[];
  total: number;
}

export interface ActivityParams {
  entity_type?: ActivityEntityType;
  q?: string;
  date_from?: string;
  date_to?: string;
  skip?: number;
  limit?: number;
}

const query = (params: object) => {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") q.set(key, String(value));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
};

export const getActivity = async (params: ActivityParams = {}): Promise<ActivityPage> =>
  fetchClient<ActivityPage>(`/admin/activity${query(params)}`, { cache: "no-store" });

export type ExportDataset = "orders" | "sale_lines" | "products" | "customers" | "stock_movements" | "activity";

/** Download a CSV export (sent with the admin session) and save it with the server's file name. */
export const downloadExport = async (dataset: ExportDataset, range: { date_from?: string; date_to?: string } = {}) => {
  const res = await authFetch(`/admin/exports/${dataset}.csv${query(range)}`);
  if (!res.ok) {
    const { handleApiResponseError } = await import("@/core/errors/errorHandler");
    await handleApiResponseError(res);
  }
  const name = res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ?? `${dataset}.csv`;
  const url = URL.createObjectURL(await res.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
