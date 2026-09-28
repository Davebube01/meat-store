"use client";

import Image from "next/image";
import Link from "next/link";
import { Info, ShieldCheck } from "lucide-react";
import { useCart } from "@/core/store/useCart";
import { useCheckoutStore } from "@/core/store/useCheckoutStore";
import { getThumbnailUrl } from "@/lib/imageUrl";

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export function OrderSummary() {
  const { items, getCartTotal } = useCart();
  const { deliveryInfo, deliveryMethod, paymentMethod } = useCheckoutStore();
  const subtotal = getCartTotal();
  const pickup = deliveryMethod === "pickup";
  const fee = pickup ? 0 : deliveryInfo?.deliveryFee || 0;
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const cod = paymentMethod === "cod";

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="font-semibold text-gray-900">Order summary</h2>
        <Link href="/cart" className="text-xs font-semibold text-[#3f7a55] hover:underline">
          Edit cart ({count})
        </Link>
      </div>

      <ul className="max-h-[320px] divide-y divide-gray-100 overflow-y-auto px-5">
        {items.map((item) => (
          <li key={item.cartId} className="flex items-center gap-3 py-3">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Image src={getThumbnailUrl(item.image_url, 96)} alt="" fill unoptimized className="object-cover" />
              <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-lg bg-gray-900/80 px-1 text-[10px] font-semibold text-white">
                {item.quantity}
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
              {item.selectedOption && <p className="truncate text-xs text-gray-500">{item.selectedOption}</p>}
            </div>
            <span className="text-sm font-semibold tabular-nums text-gray-900">{naira(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-gray-100 px-5 py-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Items</span>
          <span className="tabular-nums text-gray-900">{naira(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{pickup ? "Pickup" : "Delivery fee"}</span>
          <span className="tabular-nums text-gray-900">
            {pickup ? "Free" : fee ? <>est. {naira(fee)} <span className="text-xs text-gray-400">cash</span></> : <span className="text-gray-400">Choose your area</span>}
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between border-t border-gray-100 px-5 py-4">
        <span className="font-semibold text-gray-900">{cod ? "To pay in cash" : "Total charged now"}</span>
        <span className="text-xl font-bold tabular-nums text-gray-900">{naira(subtotal)}</span>
      </div>

      {!pickup && (
        <p className="mx-5 mb-4 flex gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          The delivery fee isn&apos;t charged online. Pay it to the courier in cash when your order arrives.
        </p>
      )}
      <p className="flex items-center justify-center gap-1.5 border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
        <ShieldCheck className="h-4 w-4 text-[#3f7a55]" /> Secure payment by Paystack
      </p>
    </aside>
  );
}
