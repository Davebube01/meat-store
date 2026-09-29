import { fetchClient } from "../../client";

export type FaqSection = "ordering" | "delivery" | "payment" | "account";

export const FAQ_SECTIONS: { key: FaqSection; label: string }[] = [
  { key: "ordering", label: "Ordering" },
  { key: "delivery", label: "Delivery and pickup" },
  { key: "payment", label: "Payment" },
  { key: "account", label: "Your account" },
];

export interface Faq {
  /** null for the built-in defaults, shown until the store saves its own. */
  id: string | null;
  section: FaqSection;
  question: string;
  answer: string;
  is_published: boolean;
}

/** Published questions, in order (edited in admin Settings → FAQ page). */
export const getFaqs = async (): Promise<Faq[]> => fetchClient<Faq[]>("/api/v1/faqs");
