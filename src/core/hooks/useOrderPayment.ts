"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePaystackPayment } from "react-paystack";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { initializePayment, simulateWebhook } from "@/core/api/user/payments";

interface PayableOrder {
  id: string;
  total_amount: number;
}

interface PaymentConfig {
  publicKey: string;
  email: string;
  amount: number; // kobo
  reference: string;
  orderId: string;
}

const EMPTY_CONFIG = { publicKey: "", email: "", amount: 0, reference: "" };

/**
 * Pay for an order that's still awaiting payment (a retry after a closed
 * popup, a declined card, or coming back later). Each call asks the server
 * for a fresh payment reference, so it's safe to use repeatedly.
 */
export function useOrderPayment() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [busy, setBusy] = useState(false);
  // Paystack calls onClose as the popup goes away after a successful payment
  // too; without this we'd tell someone who just paid that they cancelled.
  const paid = useRef(false);

  const initializePaystack = usePaystackPayment(config ?? EMPTY_CONFIG);

  useEffect(() => {
    if (!config) return;
    paid.current = false;

    initializePaystack({
      onSuccess: async () => {
        paid.current = true;
        // Paystack can't reach localhost, so local dev fakes the webhook here.
        // Everywhere else the real signed webhook confirms the order, and the
        // success page polls for it rather than taking the popup's word.
        if (process.env.NODE_ENV === "development") {
          try {
            await simulateWebhook(config.reference);
          } catch {
            // Non-fatal: the success page still shows the true status.
          }
        }
        router.push(`/checkout/success?id=${config.orderId}&ref=${config.reference}`);
      },
      onClose: () => {
        if (paid.current) return;
        toast.info("Payment window closed. Your order is still waiting: you can pay any time before the deadline.");
        setBusy(false);
        setConfig(null);
        queryClient.invalidateQueries({ queryKey: ["order", config.orderId] });
      },
    });
    // The popup should open once per config, not whenever the hook's own
    // identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const pay = useCallback(
    async (order: PayableOrder, email: string) => {
      if (busy) return;
      setBusy(true);
      try {
        const init = await initializePayment({ email, order_id: order.id });
        setConfig({
          publicKey: init.public_key,
          email,
          amount: Math.round(order.total_amount * 100),
          reference: init.reference,
          orderId: order.id,
        });
      } catch (err: any) {
        toast.error(err?.message || "We couldn't start the payment. Please try again.");
        setBusy(false);
        // The order may have been cancelled or expired meanwhile; show its real state.
        queryClient.invalidateQueries({ queryKey: ["order", order.id] });
      }
    },
    [busy, queryClient]
  );

  return { pay, busy };
}
