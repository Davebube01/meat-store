"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ArrowRight, Lock, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/core/store/useCart";
import { CartLine } from "@/components/cart/CartLine";
import { useCartCheck } from "@/components/cart/useCartCheck";

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

/** Drawer body: mounted only while open, so the live check only runs then. */
function CartDrawerBody({ close }: { close: () => void }) {
  const { items, getCartTotal } = useCart();
  const { results, blocked, notices } = useCartCheck();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <>
      <SheetHeader className="border-b border-gray-100 px-5 py-4 text-left">
        <SheetTitle className="font-serif text-xl">Your cart{count ? ` (${count})` : ""}</SheetTitle>
        <SheetDescription className="sr-only">Items in your cart</SheetDescription>
      </SheetHeader>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f7f5] text-[#3f7a55]">
            <ShoppingBag className="h-8 w-8" />
          </span>
          <p className="font-serif text-xl font-semibold text-gray-900">Your cart is empty</p>
          <p className="max-w-[240px] text-sm text-gray-500">Add some fresh cuts and they&apos;ll show up here.</p>
          <Link
            href="/products"
            onClick={close}
            className="mt-2 inline-flex h-11 items-center gap-2 rounded-xl bg-[#22c55e] px-5 text-sm font-semibold text-white hover:bg-[#16a34a]"
          >
            Browse products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
            {items.map((item) => (
              <CartLine key={item.cartId} item={item} check={results.get(item.cartId)} notice={notices[item.cartId]} compact onNavigate={close} />
            ))}
          </ul>
          <div className="space-y-3 border-t border-gray-100 px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-xl font-bold tabular-nums text-gray-900">{naira(getCartTotal())}</span>
            </div>
            <p className="text-xs text-gray-500">Delivery is chosen at checkout and paid in cash to the courier.</p>
            {blocked.length > 0 ? (
              <Link
                href="/cart"
                onClick={close}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Review unavailable items
              </Link>
            ) : (
              <Link
                href="/checkout"
                onClick={close}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] font-semibold text-white shadow-lg shadow-green-500/25 hover:bg-[#16a34a]"
              >
                <Lock className="h-4 w-4" /> Checkout
              </Link>
            )}
            <Link href="/cart" onClick={close} className="block text-center text-sm font-semibold text-[#3f7a55] hover:underline">
              View full cart
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export function CartSheet() {
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  // The badge comes from localStorage, so only show it once that's loaded.
  const hydrated = useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={hydrated && count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
          className="relative text-gray-700 hover:bg-[#f4f7f5] hover:text-[#2d583d]"
        >
          <ShoppingCart className="h-6 w-6" />
          {hydrated && count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#22c55e] px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        {open && <CartDrawerBody close={() => setOpen(false)} />}
      </SheetContent>
    </Sheet>
  );
}
