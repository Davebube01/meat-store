import { fetchClient } from "../../client";

export type LegalSlug = "terms" | "privacy";

export interface LegalPage {
  slug: LegalSlug;
  title: string;
  /** "## " headings, "- " bullets, **bold**, [links](/path), blank lines between paragraphs. */
  body: string;
  updated_at: string;
  is_default: boolean;
}

export const getLegalPage = async (slug: LegalSlug): Promise<LegalPage> => fetchClient<LegalPage>(`/api/v1/pages/${slug}`);
