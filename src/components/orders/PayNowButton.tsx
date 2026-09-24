"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderPayment } from "@/core/hooks/useOrderPayment";

export interface PayNowProps {
  order: { id: string; total_amount: number };
  email: string;
  className?: string;
  // Lets the page disable other actions (e.g. Cancel) while the popup is open.
  onBusyChange?: (busy: boolean) => void;
}

// Don't import this directly from a page: react-paystack touches `window`
// when its module loads, which crashes server rendering. Use <PayNow> from
// ./PayNow, which loads this client-side only.
export function PayNowButton({ order, email, className, onBusyChange }: PayNowProps) {
  const { pay, busy } = useOrderPayment();

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  return (
    <Button className={className} onClick={() => pay(order, email)} disabled={busy}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay ₦${order.total_amount.toLocaleString()} now`}
    </Button>
  );
}
