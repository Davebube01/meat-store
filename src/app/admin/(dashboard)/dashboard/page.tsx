"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2, Plus, ListOrdered, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminDashboard, type DashboardRange } from "@/core/api";
import { useAdminAuthStore } from "@/core/store/useAdminAuthStore";
import { KpiCards } from "@/components/admin/dashboard/KpiCards";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { StatusDonut } from "@/components/admin/dashboard/StatusDonut";
import { TodaysDeliveries } from "@/components/admin/dashboard/TodaysDeliveries";
import { LowStockCard, TopProductsCard } from "@/components/admin/dashboard/StockAndTopProducts";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";

const RANGES: { key: DashboardRange; label: string; long: string }[] = [
  { key: "today", label: "Today", long: "Today" },
  { key: "7d", label: "7 days", long: "Last 7 days" },
  { key: "30d", label: "30 days", long: "Last 30 days" },
];

const greeting = () => {
  const hour = Number(new Date().toLocaleString("en-NG", { hour: "numeric", hour12: false, timeZone: "Africa/Lagos" }));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
};

export default function AdminDashboardPage() {
  const [range, setRange] = useState<DashboardRange>("today");
  const user = useAdminAuthStore((s) => s.user);
  const firstName = user?.full_name?.split(" ")[0];

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-dashboard", range],
    queryFn: () => getAdminDashboard(range),
    // Orders land throughout the day; keep the numbers current while the tab is open.
    refetchInterval: 60_000,
    placeholderData: (prev) => prev,
  });

  const rangeLabel = RANGES.find((r) => r.key === range)!.long;
  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">
            {greeting()}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {today}
            {data && data.kpis.awaiting_dispatch > 0 && (
              <> · {data.kpis.awaiting_dispatch} order{data.kpis.awaiting_dispatch === 1 ? "" : "s"} to get out the door</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-gray-100 p-1" role="tablist" aria-label="Date range">
            {RANGES.map((r) => (
              <button
                key={r.key}
                role="tab"
                aria-selected={range === r.key}
                onClick={() => setRange(r.key)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  range === r.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching} aria-label="Refresh">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {isPending ? (
        <div className="flex flex-col items-center justify-center p-24 text-gray-400">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-green-600" />
          <p>Loading dashboard…</p>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-semibold">Couldn&apos;t load the dashboard</p>
            <p className="text-sm opacity-90">{(error as Error)?.message}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <KpiCards kpis={data.kpis} range={range} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RevenueChart series={data.revenue_series} />
            </div>
            <StatusDonut breakdown={data.status_breakdown} rangeLabel={rangeLabel} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <TodaysDeliveries slots={data.todays_deliveries} />
            <LowStockCard
              items={data.low_stock}
              lowCount={data.low_stock_count}
              outCount={data.out_of_stock_count}
              threshold={data.low_stock_threshold}
            />
            <TopProductsCard items={data.top_products} rangeLabel={rangeLabel} />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RecentOrders orders={data.recent_orders} />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="mb-3 text-sm font-semibold text-gray-900">Quick actions</p>
              <div className="grid gap-2">
                {[
                  { href: "/admin/products/create", label: "Add a product", icon: Plus },
                  { href: "/admin/orders", label: "Manage orders", icon: ListOrdered },
                  { href: "/admin/customers", label: "View customers", icon: Users },
                ].map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-[#3f7a55]/40 hover:bg-green-50/50"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-[#3f7a55]">
                      <a.icon className="h-4 w-4" />
                    </span>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
