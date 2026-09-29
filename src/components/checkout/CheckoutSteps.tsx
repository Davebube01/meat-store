"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/core/store/useAuthStore";
import { useCheckoutStore } from "@/core/store/useCheckoutStore";
import { useCart } from "@/core/store/useCart";
import { useOrderStore } from "@/core/store/useOrderStore";
import { checkoutOrder } from "@/core/api/user/orders";
import { initializePayment, simulateWebhook } from "@/core/api/user/payments";
import { getDeliveryZones } from "@/core/api/user/delivery";
import { getStoreInfo } from "@/core/api/user/store";
import { getMyAddresses } from "@/core/api/user/account";
import { ContactStep, DeliveryStep, ReviewStep, StepCard, type DeliveryValues, type PaymentChoice } from "./steps";
import { longDate } from "./slots";

const isDev = process.env.NODE_ENV === "development";

interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number;
  reference: string;
}

export function CheckoutSteps() {
  const router = useRouter();
  const {
    step, setStep, setGuest, guestInfo, setGuestInfo, deliveryInfo, setDeliveryInfo,
    deliveryMethod, setDeliveryMethod, paymentMethod, setPaymentMethod,
  } = useCheckoutStore();
  const { user, isAuthenticated } = useAuthStore();
  const subtotal = useCart((s) => s.getCartTotal());

  const zones = useQuery({ queryKey: ["delivery-zones"], queryFn: getDeliveryZones, staleTime: 5 * 60_000 });
  const store = useQuery({ queryKey: ["store-info"], queryFn: getStoreInfo, staleTime: 10 * 60_000 });
  const saved = useQuery({ queryKey: ["my-addresses"], queryFn: getMyAddresses, enabled: isAuthenticated });

  // Only Paystack and cash are real options (an older build also offered
  // Flutterwave, which silently went through Paystack anyway).
  const payment: PaymentChoice = paymentMethod === "cod" ? "cod" : "paystack";
  useEffect(() => {
    if (paymentMethod !== "cod" && paymentMethod !== "paystack") setPaymentMethod("paystack");
  }, [paymentMethod, setPaymentMethod]);

  // ── Paystack ─────────────────────────────────────────────────────────────
  const [placing, setPlacing] = useState(false);
  const [paystackConfig, setPaystackConfig] = useState<PaystackConfig | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const initializePaystack = usePaystackPayment(paystackConfig ?? { publicKey: "", email: "", amount: 0, reference: "" });

  // Open the Paystack window once the order exists and its config is ready.
  useEffect(() => {
    if (!paystackConfig || !pendingOrderId) return;
    initializePaystack({
      onSuccess: async () => {
        // Paystack can't reach localhost, so local dev fakes the webhook here.
        // Everywhere else the real signed webhook confirms the order; the
        // success page polls for that rather than taking it on faith.
        if (isDev) {
          try {
            await simulateWebhook(paystackConfig.reference);
          } catch {
            // Non-fatal: the success page still polls for the real status.
          }
        }
        useCart.getState().clearCart();
        router.push(`/checkout/success?id=${pendingOrderId}&ref=${paystackConfig.reference}`);
      },
      onClose: () => {
        // The order already exists and holds its stock. Sending them back to
        // checkout would create a second one, so take them to the order,
        // where "Pay now" retries payment for this same order.
        toast.info("Payment not finished. Your order is saved; you can pay for it here.");
        useCart.getState().clearCart();
        const email = isAuthenticated && user?.email ? user.email : guestInfo.email;
        router.push(
          isAuthenticated
            ? `/orders/${pendingOrderId}`
            : `/order-tracking?id=${pendingOrderId}&email=${encodeURIComponent(email)}`,
        );
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paystackConfig, pendingOrderId]);

  const placeOrder = useCallback(async () => {
    setPlacing(true);
    try {
      const items = useCart.getState().items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        weight_option: item.weightOption,
        part: item.part,
      }));

      const order = await checkoutOrder({
        is_guest: !isAuthenticated,
        guest_info: guestInfo,
        delivery_info: deliveryMethod === "delivery" ? deliveryInfo : undefined,
        delivery_method: deliveryMethod,
        payment_method: payment,
        items,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useOrderStore.getState().setOrder(order as any);

      if (payment === "cod") {
        useCart.getState().clearCart();
        router.push(`/checkout/success?id=${order.id}`);
        return;
      }

      const email = isAuthenticated && user?.email ? user.email : guestInfo.email;
      const init = await initializePayment({ email, order_id: order.id });
      setPendingOrderId(order.id);
      setPaystackConfig({ publicKey: init.public_key, email, amount: Math.round(order.total_amount * 100), reference: init.reference });
    } catch (err) {
      toast.error(`Couldn't place your order. ${(err as Error).message}`);
      setPlacing(false);
    }
  }, [isAuthenticated, guestInfo, deliveryMethod, deliveryInfo, payment, user, router]);

  // ── Step content ────────────────────────────────────────────────────────
  const state = (n: number) => (step === n ? "active" : step > n ? "done" : "upcoming") as "active" | "done" | "upcoming";
  const zoneName = zones.data?.find((z) => z.id === deliveryInfo.deliveryZone)?.name;

  const deliveryInitial: DeliveryValues = {
    method: deliveryMethod,
    deliveryZone: deliveryInfo.deliveryZone,
    deliveryFee: deliveryInfo.deliveryFee,
    address: deliveryInfo.address,
    apartment: deliveryInfo.apartment,
    landmark: deliveryInfo.landmark,
    instructions: deliveryInfo.instructions,
    deliveryDate: deliveryInfo.deliveryDate,
    timeSlot: deliveryInfo.timeSlot,
  };

  return (
    <div className="space-y-4">
      <StepCard
        n={1}
        title="Contact"
        state={state(1)}
        onEdit={() => setStep(1)}
        summary={`${guestInfo.fullName} · ${guestInfo.phone}${isAuthenticated ? "" : ` · ${guestInfo.email}`}`}
      >
        <ContactStep
          initial={{
            fullName: guestInfo.fullName || user?.full_name || "",
            email: guestInfo.email || user?.email || "",
            phone: guestInfo.phone || user?.phone || "",
          }}
          signedInEmail={isAuthenticated ? user?.email : undefined}
          onSubmit={(v) => {
            setGuestInfo(v);
            if (!isAuthenticated) setGuest(true);
            setStep(2);
          }}
        />
      </StepCard>

      <StepCard
        n={2}
        title="Delivery"
        state={state(2)}
        onEdit={() => setStep(2)}
        summary={
          deliveryMethod === "pickup"
            ? "Pickup from the shop"
            : `${zoneName ?? "Delivery"} · ${longDate(deliveryInfo.deliveryDate)}, ${deliveryInfo.timeSlot}`
        }
      >
        <DeliveryStep
          initial={deliveryInitial}
          zones={zones.data}
          zonesError={zones.isError}
          store={store.data}
          saved={saved.data}
          onBack={() => setStep(1)}
          onSubmit={(v) => {
            setDeliveryMethod(v.method);
            if (v.method === "delivery") {
              setDeliveryInfo({
                deliveryDate: v.deliveryDate,
                address: v.address.trim(),
                apartment: v.apartment.trim(),
                landmark: v.landmark.trim(),
                instructions: v.instructions.trim(),
                deliveryZone: v.deliveryZone,
                deliveryFee: v.deliveryFee,
                timeSlot: v.timeSlot,
                // We only deliver in Abuja; the API still expects these.
                city: "Abuja",
                state: "FCT",
              });
            }
            setStep(3);
          }}
        />
      </StepCard>

      <StepCard n={3} title="Review & pay" state={state(3)}>
        <ReviewStep
          pickup={deliveryMethod === "pickup"}
          total={subtotal}
          payment={payment}
          onPayment={setPaymentMethod}
          placing={placing}
          onBack={() => setStep(2)}
          onPlace={placeOrder}
        />
      </StepCard>
    </div>
  );
}
