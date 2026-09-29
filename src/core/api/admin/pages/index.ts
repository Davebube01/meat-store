import { fetchClient } from "../../client";
import type { LegalPage, LegalSlug } from "../../user/pages";

export interface AdminLegalPage extends LegalPage {
  updated_by: string | null;
  /** The built-in text, with {placeholders}. */
  default_body: string;
}

export const getAdminLegalPage = async (slug: LegalSlug) =>
  fetchClient<AdminLegalPage>(`/admin/pages/${slug}`, { cache: "no-store" });

/** Saving the default text unchanged puts the page back on the default. */
export const saveAdminLegalPage = async (slug: LegalSlug, body: string) =>
  fetchClient<AdminLegalPage>(`/admin/pages/${slug}`, { method: "PUT", body: JSON.stringify({ body }) });
