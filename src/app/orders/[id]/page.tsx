"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  AlertCircle, ArrowLeft, Clock, Copy, Info, Loader2, Mail, MapPin, Phone, RefreshCw, RotateCcw, Store, XCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CancelOrderDialog } from "@/components/orders/CancelOrderDialog";
import { PaymentDeadline } from "@/components/orders/PaymentDeadline";
import { PayNow } from "@/components/orders/PayNow";
import { OrderProgress, PinAndCourier } from "@/components/orders/OrderStatusParts";
import { longDay, orderHeadline } from "@/components/orders/orderStatusText";
import { buyAgain } from "@/components/orders/buyAgain";
import { cn } from "@/lib/utils";
import { getThumbnailUrl } from "@/lib/imageUrl";
import { CUSTOMER_CANCEL_REASONS, describeCancelledBy, getStatusInfo, isFinished, isUnpaid, shortOrderId } from "@/lib/orderStatus";
import { cancelUserOrder, getUserOrderById, type UserOrder } from "@/core/api/user/orders";
import { getDeliveryZones } from "@/core/api/user/delivery";
import { getStoreInfo } from "@/core/api/user/store";
import { useAuthStore } from "@/core/store/useAuthStore";

const LIVE_REFRESH_MS = 20_000;
const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });

function OrderDetail({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const email = useAuthStore((s) => s.user?.email ?? "");

  const { data: o, error, isPending, isFetching, refetch } = useQuery<UserOrder, { status?: number; message?: string }>({
    queryKey: ["order", id],
    queryFn: () => getUserOrderById(id),
    // Keep an in-progress order fresh; stop once it can't change any more.
    refetchInterval: (q) => (q.state.data && !isFinished(q.state.data.status) ? LIVE_REFRESH_MS : false),
    retry: (count, err) => err?.status !== 404 && count < 2,
    staleTime: 0,
  });
  const zones = useQuery({ queryKey: ["delivery-zones"], queryFn: getDeliveryZones, staleTime: 5 * 60_000 });
  const store = useQuery({ queryKey: ["store-info"], queryFn: getStoreInfo, staleTime: 10 * 60_000 });

  if (isPending) {
    return (
      <div className="flex justify-center py-24 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !o) {
    const notFound = error?.status === 404;
    return (
      <div className="space-y-3 py-20 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-gray-300" />
        <h1 className="font-serif text-2xl font-semibold text-gray-900">{notFound ? "Order not found" : "We couldn't load this order"}</h1>
        <p className="text-gray-500">{notFound ? "It may belong to a different account." : "Check your connection and try again."}</p>
        <div className="flex justify-center gap-3 pt-2">
          {!notFound && (
            <button type="button" onClick={() => refetch()} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">Try again</button>
          )}
          <Link href="/orders" className="rounded-xl bg-[#3f7a55] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d583d]">Back to my orders</Link>
        </div>
      </div>
    );
  }

  const status = getStatusInfo(o);
  const { title, sub } = orderHeadline(o);
  const pickup = o.delivery_method === "pickup";
  const cancelled = o.status === "cancelled";
  const cod = o.payment_method === "cod";
  const canCancel = isUnpaid(o.status);
  const canPay = canCancel && !cod;
  const d = o.delivery;
  const zoneName = zones.data?.find((z) => z.id === d?.delivery_zone)?.name ?? d?.delivery_zone;
  const count = o.items.reduce((n, i) => n + i.quantity, 0);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(shortOrderId(o.id));
      toast.success("Order number copied.");
    } catch {
      toast.error("Couldn't copy the order number.");
    }
  };

  return (
    <>
      <Link href="/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> My orders
      </Link>

      <div className="space-y-5">
        {/* Status */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className={cn("px-5 py-6 md:px-7", cancelled ? "bg-red-50" : o.status === "delivered" ? "bg-[#F0FFDF]" : "bg-[#f4f7f5]")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
                  <span className="font-mono">Order {shortOrderId(o.id)}</span>
                  <button type="button" onClick={copyNumber} className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-700" aria-label="Copy order number">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <span aria-hidden>·</span> placed {when(o.created_at)}
                  <span className={cn("ml-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold", status.className)}>{status.label}</span>
                </p>
                <h1 className={cn("mt-1 font-serif text-2xl font-semibold md:text-3xl", cancelled ? "text-red-800" : "text-[#1a1a1a]")}>{title}</h1>
                {sub && <p className="mt-1 text-gray-600">{sub}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {!isFinished(o.status) && (
                  <button type="button" onClick={() => refetch()} disabled={isFetching} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900">
                    <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} /> Refresh
                  </button>
                )}
                {o.status === "delivered" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (buyAgain(o)) router.push("/cart");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#3f7a55] px-3 py-2 text-sm font-semibold text-white hover:bg-[#2d583d]"
                  >
                    <RotateCcw className="h-4 w-4" /> Buy again
                  </button>
                )}
              </div>
            </div>
          </div>

          {cancelled ? (
            <div className="flex items-start gap-3 px-5 py-4 text-sm md:px-7">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <div>
                <p className="font-medium text-gray-900">
                  {describeCancelledBy(o.cancelled_by)}
                  {o.cancelled_at && <span className="font-normal text-gray-500"> · {when(o.cancelled_at)}</span>}
                </p>
                {o.paid_at && (
                  <p className="mt-1 text-gray-600">We received a payment for this order. We&apos;ll refund it to your original payment method; contact us if you don&apos;t hear from us.</p>
                )}
              </div>
            </div>
          ) : (
            <OrderProgress order={o} />
          )}

          {canCancel && (
            <div className="space-y-3 border-t border-gray-100 px-5 py-4 md:px-7">
              {canPay && o.payment_expires_at && <PaymentDeadline expiresAt={o.payment_expires_at} onExpired={() => refetch()} />}
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setCancelOpen(true)}
                  disabled={paying}
                  className="h-10 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Cancel order
                </button>
                {canPay && <PayNow order={o} email={email} onBusyChange={setPaying} className="min-w-[170px] bg-[#22c55e] text-white hover:bg-[#16a34a]" />}
              </div>
            </div>
          )}
        </section>

        <PinAndCourier order={o} />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Items */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
            <h2 className="font-semibold text-gray-900">{count} item{count === 1 ? "" : "s"}</h2>
            <ul className="mt-2 divide-y divide-gray-100">
              {o.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3">
                  <Link href={item.product?.slug ? `/products/${item.product.slug}` : "#"} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image src={getThumbnailUrl(item.product?.image_url, 112)} alt={item.product?.name ?? ""} fill unoptimized className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">{item.product?.name ?? "Item no longer sold"}</p>
                    <p className="text-xs text-gray-500">
                      {item.selected_option ? `${item.selected_option} · ` : ""}
                      {naira(item.price_at_time)} each · ×{item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums text-gray-900">{naira(item.price_at_time * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-2 space-y-1.5 border-t border-gray-100 pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Items</dt><dd className="tabular-nums">{naira(o.subtotal)}</dd></div>
              {!pickup && (
                <div className="flex justify-between"><dt className="text-gray-500">Delivery (cash to courier)</dt><dd className="tabular-nums">est. {naira(o.delivery_fee)}</dd></div>
              )}
              <div className="flex justify-between pt-1.5 text-base font-semibold">
                <dt>{cod ? "To pay in cash" : o.paid_at ? "Paid online" : cancelled ? "Total" : "To pay online"}</dt>
                <dd className="tabular-nums">{naira(o.total_amount)}</dd>
              </div>
              <p className="pt-1 text-xs text-gray-500">
                {cod
                  ? "Cash on delivery"
                  : o.paid_at
                    ? `Paid ${when(o.paid_at)} with Paystack`
                    : cancelled
                      ? "Not paid"
                      : "Awaiting payment"}
              </p>
            </dl>
          </section>

          <div className="space-y-5">
            {/* Where / when */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                {pickup ? <Store className="h-4 w-4 text-[#3f7a55]" /> : <MapPin className="h-4 w-4 text-[#3f7a55]" />}
                {pickup ? "Pickup" : "Delivery"}
              </h2>
              {pickup ? (
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{store.data?.store_name ?? "Our shop"}</p>
                  {store.data?.pickup_address && <p>{store.data.pickup_address}</p>}
                  {store.data?.pickup_instructions && <p className="whitespace-pre-line text-gray-500">{store.data.pickup_instructions}</p>}
                  <p className="pt-1 text-gray-500">Bring your order number: <span className="font-mono">{shortOrderId(o.id)}</span></p>
                </div>
              ) : d ? (
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  {d.time_slot && (
                    <p className="flex items-center gap-2 font-medium text-gray-900"><Clock className="h-4 w-4 text-gray-400" /> {longDay(d.delivery_date)} · {d.time_slot}</p>
                  )}
                  <p>{zoneName}</p>
                  <p>{d.address}{d.apartment && `, ${d.apartment}`}</p>
                  {d.landmark && <p className="text-gray-500">Near {d.landmark}</p>}
                  {d.instructions && <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">“{d.instructions}”</p>}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">Delivery details unavailable.</p>
              )}
            </section>

            {/* Help */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 text-sm">
              <h2 className="font-semibold text-gray-900">Need help?</h2>
              {!cancelled && !canCancel && o.status !== "delivered" && (
                <p className="mt-2 flex items-start gap-2 text-gray-600">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  {o.status === "in_transit" ? "It's already on its way. If something's wrong, contact us." : "We've started on this order. To change or cancel it, contact us."}
                </p>
              )}
              <div className="mt-2 space-y-1.5 text-gray-600">
                {store.data?.contact_phone && (
                  <a href={`tel:${store.data.contact_phone}`} className="flex items-center gap-2 hover:text-gray-900"><Phone className="h-4 w-4 text-[#3f7a55]" /> {store.data.contact_phone}</a>
                )}
                {store.data?.contact_email && (
                  <a href={`mailto:${store.data.contact_email}?subject=${encodeURIComponent(`Order ${shortOrderId(o.id)}`)}`} className="flex items-center gap-2 hover:text-gray-900">
                    <Mail className="h-4 w-4 text-[#3f7a55]" /> {store.data.contact_email}
                  </a>
                )}
                {!store.data?.contact_phone && !store.data?.contact_email && <p className="text-gray-500">Mention your order number {shortOrderId(o.id)} when you get in touch.</p>}
              </div>
            </section>
          </div>
        </div>
      </div>

      <CancelOrderDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        reasons={CUSTOMER_CANCEL_REASONS}
        description="Please tell us why. Once cancelled, this can't be undone."
        onConfirm={async (reason) => {
          const updated = await cancelUserOrder(o.id, reason);
          queryClient.setQueryData(["order", id], updated);
          queryClient.invalidateQueries({ queryKey: ["my-orders"] });
          queryClient.invalidateQueries({ queryKey: ["my-orders-summary"] });
          toast.success("Your order has been cancelled.");
        }}
      />
    </>
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const ready = useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  // Signed out: guests (and anyone signed out) can look the order up by number + email.
  useEffect(() => {
    if (ready && !isAuthenticated) router.replace(`/order-tracking?id=${encodeURIComponent(params.id)}`);
  }, [ready, isAuthenticated, params.id, router]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f7]">
      <Header />
      <main className="container mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:py-8">
        {ready && isAuthenticated && params.id ? (
          <OrderDetail id={params.id} />
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
