"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Ban, Clock, Loader2, Mail, MapPin, Phone, RefreshCw, Search, Store, Truck,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PayNow } from "@/components/orders/PayNow";
import { PaymentDeadline } from "@/components/orders/PaymentDeadline";
import { OrderProgress, PinAndCourier } from "@/components/orders/OrderStatusParts";
import { longDay, orderHeadline } from "@/components/orders/orderStatusText";
import { getPublicOrderTrack, type UserOrder } from "@/core/api/user/orders";
import { getDeliveryZones } from "@/core/api/user/delivery";
import { getStoreInfo } from "@/core/api/user/store";
import { useAuthStore } from "@/core/store/useAuthStore";
import { isFinished, isUnpaid, shortOrderId } from "@/lib/orderStatus";
import { getThumbnailUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/utils";

const RECENT_KEY = "tracked_orders";
const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });

type Recent = { id: string; email: string };

function readRecent(): Recent[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return (raw as (string | Recent)[])
      .map((r) => (typeof r === "string" ? { id: r, email: "" } : r))
      .filter((r) => r.id && r.email);
  } catch {
    return [];
  }
}

function remember(entry: Recent) {
  try {
    const next = [entry, ...readRecent().filter((r) => r.id !== entry.id)].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable: nothing to remember
  }
}

/* ------------------------------------------------------------------ page */

