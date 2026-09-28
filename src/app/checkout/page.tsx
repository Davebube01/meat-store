"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChefHat, Loader2, Lock } from "lucide-react";
import { useCart } from "@/core/store/useCart";
import { OrderSummary } from "@/components/checkout/OrderSummary";

// react-paystack touches `window` when it loads, so the steps render client-only.
const CheckoutSteps = dynamic(() => import("@/components/checkout/CheckoutSteps").then((m) => m.CheckoutSteps), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-16 text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();

  // The cart is persisted to localStorage and rehydrates asynchronously. On a
  // hard refresh `items` is [] for a moment even when the real cart isn't
  // empty, so wait for hydration before deciding anything. (useCart.persist
  // only exists in the browser, so it's only touched inside an effect.)
  const hasHydrated = useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
  useEffect(() => {
    // This store's automatic hydrate-on-creation doesn't reliably fire in
    // this app's setup, so kick it off explicitly if it hasn't happened.
    if (!useCart.persist.hasHydrated()) useCart.persist.rehydrate();
  }, []);

  // Arriving with an empty cart: nothing to check out. Checked once only.
  // Placing an order empties the cart too, and that must not race the
  // redirect to the order's own page.
  const checked = useRef(false);
  useEffect(() => {
    if (!hasHydrated || checked.current) return;
    checked.current = true;
    if (items.length === 0) router.replace("/cart");
  }, [hasHydrated, items.length, router]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f7]">
      {/* Focused header: no navigation to wander off to mid-checkout. */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3f7a55] text-white">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="leading-none">
              <span className="block text-[11px] font-semibold text-[#22c55e]">Everything</span>
              <span className="font-serif text-lg font-semibold text-[#2d583d]">Fresh</span>
            </span>
          </Link>
          <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
            <Lock className="h-4 w-4 text-[#3f7a55]" /> Secure checkout
          </span>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-6 md:py-10">
        <Link href="/cart" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>
        <h1 className="mb-6 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a]">Checkout</h1>

        {!hasHydrated ? (
          <div className="flex items-center justify-center p-16 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <div className="order-2 lg:order-1">
              <CheckoutSteps />
            </div>
            <div className="order-1 lg:sticky lg:top-6 lg:order-2">
              <OrderSummary />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
