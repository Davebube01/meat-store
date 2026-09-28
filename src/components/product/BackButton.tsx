"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function cameFromStore(): boolean {
  // Client-side (Link) navigations don't update document.referrer or add a
  // navigation timing entry, so if this URL isn't the one the tab originally
  // loaded, we got here from another page of the store.
  const loaded = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (loaded && loaded.name !== window.location.href) return true;
  // Hard-loaded here: only go back if the previous page was ours.
  try {
    return !!document.referrer && new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Goes back to wherever the shopper came from inside the store (keeping
 * their filters and scroll), or to `fallback` if they landed here directly.
 */
export function BackButton({ fallback = "/products", label = "Back" }: { fallback?: string; label?: string }) {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1 && cameFromStore()) router.back();
    else router.push(fallback);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white pl-2.5 pr-3.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-[#3f7a55]/40 hover:text-[#2d583d]"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
