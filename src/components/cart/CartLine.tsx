"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Info, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/core/store/useCart";
import type { CartCheckResult } from "@/core/api/user/cartCheck";
import { getThumbnailUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/utils";

type Item = ReturnType<typeof useCart.getState>["items"][number];

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export function CartLine({ item, check, notice, compact = false, onNavigate }: {
  item: Item;
  check?: CartCheckResult;
  notice?: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { updateQuantity, removeItem } = useCart();
  const blocked = check?.status === "out_of_stock" || check?.status === "unavailable";
  // Until the first check lands, fall back to the stock the product had when added.
  const max = check ? check.max_quantity : Math.floor(item.stock_quantity / (item.stockUnits || 1));
  const href = `/products/${item.slug}`;
  const thumb = compact ? 64 : 88;

  return (
    <li className={cn("flex gap-3", compact ? "py-3" : "py-4 sm:gap-4", blocked && "opacity-90")}>
      <Link
        href={href}
        onClick={onNavigate}
        className="relative shrink-0 overflow-hidden rounded-xl bg-gray-100"
        style={{ width: thumb, height: thumb }}
      >
        <Image src={getThumbnailUrl(item.image_url, thumb * 2)} alt={item.name} fill unoptimized className={cn("object-cover", blocked && "grayscale")} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={href} onClick={onNavigate} className={cn("block font-medium text-gray-900 hover:text-[#3f7a55]", compact ? "text-sm" : "font-serif text-lg font-semibold")}>
              <span className="line-clamp-2">{item.name}</span>
            </Link>
            <p className="text-xs text-gray-500">
              {item.selectedOption && <>{item.selectedOption} · </>}
              {naira(item.price)} each
            </p>
          </div>
          <span className={cn("shrink-0 font-semibold tabular-nums", blocked ? "text-gray-400 line-through" : "text-gray-900", compact && "text-sm")}>
            {naira(item.price * item.quantity)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {blocked ? (
            <span className="text-xs font-medium text-red-600">{check?.status === "out_of_stock" ? "Sold out" : "No longer available"}</span>
          ) : (
            <div className="flex h-9 items-center rounded-lg border border-gray-200 bg-white">
              <button
                type="button"
                aria-label={`One fewer ${item.name}`}
                disabled={item.quantity <= 1}
                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                className="flex h-full w-9 items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">{item.quantity}</span>
              <button
                type="button"
                aria-label={`One more ${item.name}`}
                disabled={item.quantity >= max}
                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                className="flex h-full w-9 items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => removeItem(item.cartId)}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
              blocked ? "bg-red-600 text-white hover:bg-red-700" : "text-gray-500 hover:bg-red-50 hover:text-red-600",
            )}
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>

        {(blocked || notice) && (
          <p className={cn("mt-2 flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-xs", blocked ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800")}>
            {blocked ? <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" /> : <Info className="mt-px h-3.5 w-3.5 shrink-0" />}
            {blocked ? check?.message ?? "Remove this to continue." : notice}
          </p>
        )}
        {!blocked && !notice && !compact && item.quantity >= max && max > 0 && (
          <p className="mt-2 text-xs text-gray-500">That&apos;s all we have in stock right now.</p>
        )}
      </div>
    </li>
  );
}
