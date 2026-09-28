"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/core/store/useCart";
import { Product, hasVaryingPrices } from "@/core/api";
import { getDisplayImageUrl } from "@/lib/imageUrl";

const LOW_STOCK = 5;

export function ProductCard(product: Product) {
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const stock = Math.floor(product.stock_quantity);
  const outOfStock = stock <= 0;
  const unit = product.category === "per-kg" ? "kg" : "unit";
  const href = `/products/${product.slug}`;

  // Quick add uses the default size/cut, labelled the same way as the product page.
  const defaultWeight = product.weight_options?.[0];
  const defaultPart = product.parts?.[0];
  const fromPrice = hasVaryingPrices(product);

  const quickAdd = () => {
    if (outOfStock) return;
    addItem(product, { weight: defaultWeight, part: defaultPart });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg hover:shadow-gray-200/60">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-gray-100" tabIndex={-1} aria-hidden>
        <Image
          src={getDisplayImageUrl(product.image_url, 640)}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${outOfStock ? "opacity-60 grayscale" : ""}`}
        />
        {outOfStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-gray-900/85 px-2.5 py-1 text-xs font-semibold text-white">Sold out</span>
        ) : stock <= LOW_STOCK ? (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">Only {stock} left</span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-semibold leading-snug text-[#1a1a1a]">
          <Link href={href} className="after:absolute after:inset-0 focus:outline-none">
            <span className="line-clamp-2">{product.name}</span>
          </Link>
        </h3>
        {product.description && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className={`text-xl font-bold tracking-tight tabular-nums ${outOfStock ? "text-gray-400" : "text-gray-900"}`}>
              {fromPrice && <span className="mr-1 text-sm font-medium text-gray-500">from</span>}
              ₦{(defaultWeight?.price ?? product.price).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {defaultWeight ? `for ${defaultWeight.label}` : `per ${unit}`}
              {defaultPart && <> · {defaultPart}</>}
            </p>
          </div>
          <button
            type="button"
            onClick={quickAdd}
            disabled={outOfStock}
            aria-label={outOfStock ? `${product.name} is sold out` : `Add ${product.name} to cart`}
            className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-md shadow-green-500/30 transition-colors hover:bg-[#16a34a] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </article>
  );
}
