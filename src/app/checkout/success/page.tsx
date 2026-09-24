"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, Loader2, Package, Truck, PartyPopper,
  Clock, XCircle, Copy, ExternalLink, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useOrderStatus, useSimulateWebhook } from "@/core/hooks/usePayment";
import { OrderStatus } from "@/core/api/user/orders";
import { useAuthStore } from "@/core/store/useAuthStore";
import { useCheckoutStore } from "@/core/store/useCheckoutStore";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

// ─── Status Step Config ─────────────────────────────────────────────────────
const STATUS_STEPS: {
  status: OrderStatus | "awaiting_verification";
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}[] = [
  {
    status: "pending",
    label: "Order Placed",
    description: "We received your order",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    status: "processing",
    label: "Payment Confirmed",
    description: "Your payment was verified",
    icon: CheckCircle2,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    status: "in_transit",
    label: "Out for Delivery",
    description: "Your order is on the way",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    status: "delivered",
    label: "Delivered",
    description: "Enjoy your goat meat!",
    icon: PartyPopper,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];

const STATUS_ORDER: OrderStatus[] = ["pending", "awaiting_verification", "processing", "in_transit", "delivered"];

const getStepIndex = (status: OrderStatus): number => {
  // Map awaiting_verification to pending visually
  if (status === "awaiting_verification") return 0;
  const map: Record<string, number> = {
    pending: 0,
    processing: 1,
    in_transit: 2,
    delivered: 3,
  };
  return map[status] ?? 0;
};

// ─── Status Banner Config ───────────────────────────────────────────────────
const getStatusBanner = (status: OrderStatus) => {
  switch (status) {
    case "pending":
    case "awaiting_verification":
      return {
        icon: Loader2,
        spin: true,
        title: "Waiting for payment confirmation…",
        subtitle: "This usually takes a few seconds. Please don't close this page.",
        color: "from-amber-50 to-orange-50 border-amber-200",
        titleColor: "text-amber-800",
        subtitleColor: "text-amber-600",
      };
    case "processing":
      return {
        icon: CheckCircle2,
        spin: false,
        title: "Payment confirmed! Preparing your order.",
        subtitle: "Our team is getting your goat meat ready for delivery.",
        color: "from-blue-50 to-indigo-50 border-blue-200",
        titleColor: "text-blue-800",
        subtitleColor: "text-blue-600",
      };
    case "in_transit":
      return {
        icon: Truck,
        spin: false,
        title: "Your order is on the way!",
        subtitle: "Sit tight — your goat meat will be with you soon.",
        color: "from-purple-50 to-violet-50 border-purple-200",
        titleColor: "text-purple-800",
        subtitleColor: "text-purple-600",
      };
    case "delivered":
      return {
        icon: PartyPopper,
        spin: false,
        title: "Order delivered. Enjoy!",
        subtitle: "Thank you for shopping with us. Bon appétit!",
        color: "from-green-50 to-emerald-50 border-green-200",
        titleColor: "text-green-800",
        subtitleColor: "text-green-600",
      };
    case "cancelled":
      return {
        icon: XCircle,
        spin: false,
        title: "Order was cancelled.",
        subtitle: "If you believe this is a mistake, please contact support.",
        color: "from-red-50 to-rose-50 border-red-200",
        titleColor: "text-red-800",
        subtitleColor: "text-red-600",
      };
    default:
      return {
        icon: Loader2,
        spin: true,
        title: "Loading order status…",
        subtitle: "",
        color: "from-gray-50 to-slate-50 border-gray-200",
        titleColor: "text-gray-700",
        subtitleColor: "text-gray-500",
      };
  }
};

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const { guestInfo } = useCheckoutStore();
  const isSignedIn = useAuthStore((state) => state.isAuthenticated);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const ref = params.get("ref");
    if (!id) { router.push("/"); return; }
    setOrderId(id);
    if (ref) setPaymentRef(ref);
  }, [router]);

  const { data: order, isLoading } = useOrderStatus(orderId);
  const simulateMutation = useSimulateWebhook(orderId);

  // Use payment_reference from DB if we don't have it from URL
  const reference = paymentRef || order?.payment_reference || null;

  const status: OrderStatus = order?.status ?? "pending";
  const banner = getStatusBanner(status);
  const BannerIcon = banner.icon;
  const currentStepIdx = getStepIndex(status);

  const handleCopyRef = () => {
    if (reference) {
      navigator.clipboard.writeText(reference);
      toast.success("Reference copied!");
    }
  };

  const handleSimulate = () => {
    if (!reference) {
      toast.error("No payment reference found. Complete checkout first.");
      return;
    }
    simulateMutation.mutate(reference);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-slate-100/60">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl flex flex-col gap-6">

        {/* ─── Status Banner ─── */}
        <div className={cn(
          "rounded-2xl border bg-gradient-to-br p-6 flex items-start gap-4 shadow-sm",
          banner.color
        )}>
          <div className={cn("rounded-full p-2.5 shrink-0", banner.spin ? "bg-amber-200/70" : "bg-white/70")}>
            <BannerIcon
              className={cn("h-7 w-7", banner.titleColor, banner.spin && "animate-spin")}
            />
          </div>
          <div className="min-w-0">
            <h1 className={cn("text-xl font-bold leading-snug", banner.titleColor)}>
              {banner.title}
            </h1>
            {banner.subtitle && (
              <p className={cn("text-sm mt-1 leading-relaxed", banner.subtitleColor)}>
                {banner.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* ─── Progress Stepper ─── */}
        {status !== "cancelled" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              Order Progress
            </h2>
            <div className="relative">
              {/* Vertical connector */}
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />

              <div className="space-y-6">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.status} className="flex items-center gap-4 relative">
                      <div className={cn(
                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500",
                        isCompleted
                          ? "border-green-500 bg-green-500 text-white shadow-sm"
                          : isCurrent
                          ? `border-current ${step.bgColor} ${step.color} shadow-md scale-110`
                          : "border-gray-200 bg-white text-gray-300"
                      )}>
                        {isCompleted
                          ? <CheckCircle2 className="h-5 w-5" />
                          : <StepIcon className={cn("h-4.5 w-4.5", isCurrent && "animate-pulse")} />
                        }
                      </div>
                      <div className={cn(
                        "flex-1 transition-opacity duration-300",
                        (!isCompleted && !isCurrent) && "opacity-40"
                      )}>
                        <p className={cn(
                          "font-semibold text-sm",
                          isCompleted ? "text-green-700" : isCurrent ? "text-gray-900" : "text-gray-400"
                        )}>
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-green-100 text-green-700">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── Order Info Card ─── */}
        {(isLoading || order) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Order Details</h2>

            {isLoading && !order ? (
              <div className="flex items-center gap-3 text-gray-400 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading order info…</span>
              </div>
            ) : order ? (
              <>
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
                  <span className="text-sm text-gray-500">Order ID</span>
                  <span className="font-mono text-xs font-semibold text-gray-700 truncate max-w-[160px]">{order.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
                  <span className="text-sm text-gray-500">Paid Online</span>
                  <span className="font-bold text-green-700 text-lg">₦{order.total_amount.toLocaleString()}</span>
                </div>
                {order.delivery_method !== "pickup" && order.delivery_fee > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
                    <span className="text-sm text-gray-500">Delivery Fee <span className="text-xs text-gray-400">(est., pay courier)</span></span>
                    <span className="text-sm font-medium text-gray-700">~₦{order.delivery_fee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="capitalize text-sm font-semibold text-gray-700">
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
                {order.paid_at && (
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
                    <span className="text-sm text-gray-500">Paid at</span>
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(order.paid_at).toLocaleString()}
                    </span>
                  </div>
                )}
                {reference && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500">Payment Ref</span>
                    <button
                      onClick={handleCopyRef}
                      className="flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-green-700 transition-colors group"
                    >
                      <span className="truncate max-w-[140px]">{reference}</span>
                      <Copy className="h-3 w-3 shrink-0 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* ─── Dev Simulate Webhook Button ─── */}
        {isDev && (
          <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-200 rounded-lg p-1.5 shrink-0">
                <Zap className="h-4 w-4 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Dev Tool</p>
                <p className="text-xs text-amber-700 mt-0.5 mb-3">
                  Paystack cannot reach localhost. Click below to simulate a successful payment webhook and advance the order to <strong>Processing</strong>.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-400 text-amber-800 hover:bg-amber-100 text-xs h-8"
                  disabled={!reference || simulateMutation.isPending}
                  onClick={handleSimulate}
                >
                  {simulateMutation.isPending ? (
                    <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Simulating…</>
                  ) : (
                    <><Zap className="h-3 w-3 mr-1" /> Simulate Webhook</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Action Buttons ─── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 bg-green-700 hover:bg-green-800 shadow-sm" asChild>
            <Link href={isSignedIn ? `/orders/${orderId}` : `/order-tracking?id=${orderId}${guestInfo?.email ? `&email=${encodeURIComponent(guestInfo.email)}` : ''}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Track Order
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 border-gray-200" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>

      </main>
      <Footer />
    </div>
  );
}
