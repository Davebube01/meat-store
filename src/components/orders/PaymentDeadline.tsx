"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

function formatRemaining(ms: number): string {
  const minutes = Math.ceil(ms / 60_000);
  if (minutes <= 1) return "less than a minute";
  if (minutes < 60) return `${minutes} minutes`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

interface PaymentDeadlineProps {
  expiresAt: string;
  // Called once when the deadline passes, so the page can re-check the order
  // (the server cancels it shortly after).
  onExpired: () => void;
}

export function PaymentDeadline({ expiresAt, onExpired }: PaymentDeadlineProps) {
  const target = new Date(expiresAt).getTime();
  const [now, setNow] = useState(() => Date.now());
  const notified = useRef(false);

  useEffect(() => {
    notified.current = false;
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const remaining = target - now;
  const expired = remaining <= 0;

  useEffect(() => {
    if (expired && !notified.current) {
      notified.current = true;
      onExpired();
    }
  }, [expired, onExpired]);

  return (
    <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 flex items-start gap-3 text-sm text-orange-900">
      <Clock className="h-4 w-4 mt-0.5 shrink-0" />
      {expired ? (
        <p>The time to pay for this order has run out. We're updating it now.</p>
      ) : (
        <p>
          This order is waiting for payment. Pay within <strong>{formatRemaining(remaining)}</strong>, or it will be
          cancelled automatically so the items go back on sale.
        </p>
      )}
    </div>
  );
}
