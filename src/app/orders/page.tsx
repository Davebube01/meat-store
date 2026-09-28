"use client";

import { Suspense, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, Loader2, PackageOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrderCard } from "@/components/orders/OrderCard";
import { cn } from "@/lib/utils";
import { ORDER_TABS, OrderTab, isOrderTab } from "@/lib/orderStatus";
import { getOrderSummary, getUserOrders } from "@/core/api/user/orders";
import { useAuthStore } from "@/core/store/useAuthStore";

const PAGE_SIZE = 10;

const EMPTY_COPY: Record<OrderTab, { title: string; hint: string }> = {
  all: { title: "You haven't placed any orders yet", hint: "When you do, they'll show up here." },
  ongoing: { title: "Nothing on the way", hint: "Orders being prepared or delivered show up here." },
  completed: { title: "No completed orders yet", hint: "Delivered and collected orders show up here." },
  cancelled: { title: "No cancelled orders", hint: "Cancelled orders, with the reason, show up here." },
};

/** The persisted session is read from storage on load; wait for that before deciding. */
function useAuthReady() {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}

function OrderHistory() {
  const router = useRouter();
  const params = useSearchParams();
  const ready = useAuthReady();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const firstName = useAuthStore((s) => s.user?.full_name?.split(" ")[0]);

  const requested = params.get("tab");
  const tab: OrderTab = isOrderTab(requested) ? requested : "all";

  // Guests have no order history here; send them to the order lookup instead
  // of a "please sign in" dead end.
  useEffect(() => {
    if (ready && !isAuthenticated) router.replace("/order-tracking");
  }, [ready, isAuthenticated, router]);

  const summary = useQuery({ queryKey: ["my-orders-summary"], queryFn: getOrderSummary, enabled: ready && isAuthenticated });
  const orders = useInfiniteQuery({
    queryKey: ["my-orders", tab],
    queryFn: ({ pageParam }) => getUserOrders({ group: tab, skip: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (last, all) => (last.length === PAGE_SIZE ? all.length * PAGE_SIZE : undefined),
    enabled: ready && isAuthenticated,
    // Active orders change while you watch.
    refetchInterval: tab === "all" || tab === "ongoing" ? 60_000 : false,
  });

  if (!ready || !isAuthenticated) {
    return (
      <main className="flex flex-1 items-center justify-center p-24 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </main>
    );
  }

  const list = orders.data?.pages.flat() ?? [];

  return (
    <main className="flex-1 bg-[#f7f8f7]">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto max-w-5xl px-4 pb-0 pt-8 md:pt-10">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">
            {firstName ? `${firstName}'s orders` : "My orders"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Track what&apos;s on the way, pay for unpaid orders, or buy something again.</p>

          <div role="tablist" aria-label="Filter orders" className="-mx-4 mt-6 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {ORDER_TABS.map(({ key, label }) => {
              const active = tab === key;
              const count = summary.data?.[key];
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => router.replace(key === "all" ? "/orders" : `/orders?tab=${key}`, { scroll: false })}
                  className={cn(
                    "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                    active ? "border-[#3f7a55] text-[#2d583d]" : "border-transparent text-gray-500 hover:text-gray-800",
                  )}
                >
                  {label === "Ongoing" ? "In progress" : label}
                  {count !== undefined && (
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", active ? "bg-green-100 text-[#2d583d]" : "bg-gray-100 text-gray-500")}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {orders.isPending ? (
            <div className="divide-y divide-gray-100" aria-busy="true" aria-label="Loading orders">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-4 p-6">
                  <div className="h-14 w-14 rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-gray-100" />
                    <div className="h-3 w-3/5 rounded bg-gray-100" />
                  </div>
                  <div className="h-5 w-20 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : orders.isError && list.length === 0 ? (
            <div className="space-y-3 p-12 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
              <p className="font-medium text-gray-700">We couldn&apos;t load your orders.</p>
              <button type="button" onClick={() => orders.refetch()} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                Try again
              </button>
            </div>
          ) : list.length === 0 ? (
            <div className="p-12 text-center">
              <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f7f5] text-[#3f7a55]">
                <PackageOpen className="h-7 w-7" />
              </span>
              <p className="font-semibold text-gray-900">{EMPTY_COPY[tab].title}</p>
              <p className="mt-1 text-sm text-gray-500">{EMPTY_COPY[tab].hint}</p>
              {tab === "all" && (
                <Link href="/products" className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#22c55e] px-5 text-sm font-semibold text-white hover:bg-[#16a34a]">
                  Start shopping <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {list.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
              {orders.hasNextPage && (
                <div className="border-t border-gray-100 p-4 text-center">
                  <button
                    type="button"
                    onClick={() => orders.fetchNextPage()}
                    disabled={orders.isFetchingNextPage}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
                  >
                    {orders.isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />} Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function OrderHistoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <Suspense fallback={<div className="flex-1" />}>
        <OrderHistory />
      </Suspense>
      <Footer />
    </div>
  );
}