function Tracking() {
  const router = useRouter();
  const params = useSearchParams();
  const [lookup, setLookup] = useState<Recent | null>(() => {
    const id = params.get("id");
    const email = params.get("email");
    if (id && email) return { id, email };
    return null;
  });
  // The full ID when we have it (links, recent list): it works with every version of the lookup.
  const [number, setNumber] = useState(() => params.get("id") ?? "");
  const [email, setEmail] = useState(() => params.get("email") ?? "");
  const [recent, setRecent] = useState<Recent[]>(() => (typeof window === "undefined" ? [] : readRecent()));

  // Signed-in customers have their own order pages; this lookup is for guests.
  // Subscribed, not read once: signing in while this page is open (or the
  // saved session loading a moment after it) must still move them along.
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      const id = params.get("id");
      router.replace(id ? `/orders/${encodeURIComponent(id)}` : "/orders");
    }
  }, [isAuthenticated, params, router]);

  // Links from checkout carry the email: use it, then drop it from the address bar.
  useEffect(() => {
    if (params.get("email")) {
      const id = params.get("id");
      router.replace(id ? `/order-tracking?id=${encodeURIComponent(id)}` : "/order-tracking", { scroll: false });
    }
  }, [params, router]);

  const track = useQuery({
    queryKey: ["track-order", lookup?.id, lookup?.email],
    queryFn: async () => {
      const order = await getPublicOrderTrack(lookup!.id, lookup!.email);
      remember({ id: order.id, email: lookup!.email });
      setRecent(readRecent());
      return order;
    },
    enabled: !!lookup,
    retry: false,
    // Keep an active order current while the page is open.
    refetchInterval: (q) => (q.state.data && !isFinished(q.state.data.status) ? 60_000 : false),
  });
  const zones = useQuery({ queryKey: ["delivery-zones"], queryFn: getDeliveryZones, staleTime: 5 * 60_000 });
  const store = useQuery({ queryKey: ["store-info"], queryFn: getStoreInfo, staleTime: 10 * 60_000 });

  const o = track.data;
  const notFound = track.isError && (track.error as { status?: number }).status === 404;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim() || !email.trim()) return;
    setLookup({ id: number.trim(), email: email.trim() });
  };

  return (
    <main className="flex-1 bg-[#f7f8f7]">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">Order tracking</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">Where&apos;s my order?</h1>
          <p className="mt-2 max-w-xl text-gray-600">
            Enter your order number and the email you used at checkout. Signed in?{" "}
            <Link href="/orders" className="font-semibold text-[#3f7a55] hover:underline">See your orders</Link>.
          </p>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        {/* Lookup */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="space-y-2">
              <Label htmlFor="order-number">Order number</Label>
              <Input id="order-number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="#1A2B3C4D" autoComplete="off" className="font-mono uppercase" />
              <p className="text-xs text-gray-500">It&apos;s in your confirmation email and on the order page.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="track-email">Email</Label>
              <Input id="track-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <button
              type="submit"
              disabled={!number.trim() || !email.trim() || track.isFetching}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3f7a55] font-semibold text-white hover:bg-[#2d583d] disabled:bg-gray-300"
            >
              {track.isFetching && !o ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Track order
            </button>
            {track.isError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {notFound
                  ? "We couldn't find an order with that number and email. Check both and try again."
                  : (track.error as { status?: number }).status === 429
                    ? "Too many tries. Please wait a minute and try again."
                    : "Something went wrong. Please try again."}
              </p>
            )}
          </form>

          {recent.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="mb-3 text-sm font-semibold text-gray-900">Recently tracked on this device</p>
              <ul className="space-y-1.5">
                {recent.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setNumber(r.id);
                        setEmail(r.email);
                        setLookup(r);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        o?.id === r.id ? "border-[#3f7a55] bg-[#f4f7f5]" : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <span className="font-mono font-medium text-gray-900">{shortOrderId(r.id)}</span>
                      <span className="truncate pl-3 text-xs text-gray-400">{r.email}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(store.data?.contact_phone || store.data?.contact_email) && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm">
              <p className="font-semibold text-gray-900">Need help with an order?</p>
              <div className="mt-2 space-y-1.5 text-gray-600">
                {store.data?.contact_phone && (
                  <a href={`tel:${store.data.contact_phone}`} className="flex items-center gap-2 hover:text-gray-900"><Phone className="h-4 w-4 text-[#3f7a55]" /> {store.data.contact_phone}</a>
                )}
                {store.data?.contact_email && (
                  <a href={`mailto:${store.data.contact_email}`} className="flex items-center gap-2 hover:text-gray-900"><Mail className="h-4 w-4 text-[#3f7a55]" /> {store.data.contact_email}</a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="min-w-0">
          {!o ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              {track.isFetching ? (
                <Loader2 className="h-8 w-8 animate-spin text-[#3f7a55]" />
              ) : (
                <>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f7f5] text-[#3f7a55]"><Truck className="h-7 w-7" /></span>
                  <p className="font-semibold text-gray-900">Your order will show up here</p>
                  <p className="max-w-sm text-sm text-gray-500">You&apos;ll see its progress, your delivery slot, the courier&apos;s details and your delivery PIN.</p>
                </>
              )}
            </div>
          ) : (
            <OrderView order={o} zoneName={zones.data?.find((z) => z.id === o.delivery?.delivery_zone)?.name} store={store.data} email={lookup?.email ?? ""} refreshing={track.isFetching} onRefresh={() => track.refetch()} />
          )}
        </div>
      </div>
    </main>
  );
}

function OrderView({ order: o, zoneName, store, email, refreshing, onRefresh }: {
  order: UserOrder;
  zoneName?: string;
  store?: { store_name: string; pickup_address: string | null; pickup_instructions: string | null };
  email: string;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const pickup = o.delivery_method === "pickup";
  const d = o.delivery;
  const cancelled = o.status === "cancelled";
  const { title, sub } = orderHeadline(o);
  const itemsTotal = o.items.reduce((n, i) => n + i.price_at_time * i.quantity, 0);
  const count = o.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="space-y-5">
      {/* Status */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className={cn("px-5 py-6 md:px-7", cancelled ? "bg-red-50" : o.status === "delivered" ? "bg-[#F0FFDF]" : "bg-[#f4f7f5]")}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-sm text-gray-500">Order {shortOrderId(o.id)} · placed {when(o.created_at)}</p>
              <h2 className={cn("mt-1 font-serif text-2xl font-semibold md:text-3xl", cancelled ? "text-red-800" : "text-[#1a1a1a]")}>{title}</h2>
              {sub && <p className="mt-1 text-gray-600">{sub}</p>}
            </div>
            {!isFinished(o.status) && (
              <button type="button" onClick={onRefresh} disabled={refreshing} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900">
                <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} /> Refresh
              </button>
            )}
          </div>
        </div>

        {cancelled ? (
          <div className="flex items-start gap-3 px-5 py-4 text-sm text-gray-600 md:px-7">
            <Ban className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p>
              Cancelled{o.cancelled_at && <> on {when(o.cancelled_at)}</>}.
              {o.paid_at && o.payment_method !== "cod" && " If you paid online, the refund goes back to your original payment method."}
            </p>
          </div>
        ) : (
          <OrderProgress order={o} />
        )}

        {isUnpaid(o.status) && o.payment_method !== "cod" && (
          <div className="space-y-3 border-t border-gray-100 px-5 py-4 md:px-7">
            {o.payment_expires_at && <PaymentDeadline expiresAt={o.payment_expires_at} onExpired={onRefresh} />}
            <PayNow order={o} email={email || o.guest_info?.email || ""} className="w-full bg-[#22c55e] text-white hover:bg-[#16a34a] sm:w-auto" />
          </div>
        )}
      </section>

      <PinAndCourier order={o} />

      <div className="grid gap-5 md:grid-cols-2">
        {/* Where / when */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            {pickup ? <Store className="h-4 w-4 text-[#3f7a55]" /> : <MapPin className="h-4 w-4 text-[#3f7a55]" />}
            {pickup ? "Pickup" : "Delivery"}
          </h3>
          {pickup ? (
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{store?.store_name ?? "Our shop"}</p>
              {store?.pickup_address && <p>{store.pickup_address}</p>}
              {store?.pickup_instructions && <p className="whitespace-pre-line text-gray-500">{store.pickup_instructions}</p>}
              <p className="pt-1 text-gray-500">Bring your order number: <span className="font-mono">{shortOrderId(o.id)}</span></p>
            </div>
          ) : d ? (
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              {d.time_slot && (
                <p className="flex items-center gap-2 font-medium text-gray-900"><Clock className="h-4 w-4 text-gray-400" /> {longDay(d.delivery_date)} · {d.time_slot}</p>
              )}
              <p>{zoneName ?? d.delivery_zone}</p>
              <p>{d.address}{d.apartment && `, ${d.apartment}`}</p>
              {d.landmark && <p className="text-gray-500">Near {d.landmark}</p>}
            </div>
          ) : null}
        </section>

        {/* Items */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{count} item{count === 1 ? "" : "s"}</h3>
          <ul className="mt-3 space-y-3">
            {o.items.map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image src={getThumbnailUrl(i.product?.image_url, 88)} alt="" fill unoptimized className="object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{i.product?.name ?? "Item"}</p>
                  <p className="text-xs text-gray-500">{i.selected_option ? `${i.selected_option} · ` : ""}×{i.quantity}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-gray-900">{naira(i.price_at_time * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-gray-100 pt-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Items</span><span className="tabular-nums">{naira(itemsTotal)}</span></div>
            {!pickup && <div className="flex justify-between"><span className="text-gray-500">Delivery (cash to courier)</span><span className="tabular-nums">est. {naira(o.delivery_fee)}</span></div>}
            <div className="flex justify-between pt-1 font-semibold">
              <span>{o.payment_method === "cod" ? "To pay in cash" : o.paid_at ? "Paid online" : "To pay online"}</span>
              <span className="tabular-nums">{naira(o.total_amount)}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-[#dcebe1] bg-[#f4f7f5] p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-gray-900">Track every order in one place</p>
          <p className="text-sm text-gray-600">Create a free account with this email to see all your orders and check out faster.</p>
        </div>
        <Link href={`/register?email=${encodeURIComponent(email)}`} className="inline-flex h-10 shrink-0 items-center rounded-lg bg-[#3f7a55] px-4 text-sm font-semibold text-white hover:bg-[#2d583d]">
          Create account
        </Link>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      {/* useSearchParams needs a Suspense boundary. */}
      <Suspense fallback={<div className="flex flex-1 items-center justify-center p-24 text-gray-400"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
        <Tracking />
      </Suspense>
      <Footer />
    </div>
  );
}
