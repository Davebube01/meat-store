"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Truck, CreditCard, User as UserIcon } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useOrderStore } from "@/store/useOrderStore";
import { cn } from "@/lib/utils";

export function CheckoutSteps() {
  const router = useRouter();
  const {
    step,
    setStep,
    isGuest,
    guestInfo,
    setGuestInfo,
    deliveryInfo,
    setDeliveryInfo,
    paymentMethod,
    setPaymentMethod,
  } = useCheckoutStore();
  const { user, isAuthenticated } = useAuthStore();

  // Step 1 State
  const [email, setEmail] = useState(guestInfo?.email || "");
  const [phone, setPhone] = useState(guestInfo?.phone || "");

  // Step 2 State
  const [address, setAddress] = useState(deliveryInfo?.address || "");
  const [city, setCity] = useState(deliveryInfo?.city || "");
  const [state, setState] = useState(deliveryInfo?.state || "");

  // Pre-fill for auth user
  useEffect(() => {
    if (isAuthenticated && user) {
      // Mock pre-fill
      if (!email) setEmail(user.email || "");
    }
  }, [isAuthenticated, user]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGuestInfo({ email, phone });
    setStep(2);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliveryInfo({ address, city, state });
    setStep(3);
  };

  return (
    <div className="space-y-6">
      {/* Steps Indicator */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10" />
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "flex flex-col items-center bg-white px-2",
              s <= step ? "text-amber-900" : "text-gray-400",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold mb-1 transition-colors",
                s < step
                  ? "bg-amber-900 border-amber-900 text-white"
                  : s === step
                    ? "border-amber-900 text-amber-900 bg-white"
                    : "border-gray-200 text-gray-400 bg-white",
              )}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            <span className="text-xs font-medium">
              {s === 1 ? "Contact" : s === 2 ? "Delivery" : "Payment"}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Contact Info */}
      <Card
        className={cn("transition-all", step !== 1 && "opacity-50 grayscale")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-amber-900" />
            Contact Information
          </CardTitle>
        </CardHeader>
        {step === 1 && (
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-amber-900 hover:bg-amber-800 text-white"
              >
                Continue to Delivery
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Step 2: Delivery Details */}
      <Card
        className={cn("transition-all", step !== 2 && "opacity-50 grayscale")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-900" />
            Delivery Details
          </CardTitle>
        </CardHeader>
        {step === 2 && (
          <CardContent>
            <form onSubmit={handleDeliverySubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Meat Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Lagos"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="Lagos"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-amber-900 hover:bg-amber-800 text-white"
                >
                  Continue to Payment
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Step 3: Payment */}
      <Card
        className={cn("transition-all", step !== 3 && "opacity-50 grayscale")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-900" />
            Payment
          </CardTitle>
        </CardHeader>
        {step === 3 && (
          <CardContent>
            <div className="space-y-4">
              <RadioGroup
                defaultValue="paystack"
                onValueChange={(v) => setPaymentMethod(v as any)}
              >
                <div
                  className={cn(
                    "flex items-center space-x-2 border p-4 rounded-md transition-colors",
                    paymentMethod === "paystack" &&
                      "border-amber-900 bg-amber-50",
                  )}
                >
                  <RadioGroupItem
                    value="paystack"
                    id="paystack"
                    className="data-[state=checked]:border-amber-900 data-[state=checked]:text-amber-900"
                  />
                  <Label htmlFor="paystack">Paystack</Label>
                </div>
                <div
                  className={cn(
                    "flex items-center space-x-2 border p-4 rounded-md transition-colors",
                    paymentMethod === "flutterwave" &&
                      "border-amber-900 bg-amber-50",
                  )}
                >
                  <RadioGroupItem
                    value="flutterwave"
                    id="flutterwave"
                    className="data-[state=checked]:border-amber-900 data-[state=checked]:text-amber-900"
                  />
                  <Label htmlFor="flutterwave">Flutterwave</Label>
                </div>
                <div
                  className={cn(
                    "flex items-center space-x-2 border p-4 rounded-md transition-colors",
                    paymentMethod === "cod" && "border-amber-900 bg-amber-50",
                  )}
                >
                  <RadioGroupItem
                    value="cod"
                    id="cod"
                    className="data-[state=checked]:border-amber-900 data-[state=checked]:text-amber-900"
                  />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const isSuccess = Math.random() > 0.5; // 50% chance

                    const btn = document.activeElement as HTMLButtonElement;
                    if (btn) {
                      btn.innerText = "Processing...";
                      btn.disabled = true;

                      setTimeout(() => {
                        if (isSuccess) {
                          // Create and save order
                          const newOrder = {
                            id:
                              "#ORD-" +
                              Math.floor(10000 + Math.random() * 90000),
                            items: useCart.getState().items, // Direct access to latest state
                            total: useCart.getState().getCartTotal(),
                            email:
                              guestInfo?.email ||
                              user?.email ||
                              "customer@example.com",
                            date: new Date().toLocaleString(),
                            status: "placed" as const,
                          };
                          useOrderStore.getState().setOrder(newOrder); // Save to store
                          useCart.getState().clearCart(); // Clear cart

                          router.push("/checkout/success");
                        } else {
                          router.push(
                            "/checkout/failed?reason=declined_by_bank",
                          );
                        }
                      }, 2000);
                    }
                  }}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
