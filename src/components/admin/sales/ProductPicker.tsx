"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Search } from "lucide-react";
import type { Product } from "@/core/api";
import { getThumbnailUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/utils";
import { naira, stockUnit } from "./ticket";

interface Props {
  products: Product[] | undefined;
  categories: { slug: string; name: string }[];
  loading: boolean;
  /** Stock of this product already on the ticket. */
  held: (productId: string) => number;
  onPick: (product: Product) => void;
}

/** Search and category tabs over the active catalogue; tap a tile to add it. */
export function ProductPicker({ products, categories, loading, held, onPick }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" jumps to search, like most tills and web apps.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable]");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = useMemo(() => (products ?? []).filter((p) => p.is_active), [products]);
  const tabs = useMemo(
    () => categories.filter((c) => active.some((p) => p.category === c.slug)),
    [categories, active],
  );
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return active
      .filter((p) => (!category || p.category === category) && (!q || p.name.toLowerCase().includes(q)))
      .sort((a, b) => Number(b.stock_quantity > 0) - Number(a.stock_quantity > 0) || a.name.localeCompare(b.name));
  }, [active, search, category]);

  const firstAvailable = shown.find((p) => p.stock_quantity - held(p.id) > 0);

  return (
    <section className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={searchRef}
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            // Enter adds the first match: search, Enter, done.
            if (e.key === "Enter" && firstAvailable) {
              e.preventDefault();
              onPick(firstAvailable);
              setSearch("");
            }
          }}
          placeholder="Search products  (press / to jump here, Enter to add the first match)"
          aria-label="Search products"
          autoFocus
          className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#3f7a55] focus:ring-2 focus:ring-[#3f7a55]/15 [&::-webkit-search-cancel-button]:hidden"
        />
      </div>

      {tabs.length > 1 && (
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {[{ slug: null as string | null, name: "All" }, ...tabs].map((c) => (
            <button
              key={c.slug ?? "all"}
              type="button"
              aria-pressed={category === c.slug}
              onClick={() => setCategory(c.slug)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium",
                category === c.slug ? "border-[#3f7a55] bg-[#3f7a55] text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-16"><Loader2 className="h-6 w-6 animate-spin text-green-600" /></div>
      ) : shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">No products match.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4">
          {shown.map((p) => {
            const left = p.stock_quantity - held(p.id);
            const out = left <= 0;
            const threshold = p.effective_low_stock_threshold ?? p.low_stock_threshold;
            const low = !out && threshold != null && left <= threshold;
            const quick = !p.weight_options?.length && !p.parts?.length;
            const onTicket = held(p.id) > 0;
            return (
              <button
                key={p.id}
                type="button"
                disabled={out}
                onClick={() => onPick(p)}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
                  onTicket ? "border-[#3f7a55] ring-1 ring-[#3f7a55]" : "border-gray-200 hover:border-[#3f7a55]/50",
                )}
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  {p.image_url && <Image src={getThumbnailUrl(p.image_url, 320)} alt="" fill unoptimized className="object-cover" />}
                  {quick && !out && (
                    <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#3f7a55] shadow-sm" title="Adds straight away">
                      <Plus className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-gray-900">{p.name}</p>
                  <p className="mt-auto pt-1 text-xs text-gray-500">
                    {naira(p.price)} ·{" "}
                    {out ? <span className="font-medium text-red-600">Sold out</span>
                      : <span className={low ? "font-medium text-amber-700" : ""}>{Number(left.toFixed(2))} {stockUnit(p)} left</span>}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
