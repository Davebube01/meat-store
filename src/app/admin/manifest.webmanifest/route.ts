import { NextResponse } from "next/server";

// A route handler, not the root-only `app/manifest.ts` convention (this
// Next.js version requires that one to live at the app root, which would
// make the whole site — including the storefront — installable). Serving it
// here instead, and only linking to it from app/admin/layout.tsx's metadata,
// keeps "Add to Home Screen" scoped to the admin portal.
export function GET() {
  return NextResponse.json(
    {
      name: "Everything Fresh Admin",
      short_name: "EF Admin",
      description: "Manage orders, stock and sales for Everything Fresh.",
      // Relative to this manifest's own URL (/admin/...), so these resolve
      // under /admin/ regardless of host.
      start_url: "/admin/dashboard",
      scope: "/admin/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#15803d",
      icons: [
        { src: "/admin/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/admin/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/admin/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json" } }
  );
}
