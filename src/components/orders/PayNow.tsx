"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import type { PayNowProps } from "./PayNowButton";

// Client-only, like the checkout page's payment step: react-paystack needs
// `window` at import time, so it can't be part of server rendering.
export const PayNow = dynamic<PayNowProps>(() => import("./PayNowButton").then((m) => m.PayNowButton), {
  ssr: false,
  loading: () => (
    <Button disabled className="min-w-[170px]">
      Pay now
    </Button>
  ),
});
