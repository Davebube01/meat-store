import type { Metadata, Viewport } from "next";

// Scopes "Add to Home Screen" / installability to the admin portal only —
// the storefront's root layout never references a manifest, so customers
// never see an install prompt. See manifest.webmanifest/route.ts for why
// this isn't the special app/manifest.ts file convention.
export const metadata: Metadata = {
  title: "MeatStore Admin",
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MeatStore Admin",
  },
};

export const viewport: Viewport = {
  themeColor: "#15803d",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="">{children}</main>
  );
}
