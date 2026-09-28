"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AlertCircle, Banknote, CreditCard, Landmark, Loader2, Plus, Receipt, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { naira } from "@/components/admin/sales/ticket";
import { COUNTER_PAYMENTS, getSalesDay } from "@/core/api";
import { shortOrderId } from "@/lib/orderStatus";

const todayInLagos = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
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

export default function SalesPage() {
  const router = useRouter();
  const [day, setDay] = useState(todayInLagos());
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["admin-sales", day],
    queryFn: () => getSalesDay(day),
    placeholderData: keepPreviousData,
  });

  const isToday = day === todayInLagos();
  const s = data?.summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Counter</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Walk-in sales</h1>
          <p className="mt-1 text-sm text-gray-500">Sales rung up in the shop, and what to expect in the till.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            aria-label="Day"
            value={day}
            max={todayInLagos()}
            onChange={(e) => e.target.value && setDay(e.target.value)}
            className="w-40"
          />
          <Button asChild className="bg-[#3f7a55] hover:bg-[#2d583d]">
            <Link href="/admin/sales/new"><Plus className="mr-2 h-4 w-4" /> New sale</Link>
          </Button>
        </div>
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
            <Stat label="Cash" value={naira(s!.by_payment_method.cash ?? 0)} sub="Should be in the till" icon={Banknote} />
            <Stat label="Transfer" value={naira(s!.by_payment_method.transfer ?? 0)} sub="Check the bank app" icon={Landmark} />
            <Stat label="POS" value={naira(s!.by_payment_method.pos ?? 0)} sub="Check the terminal's report" icon={CreditCard} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {data!.sales.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-5 py-16 text-center">
                <Store className="h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">No walk-in sales {isToday ? "yet today" : "on this day"}</p>
                {isToday && (
                  <Link href="/admin/sales/new" className="text-sm font-semibold text-[#3f7a55] hover:underline">Ring up a sale</Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      <th className="px-5 py-3">Time</th>
                      <th className="px-5 py-3">Sale</th>
                      <th className="hidden px-5 py-3 md:table-cell">Items</th>
                      <th className="hidden px-5 py-3 lg:table-cell">Served by</th>
                      <th className="px-5 py-3">Paid by</th>
                      <th className="px-5 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data!.sales.map((sale) => {
                      const voided = sale.status === "cancelled";
                      return (
                        <tr
                          key={sale.id}
                          onClick={() => router.push(`/admin/sales/${sale.id}`)}
                          className={`cursor-pointer hover:bg-gray-50 ${voided ? "text-gray-400" : ""}`}
                        >
                          <td className="whitespace-nowrap px-5 py-3 tabular-nums">{time(sale.created_at)}</td>
                          <td className="px-5 py-3">
                            <Link href={`/admin/sales/${sale.id}`} className="font-mono font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>
                              {shortOrderId(sale.id)}
                            </Link>
                            {voided && <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-600">Void</span>}
                            {sale.customer_name && sale.customer_name !== "Guest" && (
                              <p className="text-xs text-gray-500">{sale.customer_name}</p>
                            )}
                          </td>
                          <td className="hidden max-w-xs truncate px-5 py-3 text-gray-600 md:table-cell">
                            {sale.items.map((i) => i.product?.name).join(", ")}
                          </td>
                          <td className="hidden px-5 py-3 text-gray-600 lg:table-cell">{sale.served_by_name ?? "—"}</td>
                          <td className="px-5 py-3">
                            {COUNTER_PAYMENTS.find((m) => m.key === sale.payment_method)?.label ?? sale.payment_method}
                          </td>
                          <td className={`px-5 py-3 text-right font-semibold tabular-nums ${voided ? "line-through" : "text-gray-900"}`}>
                            {naira(sale.total_amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
