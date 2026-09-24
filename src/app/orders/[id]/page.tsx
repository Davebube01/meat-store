"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  AlertCircle,
  ArrowLeft,
  Bike,
  CheckCircle2,
  Copy,
  Info,
  KeyRound,
  Loader2,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Store,
  Truck,
  XCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SignInModal } from "@/components/SignInModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CancelOrderDialog } from "@/components/orders/CancelOrderDialog";
import { cn } from "@/lib/utils";
import { getThumbnailUrl } from "@/lib/imageUrl";
import {
  CUSTOMER_CANCEL_REASONS,
  describeCancelledBy,
  getStatusInfo,
  isFinished,
  isUnpaid,
  shortOrderId,
} from "@/lib/orderStatus";
import { cancelUserOrder, getUserOrderById, UserOrder } from "@/core/api/user/orders";
import { useAuthStore } from "@/core/store/useAuthStore";

const LIVE_REFRESH_MS = 20_000;

function buildTimeline(order: UserOrder) {
  const pickup = order.delivery_method === "pickup";
  const steps = [
    { title: "Order placed", description: "We've received your order.", icon: ShoppingBag },
    { title: "Being prepared", description: "Our team is getting your order ready.", icon: Package },
    {
      title: pickup ? "Ready for pickup" : "Out for delivery",
      description: pickup ? "Your order is ready to collect at our store." : "A rider is bringing it to you.",
      icon: pickup ? Store : Truck,
    },
    {
      title: pickup ? "Picked up" : "Delivered",
      description: pickup ? "You've collected your order." : "Your order has arrived.",
      icon: CheckCircle2,
    },
  ];

  const current =
    order.status === "delivered" ? 3 : order.status === "in_transit" ? 2 : order.status === "processing" ? 1 : 0;

  return steps.map((step, index) => ({
    ...step,
    state: order.status === "delivered" || index < current ? "done" : index === current ? "current" : "upcoming",
  }));
}

