"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AlertCircle, Clock, Loader2, PackageSearch, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { getOrders, getOrdersSummary, type OrderListParams, type OrderView } from "@/core/api";
import { getDeliveryZones } from "@/core/api/user/delivery";
import { getStatusInfo, shortOrderId } from "@/lib/orderStatus";

const PAGE = 50;

const VIEWS: { key: OrderView; label: string }[] = [
  { key: "needs_action", label: "Needs action" },
  { key: "all", label: "All" },
  { key: "unpaid", label: "Awaiting payment" },
  { key: "paid", label: "Paid" },
  { key: "processing", label: "Processing" },
  { key: "in_transit", label: "Out / ready" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });
const slotDay = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", timeZone: "Africa/Lagos" }) : null;

export default function OrdersPage() {
  const router = useRouter();
  const [view, setView] = useState<OrderView>("needs_action");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState<"" | "delivery" | "pickup">("");
  const [zone, setZone] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setLimit(PAGE);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const params: OrderListParams = {
    view,
    search: search || undefined,
    method: method || undefined,
    zone: zone || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    limit: limit + 1, // one extra to know if there are more
  };

  const summary = useQuery({ queryKey: ["admin-orders-summary"], queryFn: getOrdersSummary, refetchInterval: 60_000 });
  const list = useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => getOrders(params),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
  });
  const zones = useQuery({ queryKey: ["delivery-zones"], queryFn: getDeliveryZones, staleTime: 5 * 60_000 });

  const rows = list.data?.slice(0, limit) ?? [];
  const hasMore = (list.data?.length ?? 0) > limit;
  const filtered = !!(search || method || zone || dateFrom || dateTo);
  const reset = (fn: () => void) => {
    fn();
    setLimit(PAGE);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Sales</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            {summary.data
              ? `${summary.data.counts.needs_action} to act on${summary.data.overdue ? ` · ${summary.data.overdue} past their delivery slot` : ""}`
              : "Every order, newest first."}
          </p>
        </div>
        <Button
          variant="outline"
          disabled={list.isFetching}
          onClick={() => {
            list.refetch();
            summary.refetch();
          }}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${list.isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {summary.data && summary.data.overdue > 0 && view !== "needs_action" && (
        <button
          type="button"
          onClick={() => reset(() => setView("needs_action"))}
          className="flex w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-800 hover:bg-red-100"
        >
          <Clock className="h-4 w-4" />
          {summary.data.overdue} order{summary.data.overdue === 1 ? " is" : "s are"} past the delivery slot and not dispatched yet. Show them
        </button>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-3" role="tablist" aria-label="Order status">
          {VIEWS.map((v) => {
            const count = summary.data?.counts[v.key];
            const on = view === v.key;
            return (
              <button
                key={v.key}
                role="tab"
                aria-selected={on}
                onClick={() => reset(() => setView(v.key))}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                  on ? "border-[#3f7a55] text-[#2d583d]" : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {v.label}
                {count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      on ? "bg-green-100 text-[#2d583d]" : v.key === "needs_action" && count > 0 ? "bg-[#22c55e] text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 xl:flex-row xl:items-center">
          <div className="relative flex-1 xl:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Order #, customer, phone or payment ref"
              aria-label="Search orders"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownSelect
              aria-label="Delivery method"
              value={method}
              onValueChange={(v) => reset(() => setMethod(v as typeof method))}
              className="w-auto"
              options={[
                { value: "", label: "Delivery & pickup" },
                { value: "delivery", label: "Delivery" },
                { value: "pickup", label: "Pickup" },
              ]}
            />
            <DropdownSelect
              aria-label="Delivery zone"
              value={zone}
              onValueChange={(v) => reset(() => setZone(v))}
              className="w-auto max-w-[200px]"
              options={[
                { value: "", label: "All zones" },
                ...(zones.data?.map((z) => ({ value: z.id, label: z.name })) ?? []),
              ]}
            />
            <label className="flex items-center gap-1.5 text-sm text-gray-500">
              From
              <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => reset(() => setDateFrom(e.target.value))} className="h-9 rounded-lg border border-gray-200 px-2 text-sm text-gray-700" />
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-500">
              To
              <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => reset(() => setDateTo(e.target.value))} className="h-9 rounded-lg border border-gray-200 px-2 text-sm text-gray-700" />
            </label>
            {filtered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  reset(() => {
                    setSearchInput("");
                    setSearch("");
                    setMethod("");
                    setZone("");
                    setDateFrom("");
                    setDateTo("");
                  })
                }
              >
                <X className="mr-1 h-4 w-4" /> Clear
              </Button>
            )}
          </div>
        </div>

        {list.isPending ? (
          <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-green-600" />
            <p>Loading orders…</p>
          </div>
        ) : list.isError ? (
          <div className="m-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p className="flex-1 text-sm">{(list.error as Error).message}</p>
            <Button variant="outline" size="sm" onClick={() => list.refetch()}>
              Retry
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-16 text-center">
            <PackageSearch className="h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">
              {filtered ? "No orders match these filters." : view === "needs_action" ? "Nothing needs your attention right now." : "No orders here yet."}
            </p>
          </div>
        ) : (
          <>
          <ul className={`divide-y divide-gray-100 md:hidden ${list.isFetching ? "opacity-60" : ""}`}>
            {rows.map((o) => {
              const st = getStatusInfo(o);
              const items = o.items.reduce((n: number, i: { quantity: number }) => n + i.quantity, 0);
              const pickup = o.delivery_method === "pickup";
              return (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className={`block px-4 py-3 ${o.overdue ? "bg-red-50/50" : "active:bg-gray-50"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono font-medium text-gray-900">{shortOrderId(o.id)}</p>
                        <p className="text-xs text-gray-400">
                          {when(o.created_at)} · {items} item{items === 1 ? "" : "s"}
                        </p>
                      </div>
                      <p className="shrink-0 font-semibold tabular-nums text-gray-900">{naira(o.total_amount)}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {o.customer_name}
                          {o.is_guest && <span className="ml-1.5 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-500">Guest</span>}
                        </p>
                        <p className="text-xs text-gray-400">{o.customer_phone ?? o.customer_email}</p>
                      </div>
                      <span className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${st.className}`}>{st.label}</span>
                    </div>
                    {!pickup && (
                      <p className={`mt-1 truncate text-xs ${o.overdue ? "font-semibold text-red-600" : "text-gray-400"}`}>
                        {o.delivery_zone_name ?? "Delivery"}
                        {o.delivery?.time_slot && ` · ${slotDay(o.delivery.delivery_date)} · ${o.delivery.time_slot}`}
                        {o.overdue && " · past slot"}
                      </p>
                    )}
                    {o.payment_method === "cod" && <p className="mt-1 text-xs text-gray-400">Cash on delivery</p>}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Delivery</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-100 ${list.isFetching ? "opacity-60" : ""}`}>
                {rows.map((o) => {
                  const st = getStatusInfo(o);
                  const items = o.items.reduce((n: number, i: { quantity: number }) => n + i.quantity, 0);
                  const pickup = o.delivery_method === "pickup";
                  return (
                    <tr key={o.id} onClick={() => router.push(`/admin/orders/${o.id}`)} className={`cursor-pointer ${o.overdue ? "bg-red-50/50 hover:bg-red-50" : "hover:bg-green-50/40"}`}>
                      <td className="px-5 py-3">
                        <Link href={`/admin/orders/${o.id}`} onClick={(e) => e.stopPropagation()} className="font-mono font-medium text-gray-900 hover:text-[#3f7a55]">
                          {shortOrderId(o.id)}
                        </Link>
                        <p className="text-xs text-gray-400">
                          {when(o.created_at)} · {items} item{items === 1 ? "" : "s"}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">
                          {o.customer_name}
                          {o.is_guest && <span className="ml-1.5 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-500">Guest</span>}
                        </p>
                        <p className="text-xs text-gray-400">{o.customer_phone ?? o.customer_email}</p>
                      </td>
                      <td className="hidden px-5 py-3 lg:table-cell">
                        {pickup ? (
                          <span className="text-gray-600">Pickup</span>
                        ) : (
                          <>
                            <p className="max-w-[220px] truncate text-gray-700">{o.delivery_zone_name ?? "Delivery"}</p>
                            {o.delivery?.time_slot && (
                              <p className={`text-xs ${o.overdue ? "font-semibold text-red-600" : "text-gray-400"}`}>
                                {slotDay(o.delivery.delivery_date)} · {o.delivery.time_slot}
                                {o.overdue && " · past slot"}
                              </p>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${st.className}`}>{st.label}</span>
                        {o.payment_method === "cod" && <p className="mt-1 text-xs text-gray-400">Cash on delivery</p>}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-gray-900">{naira(o.total_amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </>
        )}

        {hasMore && (
          <div className="border-t border-gray-100 p-3 text-center">
            <Button variant="ghost" size="sm" disabled={list.isFetching} onClick={() => setLimit((l) => l + PAGE)}>
              {list.isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Show more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
