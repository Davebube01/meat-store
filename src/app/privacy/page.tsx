import { LegalDocument } from "@/components/legal/LegalDocument";

export const metadata = {
  title: "Privacy policy | Everything Fresh",
  description: "What personal information we collect, why, who we share it with and your rights.",
};

export default function PrivacyPage() {
  return <LegalDocument slug="privacy" fallbackTitle="Privacy policy" />;
}
