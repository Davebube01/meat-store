"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PackageSearch, Search, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Category, Product } from "@/core/api";
import { cn } from "@/lib/utils";
import { SORTS, type ListState } from "./listState";

const inStock = (p: Product) => p.stock_quantity > 0;

export function ProductList({ products, categories, initial }: { products: Product[]; categories: Category[]; initial: ListState }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<ListState>(initial);

  const update = (patch: Partial<ListState>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Mirror into the URL (no new history entry per keystroke), so the back
    // button from a product and shared links land on the same view.
    const qs = new URLSearchParams();
    if (next.category !== "all") qs.set("category", next.category);
    if (next.q.trim()) qs.set("q", next.q.trim());
    if (next.sort !== "featured") qs.set("sort", next.sort);
    if (next.inStock) qs.set("stock", "1");
    router.replace(qs.size ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const categoryName = useMemo(() => new Map(categories.map((c) => [c.slug, c.name])), [categories]);

  const { visible, counts, total } = useMemo(() => {
    const q = state.q.trim().toLowerCase();
    const matchesText = (p: Product) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q) ||
      (categoryName.get(p.category) ?? "").toLowerCase().includes(q);
    // Chip counts honour the search and stock filter, not the category itself.
    const base = products.filter((p) => matchesText(p) && (!state.inStock || inStock(p)));
    const counts = new Map<string, number>();
    for (const p of base) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);

    const byName = (a: Product, b: Product) => a.name.localeCompare(b.name);
    const visible = base
      .filter((p) => state.category === "all" || p.category === state.category)
      .sort((a, b) => {
        switch (state.sort) {
          case "price_asc":
            return a.price - b.price || byName(a, b);
          case "price_desc":
            return b.price - a.price || byName(a, b);
          case "newest":
            return (b.created_at ?? "").localeCompare(a.created_at ?? "") || byName(a, b);
          case "name":
            return byName(a, b);
          default:
            // Featured: what you can buy right now first.
            return Number(inStock(b)) - Number(inStock(a)) || byName(a, b);
        }
      });
    return { visible, counts, total: base.length };
  }, [products, state, categoryName]);

  const filtered = state.category !== "all" || state.q.trim() !== "" || state.inStock;
  const current = categories.find((c) => c.slug === state.category);
  // Only categories with something to show (under the current search/stock).
  const chips = categories.filter((c) => (counts.get(c.slug) ?? 0) > 0 || c.slug === state.category);
  const reset = () => update({ category: "all", q: "", inStock: false });

  return (
    <>
      <div className="border-b border-[#f0e6da]">
        <div className="container mx-auto px-4 pb-6 pt-8 md:pt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">{current?.name ?? "Shop"}</h1>
              <p className="mt-1 text-gray-600">{current?.description || "Fresh goat meat, cuts and market produce, delivered across Abuja."}</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={state.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search products"
                aria-label="Search products"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm outline-none focus:border-[#3f7a55] focus:ring-2 focus:ring-[#3f7a55]/15"
              />
              {state.q && (
                <button type="button" onClick={() => update({ q: "" })} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Categories">
            {[{ slug: "all", name: "All" }, ...chips].map((c) => {
              const on = state.category === c.slug;
              const n = c.slug === "all" ? total : counts.get(c.slug) ?? 0;
              return (
                <button
                  key={c.slug}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => update({ category: c.slug })}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                    on ? "border-[#3f7a55] bg-[#3f7a55] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                  )}
                >
                  {c.name}
                  <span className={cn("rounded-full px-1.5 text-[11px] font-semibold tabular-nums", on ? "bg-white/20" : "bg-gray-100 text-gray-500")}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{visible.length}</span> product{visible.length === 1 ? "" : "s"}
            {filtered && (
              <button type="button" onClick={reset} className="ml-3 font-semibold text-[#3f7a55] hover:underline">
                Clear filters
              </button>
            )}
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              role="switch"
              aria-checked={state.inStock}
              onClick={() => update({ inStock: !state.inStock })}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <span className={cn("relative h-5 w-9 rounded-full transition-colors", state.inStock ? "bg-[#3f7a55]" : "bg-gray-300")}>
                <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all", state.inStock ? "left-[18px]" : "left-0.5")} />
              </span>
              In stock only
            </button>
            <select
              value={state.sort}
              onChange={(e) => update({ sort: e.target.value as ListState["sort"] })}
              aria-label="Sort products"
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-[#f0e6da] bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f7f5] text-[#3f7a55]"><PackageSearch className="h-7 w-7" /></span>
            <p className="mt-4 font-semibold text-gray-900">
              {state.q.trim() ? `Nothing matches "${state.q.trim()}"` : "Nothing here right now"}
            </p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              {state.inStock ? "Some items may be sold out. Try showing everything." : "Try another word or category."}
            </p>
            <button type="button" onClick={reset} className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#3f7a55] px-4 text-sm font-semibold text-white hover:bg-[#2d583d]">
              Show all products
            </button>
          </div>
        )}
      </div>
    </>
  );
}
