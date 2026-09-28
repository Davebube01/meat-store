"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { Product, hasVaryingPrices } from "@/core/api";
import { stockInCart, useCart } from "@/core/store/useCart";
import { cn } from "@/lib/utils";

interface ProductInteractionProps {
  product: Product;
  unit: string;
}

function OptionGroup({ label, hint, options, value, onChange }: {
  label: string;
  hint?: string;
  options: { value: string; note?: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="space-y-2.5">
      <div className="flex items-baseline justify-between">
        <legend className="text-sm font-semibold text-gray-900">{label}</legend>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(({ value: opt, note }) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt)}
              className={cn(
                "inline-flex h-10 items-center gap-1.5 rounded-xl border px-4 text-sm font-medium transition-colors",
                selected
                  ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d] ring-1 ring-[#3f7a55]"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
              )}
            >
              {selected && <Check className="h-3.5 w-3.5" />}
              {opt}
              {note && <span className="font-normal text-gray-500">· {note}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ProductInteraction({ product, unit }: ProductInteractionProps) {
  const weights = product.weight_options ?? [];
  const parts = product.parts ?? [];
  const [weightLabel, setWeightLabel] = useState<string | undefined>(weights[0]?.label);
  const [part, setPart] = useState<string | undefined>(parts[0]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, items } = useCart();

  const weight = weights.find((w) => w.label === weightLabel);
  const unitPrice = weight?.price ?? product.price;
  // Stock is counted in the product's own unit (e.g. kg), and each size uses
  // its own amount of it — one "2kg" takes 2.
  const stockPerItem = weight?.stock_units ?? 1;
  const showSizePrices = hasVaryingPrices(product);

  // Weight and cut travel with the order as one option label, e.g. "2kg · Hind leg".
  const option = [weight?.label, part].filter(Boolean).join(" · ") || undefined;
  const cartId = option ? `${product.id}-${option}` : product.id;
  const inCartThis = items.find((i) => i.cartId === cartId)?.quantity ?? 0;

  const heldInCart = stockInCart(items, product.id);
  const available = product.stock_quantity - heldInCart;
  const outOfStock = product.stock_quantity < Math.min(stockPerItem, ...weights.map((w) => w.stock_units));
  const canAddMore = Math.max(0, Math.floor(available / stockPerItem + 1e-9));
  const qty = Math.min(quantity, Math.max(1, canAddMore));

  const handleAdd = () => {
    if (outOfStock || canAddMore <= 0) return;
    addItem(product, { weight, part }, qty);
    setQuantity(1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {weights.length > 0 && (
        <OptionGroup
          label="Size"
          hint={weights.length > 1 ? "Choose one" : undefined}
          options={weights.map((w) => ({ value: w.label, note: showSizePrices ? `₦${w.price.toLocaleString()}` : undefined }))}
          value={weightLabel}
          onChange={setWeightLabel}
        />
      )}
      {parts.length > 0 && (
        <OptionGroup label="Cut" hint={parts.length > 1 ? "Choose one" : undefined} options={parts.map((p) => ({ value: p }))} value={part} onChange={setPart} />
      )}

      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex h-14 items-center rounded-xl border border-gray-200 bg-white">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={qty <= 1 || outOfStock}
              onClick={() => setQuantity(Math.max(1, qty - 1))}
              className="flex h-full w-11 items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-base font-semibold tabular-nums" aria-live="polite">
              {outOfStock ? 0 : qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={qty >= canAddMore || outOfStock}
              onClick={() => setQuantity(qty + 1)}
              className="flex h-full w-11 items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock || canAddMore <= 0}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-6 text-base font-semibold text-white shadow-lg shadow-green-500/25 transition-colors hover:bg-[#16a34a] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
          >
            {outOfStock ? (
              "Out of stock"
            ) : canAddMore <= 0 ? (
              heldInCart > 0 ? "All available stock is in your cart" : "Not enough stock for this size"
            ) : justAdded ? (
              <>
                <Check className="h-5 w-5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" />
                Add to cart · ₦{(unitPrice * qty).toLocaleString()}
              </>
            )}
          </button>
        </div>

        {inCartThis > 0 && (
          <p className="text-sm text-gray-600">
            <span className="font-medium text-[#2d583d]">
              {inCartThis} {option ? `× ${option}` : ""} in your cart.
            </span>{" "}
            <Link href="/cart" className="font-semibold text-[#3f7a55] underline-offset-2 hover:underline">
              View cart
            </Link>
          </p>
        )}
        {!outOfStock && qty > 1 && qty >= canAddMore && (
          <p className="text-xs text-gray-500">That&apos;s all we have left right now.</p>
        )}
        {!outOfStock && (
          <p className="text-xs text-gray-500">
            {weight ? `₦${unitPrice.toLocaleString()} for ${weight.label}.` : `Price is per ${unit}.`}
          </p>
        )}
      </div>

      {/* Phones: keep the buy action in reach while reading further down. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-gray-500">{option ?? product.name}</p>
            <p className="text-lg font-bold tabular-nums text-gray-900">
              ₦{(unitPrice * (outOfStock ? 1 : qty)).toLocaleString()}
              {qty > 1 && !outOfStock && <span className="ml-1 text-xs font-normal text-gray-500">for {qty}</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock || canAddMore <= 0}
            className="flex h-12 items-center gap-2 rounded-xl bg-[#22c55e] px-5 text-sm font-semibold text-white hover:bg-[#16a34a] disabled:bg-gray-300"
          >
            {outOfStock ? "Out of stock" : canAddMore <= 0 ? "Max in cart" : justAdded ? (
              <>
                <Check className="h-4 w-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" /> Add to cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
