"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, Loader2, Lock, ShoppingBag, Store, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartLine } from "@/components/cart/CartLine";
import { useCartCheck } from "@/components/cart/useCartCheck";
import { useCart } from "@/core/store/useCart";

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export default function CartPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  // The cart lives in localStorage; render nothing cart-shaped until it's loaded.
  const hydrated = useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
  const { results, blocked, notices, checking, failed } = useCartCheck(hydrated);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const blockedTotal = blocked.reduce((n, b) => {
    const item = items.find((i) => i.cartId === b.key);
    return n + (item ? item.price * item.quantity : 0);
  }, 0);
  const subtotal = getCartTotal() - blockedTotal;
  const canCheckout = items.length > 0 && blocked.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 bg-[#FFF8F1]">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">Your cart</h1>
              {hydrated && items.length > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  {count} item{count === 1 ? "" : "s"}
                  {checking && (
                    <span className="ml-2 inline-flex items-center gap-1 text-gray-400">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking prices and stock
                    </span>
                  )}
                </p>
              )}
            </div>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3f7a55] hover:underline">
              <ArrowLeft className="h-4 w-4" /> Continue shopping
            </Link>
          </div>

          {!hydrated ? (
            <div className="flex justify-center p-20 text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-[#f0e6da] bg-white px-6 py-14 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f7f5] text-[#3f7a55]">
                <ShoppingBag className="h-8 w-8" />
              </span>
              <h2 className="mt-5 font-serif text-2xl font-semibold text-gray-900">Your cart is empty</h2>
              <p className="mt-2 text-gray-500">Fresh cuts are waiting. Add something and it&apos;ll show up here.</p>
              <Link
                href="/products"
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-[#22c55e] px-6 font-semibold text-white shadow-lg shadow-green-500/25 hover:bg-[#16a34a]"
              >
                Browse products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
              <section className="rounded-2xl border border-gray-200 bg-white px-4 sm:px-6">
                {blocked.length > 0 && (
                  <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                    {blocked.length === 1 ? "One item" : `${blocked.length} items`} in your cart can&apos;t be bought right now. Remove{" "}
                    {blocked.length === 1 ? "it" : "them"} to check out.
                  </p>
                )}
                <ul className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <CartLine key={item.cartId} item={item} check={results.get(item.cartId)} notice={notices[item.cartId]} />
                  ))}
                </ul>
                <div className="flex justify-end border-t border-gray-100 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Remove everything from your cart?")) clearCart();
                    }}
                    className="text-sm font-medium text-gray-500 hover:text-red-600"
                  >
                    Clear cart
                  </button>
                </div>
              </section>

              <aside className="rounded-2xl border border-gray-200 bg-white lg:sticky lg:top-24">
                <h2 className="border-b border-gray-100 px-5 py-4 font-semibold text-gray-900">Summary</h2>
                <div className="space-y-2.5 px-5 py-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items</span>
                    <span className="tabular-nums text-gray-900">{naira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Delivery</span>
                    <span className="text-right text-gray-500">Chosen at checkout</span>
                  </div>
                </div>
                <div className="flex items-baseline justify-between border-t border-gray-100 px-5 py-4">
                  <span className="font-semibold text-gray-900">Subtotal</span>
                  <span className="text-2xl font-bold tabular-nums text-gray-900">{naira(subtotal)}</span>
                </div>
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    disabled={!canCheckout}
                    onClick={() => router.push("/checkout")}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] font-semibold text-white shadow-lg shadow-green-500/25 transition-colors hover:bg-[#16a34a] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                  >
                    <Lock className="h-4 w-4" /> Checkout
                  </button>
                  {!canCheckout && blocked.length > 0 && (
                    <p className="mt-2 text-center text-xs text-red-600">Remove unavailable items first.</p>
                  )}
                  {failed && (
                    <p className="mt-2 text-center text-xs text-gray-500">Couldn&apos;t re-check stock just now. Checkout will confirm it.</p>
                  )}
                </div>
                <ul className="space-y-2.5 border-t border-gray-100 px-5 py-4 text-xs text-gray-600">
                  <li className="flex gap-2">
                    <Truck className="h-4 w-4 shrink-0 text-[#3f7a55]" />
                    Delivery across Abuja in a 1-hour slot you choose. The fee is paid in cash to the courier.
                  </li>
                  <li className="flex gap-2">
                    <Store className="h-4 w-4 shrink-0 text-[#3f7a55]" /> Or collect it from our shop for free.
                  </li>
                </ul>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