function OrderDetailContent({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: order, error, isLoading, refetch } = useQuery<UserOrder, any>({
    queryKey: ["order", id],
    queryFn: () => getUserOrderById(id),
    // Keep an in-progress order fresh; stop once it can't change any more.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && !isFinished(status) ? LIVE_REFRESH_MS : false;
    },
    retry: (count, err) => err?.status !== 404 && count < 2,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error?.status === 404 || (!order && error)) {
    const notFound = error?.status === 404;
    return (
      <div className="text-center py-20 space-y-3">
        <AlertCircle className="h-10 w-10 text-gray-300 mx-auto" />
        <h1 className="text-xl font-bold text-gray-900">{notFound ? "Order not found" : "We couldn't load this order"}</h1>
        <p className="text-gray-500">
          {notFound ? "It may belong to a different account." : "Please check your connection and try again."}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          {!notFound && (
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          )}
          <Button asChild className="bg-green-700 hover:bg-green-800">
            <Link href="/orders">Back to my orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const status = getStatusInfo(order);
  const pickup = order.delivery_method === "pickup";
  const cancelled = order.status === "cancelled";
  const canCancel = isUnpaid(order.status);
  const cod = order.payment_method === "cod";
  const courier = order.delivery?.courier_name ? order.delivery : null;
  const showPin = !!order.delivery?.delivery_pin && !isFinished(order.status);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      toast.success("Order ID copied.");
    } catch {
      toast.error("Couldn't copy the order ID.");
    }
  };

  return (
    <>
      <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> My orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900">Order {shortOrderId(order.id)}</h1>
            <Badge className={cn("shadow-none border", status.className)}>{status.label}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-x-2">
            Placed {new Date(order.created_at).toLocaleString()}
            <button type="button" onClick={copyId} className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-700" title={order.id}>
              <Copy className="h-3.5 w-3.5" /> Copy ID
            </button>
          </p>
        </div>

        {canCancel && (
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setCancelOpen(true)}>
            Cancel order
          </Button>
        )}
      </div>

      {cancelled && (
        <div role="status" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-900">
                {describeCancelledBy(order.cancelled_by)}
                {order.cancelled_at && (
                  <span className="font-normal text-red-700"> · {new Date(order.cancelled_at).toLocaleString()}</span>
                )}
              </p>
              <p className="text-red-800 mt-1">Reason: {order.cancellation_reason || "Reason not recorded"}</p>
              {order.paid_at && (
                <p className="text-red-900 font-medium mt-3">
                  We received a payment for this order after it was cancelled. Our team will refund it — please contact us if you don't hear from us.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!cancelled && isUnpaid(order.status) && !cod && (
        <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 flex items-start gap-3 text-sm text-orange-900">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          This order is waiting for payment. If payment isn't completed in time, it's cancelled automatically so the items go back on sale.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {!cancelled && (
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-lg mb-5">Progress</h2>
              <ol className="space-y-6">
                {buildTimeline(order).map((step, index, all) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.title} className="relative flex gap-4">
                      {index < all.length - 1 && (
                        <span
                          aria-hidden
                          className={cn("absolute left-[15px] top-9 h-[calc(100%+0.5rem)] w-0.5", step.state === "done" ? "bg-green-600" : "bg-gray-200")}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                          step.state === "done" && "border-green-600 text-green-600",
                          step.state === "current" && "border-green-600 text-green-600 ring-4 ring-green-100",
                          step.state === "upcoming" && "border-gray-200 text-gray-300"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className={cn("pt-0.5", step.state === "upcoming" && "opacity-50")}>
                        <p className="font-semibold text-gray-900">{step.title}</p>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">
              Items <span className="text-sm font-normal text-gray-500 ml-1">{order.items.reduce((n, i) => n + i.quantity, 0)} total</span>
            </h2>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <li key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image src={getThumbnailUrl(item.product?.image_url, 200)} alt={item.product?.name || "Product"} fill unoptimized className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{item.product?.name ?? "Item no longer available"}</p>
                    <p className="text-sm text-gray-500">
                      {item.selected_option && <span className="mr-2">{item.selected_option}</span>}Qty {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₦{(item.price_at_time * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">₦{item.price_at_time.toLocaleString()} each</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          {courier && !cancelled && (
            <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Bike className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Your delivery contact</p>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {courier.courier_name}
                    {courier.courier_service && (
                      <span className="ml-2 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase">{courier.courier_service}</span>
                    )}
                  </p>
                  {courier.courier_phone && (
                    <a href={`tel:${courier.courier_phone}`} className="mt-1 inline-flex items-center gap-1.5 text-sm text-blue-700 font-medium hover:underline">
                      <Phone className="h-3.5 w-3.5" /> {courier.courier_phone}
                    </a>
                  )}
                </div>
              </div>
              {showPin && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                  <KeyRound className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600">Your delivery PIN</p>
                    <p className="text-2xl font-bold tracking-widest text-amber-700">{order.delivery!.delivery_pin}</p>
                    <p className="text-xs text-gray-500 mt-1">Give this code to the courier when your order arrives — it's how we confirm you received it.</p>
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">{pickup ? "Pickup" : "Delivery"}</h2>
            <div className="flex items-start gap-3 text-sm">
              {pickup ? <Store className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" /> : <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />}
              <div className="text-gray-700">
                {pickup ? (
                  "You'll collect this order from our store."
                ) : order.delivery ? (
                  <>
                    <p>
                      {order.delivery.address}
                      {order.delivery.apartment && `, ${order.delivery.apartment}`}
                    </p>
                    <p className="text-gray-500">
                      {[order.delivery.city, order.delivery.state].filter(Boolean).join(", ")}
                    </p>
                    {order.delivery.landmark && <p className="text-gray-500">Landmark: {order.delivery.landmark}</p>}
                    {order.delivery.instructions && <p className="text-gray-500 mt-1">“{order.delivery.instructions}”</p>}
                  </>
                ) : (
                  "Delivery details unavailable."
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Payment</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="text-gray-900">₦{order.subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                <dt>Total</dt>
                <dd className="text-green-700">₦{order.total_amount.toLocaleString()}</dd>
              </div>
              {!pickup && order.delivery_fee > 0 && (
                <p className="text-xs text-gray-500 pt-1">
                  Delivery fee (estimate) ₦{order.delivery_fee.toLocaleString()} is paid to the courier in cash — it isn't part of the total above.
                </p>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <dt className="text-gray-500">Method</dt>
                <dd className="text-gray-900">{cod ? "Cash on delivery" : (order.payment_method ?? "Online").replace(/^./, (c) => c.toUpperCase())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd className="text-gray-900">
                  {order.paid_at
                    ? `Paid ${new Date(order.paid_at).toLocaleDateString()}`
                    : cancelled
                      ? "Not paid"
                      : cod
                        ? "Pay on delivery"
                        : isUnpaid(order.status)
                          ? "Awaiting payment"
                          : "Paid"}
                </dd>
              </div>
            </dl>
          </section>

          {!cancelled && !canCancel && order.status !== "delivered" && (
            <p className="text-sm text-gray-500 px-1 flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              {order.status === "in_transit"
                ? "This order is already on its way. If something's wrong, please contact us."
                : "We've started on this order. To cancel it, please contact us."}
            </p>
          )}
        </div>
      </div>

      <CancelOrderDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        reasons={CUSTOMER_CANCEL_REASONS}
        description="Please tell us why. Once cancelled, this can't be undone."
        onConfirm={async (reason) => {
          const updated = await cancelUserOrder(order.id, reason);
          queryClient.setQueryData(["order", id], updated);
          toast.success("Your order has been cancelled.");
        }}
      />
    </>
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMounted, setIsMounted] = useState(false);

  // Avoid flashing the sign-in prompt before the persisted session is read.
  useEffect(() => setIsMounted(true), []);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-10 max-w-5xl">
        {isMounted && !isAuthenticated ? (
          <div className="text-center py-20 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Please sign in</h1>
            <p className="text-gray-500">Sign in to view this order.</p>
            <SignInModal>
              <Button className="bg-green-700 hover:bg-green-700/90">Sign In</Button>
            </SignInModal>
            <p className="text-sm text-gray-500">
              Ordered as a guest?{" "}
              <Link href={`/order-tracking?id=${params.id}`} className="text-green-700 font-semibold hover:underline">
                Track your order
              </Link>
            </p>
          </div>
        ) : isAuthenticated && params.id ? (
          <OrderDetailContent id={params.id} />
        ) : (
          <div className="flex justify-center py-24 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
