"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  AlertCircle, ArrowLeft, BadgeCheck, Loader2, Mail, MapPin, Phone, ShieldOff, ShieldCheck, ShoppingBag, UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { getCustomerById, setCustomerActive, type CustomerDetail } from "@/core/api";
import { getStatusInfo, shortOrderId } from "@/lib/orderStatus";
import { getThumbnailUrl } from "@/lib/imageUrl";

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" });
const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function CustomerPage() {
  const { id } = useParams() as { id: string };
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const { data: c, isPending, isError, error, refetch } = useQuery({
    queryKey: ["admin-customer", id],
    queryFn: () => getCustomerById(id),
    retry: (count, err) => (err as { status?: number }).status !== 404 && count < 2,
  });

  const toggle = useMutation({
    mutationFn: (active: boolean) => setCustomerActive(id, active),
    onSuccess: (updated: CustomerDetail) => {
      queryClient.setQueryData(["admin-customer", id], updated);
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      setConfirming(false);
      toast.success(updated.status === "active" ? `${updated.name} can sign in again` : `${updated.name} has been deactivated and signed out`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-gray-400">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-green-600" />
        <p>Loading customer…</p>
      </div>
    );
  }

  if (isError) {
    const notFound = (error as { status?: number }).status === 404;
    return (
      <div className="space-y-4">
        <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Customers
        </Link>
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="flex-1 text-sm">{notFound ? "This customer doesn't exist or was removed." : (error as Error).message}</p>
          {!notFound && (
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  const active = c.status === "active";

  return (
    <div className="space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Customers
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 md:flex-row md:items-center">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#dcebe1] text-xl font-semibold text-[#2d583d]">
          {initials(c.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-2xl font-semibold text-gray-900">{c.name}</h1>
            {c.email_verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Email not verified</span>
            )}
            {!active && <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">Deactivated</span>}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
            <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 hover:text-gray-900">
              <Mail className="h-4 w-4" /> {c.email}
            </a>
            {c.phone && (
              <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1.5 hover:text-gray-900">
                <Phone className="h-4 w-4" /> {c.phone}
              </a>
            )}
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-4 w-4" /> Joined {date(c.joinDate)}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => (active ? setConfirming(true) : toggle.mutate(true))}
          disabled={toggle.isPending}
          className={active ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" : ""}
        >
          {toggle.isPending && !confirming ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : active ? (
            <ShieldOff className="mr-2 h-4 w-4" />
          ) : (
            <ShieldCheck className="mr-2 h-4 w-4" />
          )}
          {active ? "Deactivate" : "Reactivate"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Total spent" value={naira(c.totalSpent)} sub="Paid online or collected on delivery" />
        <Stat label="Orders" value={c.ordersCount} sub={`${c.paid_orders ?? 0} paid · ${c.cancelled_orders} cancelled`} />
        <Stat label="Avg order" value={c.paid_orders ? naira(c.avg_order_value) : "—"} />
        <Stat
          label="Last order"
          value={c.last_order_at ? date(c.last_order_at) : "Never"}
          sub={c.first_order_at ? `First: ${date(c.first_order_at)}` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Orders */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white xl:col-span-2">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Orders</h2>
            <p className="text-xs text-gray-400">Most recent {c.recent_orders.length}</p>
          </div>
          {c.recent_orders.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
              <ShoppingBag className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="hidden px-5 py-3 md:table-cell">Delivery</th>
                    <th className="px-5 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {c.recent_orders.map((o) => {
                    const st = getStatusInfo(o);
                    const items = o.items.reduce((n, i) => n + i.quantity, 0);
                    return (
                      <tr key={o.id} className="hover:bg-green-50/40">
                        <td className="px-5 py-3">
                          <Link href={`/admin/orders/${o.id}`} className="font-mono font-medium text-gray-900 hover:text-[#3f7a55]">
                            {shortOrderId(o.id)}
                          </Link>
                          <p className="text-xs text-gray-400">
                            {date(o.created_at)} · {items} item{items === 1 ? "" : "s"}
                          </p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${st.className}`}>{st.label}</span>
                        </td>
                        <td className="hidden px-5 py-3 text-gray-600 md:table-cell">
                          {o.delivery_method === "pickup" ? "Pickup" : o.delivery_zone ?? "Delivery"}
                          {o.payment_method === "cod" && <span className="ml-1.5 text-xs text-gray-400">· cash</span>}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold tabular-nums text-gray-900">{naira(o.total_amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="space-y-6">
          {/* Favourites */}
          <section className="rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Usually buys</h2>
            </div>
            {c.favourites.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">Nothing paid for yet</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {c.favourites.map((f) => (
                  <li key={f.product_id} className="flex items-center gap-3 px-5 py-3">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image src={getThumbnailUrl(f.image_url, 80)} alt="" fill unoptimized className="object-cover" />
                    </span>
                    <div className="min-w-0 flex-1">
                      {f.slug ? (
                        <Link href={`/admin/products/${f.slug}`} className="block truncate text-sm font-medium text-gray-900 hover:text-[#3f7a55]">
                          {f.name}
                        </Link>
                      ) : (
                        <p className="truncate text-sm font-medium text-gray-900">{f.name}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        in {f.times_ordered} order{f.times_ordered === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-gray-900">×{Number(f.units.toFixed(2))}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Addresses */}
          <section className="rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Delivery addresses</h2>
            </div>
            {c.addresses.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">No deliveries yet</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {c.addresses.map((a) => (
                  <li key={`${a.address}-${a.zone}`} className="flex gap-3 px-5 py-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3f7a55]" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900">{a.address}</p>
                      <p className="text-xs text-gray-400">
                        {a.zone ?? "Unknown zone"} · used {a.times_used}× · last {date(a.last_used)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate {c.name}?</DialogTitle>
            <DialogDescription>
              They&apos;ll be signed out everywhere and won&apos;t be able to sign in. Their orders and history stay as they are,
              and you can reactivate them at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Keep active
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" disabled={toggle.isPending} onClick={() => toggle.mutate(false)}>
              {toggle.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
