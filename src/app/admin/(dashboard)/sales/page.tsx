"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle, Banknote, ChevronLeft, ChevronRight, CreditCard, Landmark, Loader2, Plus, Receipt, Search, Store, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CashUpCard } from "@/components/admin/sales/CashUpCard";
import { DayInsights } from "@/components/admin/sales/DayInsights";
import { naira } from "@/components/admin/sales/ticket";
import { COUNTER_PAYMENTS, getSalesDay, type CounterPayment } from "@/core/api";
import { shortOrderId } from "@/lib/orderStatus";
import { useAdminCan } from "@/core/store/useAdminCan";
import { cn } from "@/lib/utils";

const todayInLagos = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
const shiftDay = (day: string, by: number) => {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + by);
  return d.toISOString().slice(0, 10);
};
const dayTitle = (day: string) => {
  const today = todayInLagos();
  if (day === today) return "Today";
  if (day === shiftDay(today, -1)) return "Yesterday";
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
};
const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });

function Stat({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-[#3f7a55]">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="text-2xl font-bold tabular-nums text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function SalesDayView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const can = useAdminCan();

  const today = todayInLagos();
  const day = params.get("day") ?? today;
  const setDay = (d: string) => router.replace(d === today ? pathname : `${pathname}?day=${d}`, { scroll: false });

  const [search, setSearch] = useState("");
  const [method, setMethod] = useState<CounterPayment | "all">("all");
  const [showVoided, setShowVoided] = useState(true);

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-sales", day],
    queryFn: () => getSalesDay(day),
    placeholderData: keepPreviousData,
  });

  const isToday = day === today;
  const s = data?.summary;

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase().replace(/^#/, "");
    return (data?.sales ?? []).filter((sale) => {
      if (!showVoided && sale.status === "cancelled") return false;
      if (method !== "all" && sale.payment_method !== method) return false;
      if (!term) return true;
      return [sale.id.slice(0, 8), sale.customer_name, sale.served_by_name, ...sale.items.map((i) => i.product?.name)]
        .some((v) => v?.toLowerCase().includes(term));
    });
  }, [data, search, method, showVoided]);

  const filtered = !!search.trim() || method !== "all" || !showVoided;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Counter</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Walk-in sales</h1>
          <p className="mt-1 text-sm text-gray-500">Sales rung up in the shop, and cashing up the till.</p>
        </div>
        {can("sales.create") && (
          <Button asChild className="bg-[#3f7a55] hover:bg-[#2d583d]">
            <Link href="/admin/sales/new"><Plus className="mr-2 h-4 w-4" /> New sale</Link>
          </Button>
        )}
      </div>

      {/* Day picker */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" aria-label="Previous day" onClick={() => setDay(shiftDay(day, -1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Input type="date" aria-label="Day" value={day} max={today} onChange={(e) => e.target.value && setDay(e.target.value)} className="w-40" />
        <Button variant="outline" size="icon" aria-label="Next day" disabled={isToday} onClick={() => setDay(shiftDay(day, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="ml-1 text-sm font-semibold text-gray-900">{dayTitle(day)}</span>
        {!isToday && <Button variant="ghost" size="sm" onClick={() => setDay(today)}>Back to today</Button>}
        {isFetching && !isPending && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
      </div>

      {isPending ? (
        <div className="flex justify-center p-24 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="flex-1">{(error as Error)?.message || "Couldn't load sales"}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat
              label={isToday ? "Taken today" : "Taken"}
              value={naira(s!.total)}
              sub={`${s!.count} sale${s!.count === 1 ? "" : "s"}${s!.voided_count ? ` · ${s!.voided_count} voided (${naira(s!.voided_total)})` : ""}`}
              icon={Receipt}
            />
            <Stat label="Cash" value={naira(s!.by_payment_method.cash ?? 0)} sub="Should be in the till, plus the float" icon={Banknote} />
            <Stat label="Transfer" value={naira(s!.by_payment_method.transfer ?? 0)} sub="Check the bank app" icon={Landmark} />
            {data!.profit != null ? (
              <Stat
                label="Profit"
                value={naira(data!.profit)}
                sub={data!.profit_complete ? `POS ${naira(s!.by_payment_method.pos ?? 0)}` : "Some items have no cost price, so this reads high"}
                icon={TrendingUp}
              />
            ) : (
              <Stat label="POS" value={naira(s!.by_payment_method.pos ?? 0)} sub="Check the terminal's report" icon={CreditCard} />
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            {/* Sales */}
            <div className="space-y-3">
              {data!.sales.length > 0 && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Sale number, product, customer, staff" aria-label="Search sales" className="pl-9" />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {([{ key: "all", label: "All" }, ...COUNTER_PAYMENTS] as { key: CounterPayment | "all"; label: string }[]).map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        aria-pressed={method === m.key}
                        onClick={() => setMethod(m.key)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm font-medium",
                          method === m.key ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d]" : "border-gray-200 text-gray-600 hover:border-gray-300",
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                    {s!.voided_count > 0 && (
                      <label className="ml-1 inline-flex cursor-pointer items-center gap-1.5 text-sm text-gray-600">
                        <input type="checkbox" checked={showVoided} onChange={(e) => setShowVoided(e.target.checked)} className="h-4 w-4 accent-[#3f7a55]" />
                        Voided
                      </label>
                    )}
                  </div>
                </div>
              )}

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {data!.sales.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-5 py-16 text-center">
                    <Store className="h-8 w-8 text-gray-300" />
                    <p className="text-sm font-medium text-gray-700">No walk-in sales {isToday ? "yet today" : "on this day"}</p>
                    {isToday && can("sales.create") && (
                      <Link href="/admin/sales/new" className="text-sm font-semibold text-[#3f7a55] hover:underline">Ring up a sale</Link>
                    )}
                  </div>
                ) : rows.length === 0 ? (
                  <p className="px-5 py-12 text-center text-sm text-gray-500">No sales match.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {rows.map((sale) => {
                      const voided = sale.status === "cancelled";
                      const items = sale.items.map((i) => `${i.quantity > 1 ? `${i.quantity}× ` : ""}${i.product?.name ?? "Item"}`).join(", ");
                      return (
                        <li key={sale.id}>
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/sales/${sale.id}`)}
                            className={cn("flex w-full items-center gap-4 px-5 py-3.5 text-left hover:bg-gray-50", voided && "text-gray-400")}
                          >
                            <span className="w-16 shrink-0 text-sm tabular-nums text-gray-500">{time(sale.created_at)}</span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="font-mono text-sm font-semibold">{shortOrderId(sale.id)}</span>
                                {voided && <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-600">Void</span>}
                                {sale.customer_name && sale.customer_name !== "Guest" && <span className="truncate text-xs text-gray-500">{sale.customer_name}</span>}
                              </span>
                              <span className={cn("block truncate text-xs", voided ? "text-gray-400" : "text-gray-600")}>{items}</span>
                              <span className="block text-xs text-gray-400 sm:hidden">
                                {COUNTER_PAYMENTS.find((m) => m.key === sale.payment_method)?.label ?? sale.payment_method}
                                {sale.served_by_name && ` · ${sale.served_by_name}`}
                              </span>
                            </span>
                            <span className="hidden w-28 shrink-0 text-xs text-gray-500 sm:block">
                              <span className="block font-medium text-gray-700">{COUNTER_PAYMENTS.find((m) => m.key === sale.payment_method)?.label ?? sale.payment_method}</span>
                              {sale.served_by_name}
                            </span>
                            <span className={cn("w-24 shrink-0 text-right text-sm font-semibold tabular-nums", voided ? "line-through" : "text-gray-900")}>
                              {naira(sale.total_amount)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {filtered && rows.length > 0 && (
                  <p className="border-t border-gray-100 px-5 py-2.5 text-xs text-gray-500">
                    {rows.length} of {data!.sales.length} sales · {naira(rows.filter((r) => r.status !== "cancelled").reduce((a, r) => a + r.total_amount, 0))}
                  </p>
                )}
              </div>
            </div>

            {/* Cash-up and insights */}
            <aside className="space-y-4">
              <CashUpCard
                key={`${day}-${data!.till?.counted_at ?? "none"}`}
                day={day}
                cashSales={data!.cash_expected ?? 0}
                till={data!.till}
                canCount={can("sales.create")}
                isFuture={day > today}
                onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin-sales", day] })}
              />
              <DayInsights day={data!} />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

export default function SalesPage() {
  return (
    <Suspense>
      <SalesDayView />
    </Suspense>
  );
}
