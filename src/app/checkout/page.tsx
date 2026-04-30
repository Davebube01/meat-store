"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/core/store/useAuthStore";
import { useCart } from "@/core/store/useCart";
import { useCheckoutStore } from "@/core/store/useCheckoutStore";
import { GuestLoginPrompt } from "@/components/checkout/GuestLoginPrompt";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import dynamic from "next/dynamic";
const CheckoutSteps = dynamic(() => import("@/components/checkout/CheckoutSteps").then(mod => mod.CheckoutSteps), { ssr: false });
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { items } = useCart();
  const { isGuest, step } = useCheckoutStore();
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  useEffect(() => {
    // If cart is empty, redirect to home
    if (items.length === 0) {
      router.push("/");
      return;
    }

    // If not authenticated and not explicitly a guest, show prompt
    if (!isAuthenticated && !isGuest) {
      setShowGuestPrompt(true);
    } else {
      setShowGuestPrompt(false);
    }
  }, [isAuthenticated, isGuest, items.length, router]);

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 lg:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 md:mb-8">Checkout</h1>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:items-start">
          <div className="lg:col-span-2">
            <CheckoutSteps />
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-24 w-full">
            <OrderSummary />
          </div>
        </div>
      </main>
      <Footer />
      <GuestLoginPrompt
        open={showGuestPrompt}
        onOpenChange={setShowGuestPrompt}
      />
    </div>
  );
}
