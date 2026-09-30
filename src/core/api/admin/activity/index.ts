import { authFetch, fetchClient } from "../../client";

export type ActivityEntityType = "product" | "category" | "order" | "sale" | "settings" | "staff" | "admin" | "message";

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
  /** Worth a second look: voids, cancellations, deletions, staff changes, exports. */
  flagged: boolean;
  /** Where its subject lives in the admin, if it still exists. */
  link: string | null;
}

export interface ActivityPage {
  items: ActivityEntry[];
  total: number;
}

export interface ActivityParams {
  entity_type?: ActivityEntityType;
  /** Only what this staff member did. */
  actor_id?: string;
  /** Only flagged entries. */
  flagged?: boolean;
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

export interface ActivitySummary {
  total: number;
  flagged: number;
  /** entity type -> count */
  types: Record<string, number>;
  actors: { id: string; name: string; count: number }[];
}

/** Counts for the filters, over the same search and dates. */
export const getActivitySummary = async (params: Pick<ActivityParams, "q" | "date_from" | "date_to"> = {}) =>
  fetchClient<ActivitySummary>(`/admin/activity/summary${query(params)}`, { cache: "no-store" });

export type ExportDataset = "orders" | "sale_lines" | "products" | "customers" | "stock_movements" | "activity";

export interface ExportCatalogue {
  /** Only the exports this person's role may download. */
  datasets: { key: ExportDataset; dated: boolean; rows: number; columns: string[] }[];
  /** The store's last few downloads (empty without activity access). */
  recent: { summary: string; file: string | null; by: string | null; at: string }[];
}

/** What can be exported, with row counts for the range (dated exports only). */
export const getExportCatalogue = async (range: { date_from?: string; date_to?: string } = {}) =>
  fetchClient<ExportCatalogue>(`/admin/exports${query(range)}`, { cache: "no-store" });

/** Download a CSV export (sent with the admin session) and save it with the server's file name. */
export const downloadExport = async (
  dataset: ExportDataset,
  range: { date_from?: string; date_to?: string } = {},
  /** Activity only: the Activity page's filters. */
  filters: Pick<ActivityParams, "entity_type" | "actor_id" | "q" | "flagged"> = {},
) => {
  const res = await authFetch(`/admin/exports/${dataset}.csv${query({ ...range, ...filters })}`);
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
