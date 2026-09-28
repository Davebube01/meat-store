import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import type { Category, Product } from "@/core/api";
import { getDisplayImageUrl } from "@/lib/imageUrl";

/** One tile per active category that has products, using one of its product photos. */
export function CategoryTiles({ categories, products }: { categories: Category[]; products: Product[] }) {
  const tiles = categories
    .map((c) => {
      const items = products.filter((p) => p.category === c.slug);
      const cover = items.find((p) => p.image_url && p.stock_quantity > 0) ?? items.find((p) => p.image_url);
      return { ...c, count: items.length, image: cover?.image_url };
    })
    .filter((t) => t.count > 0);

  if (tiles.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">Shop by category</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">
              What are you cooking this week?
            </h2>
          </div>
          <Link href="/products" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#3f7a55] hover:underline sm:inline-flex">
            Browse all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {tiles.map((t) => (
            <Link
              key={t.slug}
              href={`/products?category=${encodeURIComponent(t.slug)}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-[#f4f7f5]"
            >
              {t.image ? (
                <Image
                  src={getDisplayImageUrl(t.image, 480)}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <Leaf className="absolute left-1/2 top-1/3 h-10 w-10 -translate-x-1/2 text-[#3f7a55]/40" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="relative p-4 text-white">
                <p className="font-serif text-lg font-semibold leading-tight">{t.name}</p>
                <p className="mt-0.5 text-xs text-white/80">
                  {t.count} product{t.count === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
