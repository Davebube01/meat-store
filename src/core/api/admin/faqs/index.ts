import { fetchClient } from "../../client";
import type { Faq, FaqSection } from "../../user/faq";

export interface FaqInput {
  id?: string | null;
  section: FaqSection;
  question: string;
  answer: string;
  is_published: boolean;
}

/** Every question, hidden ones included. `is_default` until the store saves its own list. */
export const getAdminFaqs = async () =>
  fetchClient<{ items: Faq[]; is_default: boolean }>("/admin/faqs", { cache: "no-store" });

/** Replaces the whole list, in display order. */
export const saveAdminFaqs = async (items: FaqInput[]) =>
  fetchClient<Faq[]>("/admin/faqs", { method: "PUT", body: JSON.stringify({ items }) });
