"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCart } from "@/store/useCart";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { GuestLoginPrompt } from "@/components/checkout/GuestLoginPrompt";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
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
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutSteps />
          </div>
          <div className="lg:col-span-1">
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
