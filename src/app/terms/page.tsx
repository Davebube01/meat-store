import { LegalDocument } from "@/components/legal/LegalDocument";

export const metadata = {
  title: "Terms of service | Everything Fresh",
  description: "The terms for ordering, paying, delivery, pickup and cancellations.",
};

export default function TermsPage() {
  return <LegalDocument slug="terms" fallbackTitle="Terms of service" />;
}
