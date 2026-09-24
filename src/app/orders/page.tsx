"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SignInModal } from "@/components/SignInModal";
import { OrderCard } from "@/components/orders/OrderCard";
import { cn } from "@/lib/utils";
import { ORDER_TABS, OrderTab, isOrderTab } from "@/lib/orderStatus";
import { getOrderSummary, getUserOrders, OrderSummary, UserOrder } from "@/core/api/user/orders";
import { useAuthStore } from "@/core/store/useAuthStore";

const PAGE_SIZE = 10;

const EMPTY_COPY: Record<OrderTab, { title: string; hint: string }> = {
  all: { title: "You haven't placed any orders yet", hint: "When you do, they'll show up here." },
  ongoing: { title: "No orders in progress", hint: "Orders that are being prepared or on their way appear here." },
  completed: { title: "No completed orders yet", hint: "Delivered and picked-up orders appear here." },
  cancelled: { title: "No cancelled orders", hint: "Orders that were cancelled, with the reason, appear here." },
};

function OrderHistoryContent() {
  const router = useRouter();
  const params = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const requested = params.get("tab");
  const tab: OrderTab = isOrderTab(requested) ? requested : "all";

  const [isMounted, setIsMounted] = useState(false);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const selectTab = (next: OrderTab) => {
    router.replace(next === "all" ? "/orders" : `/orders?tab=${next}`, { scroll: false });
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    getOrderSummary().then(setSummary).catch(() => setSummary(null));
  }, [isAuthenticated]);

  const loadFirstPage = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    setOrders([]);

    getUserOrders({ group: tab, skip: 0, limit: PAGE_SIZE })
      .then((page) => {
        if (!cancelled) setOrders(page);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // If the tab changes (or the page unmounts) mid-request, drop the stale answer.
    return () => {
      cancelled = true;
    };
  }, [tab]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    return loadFirstPage();
  }, [isAuthenticated, loadFirstPage]);

  const total = summary ? summary[tab] : null;
  const hasMore = total !== null ? orders.length < total : orders.length > 0 && orders.length % PAGE_SIZE === 0;

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const page = await getUserOrders({ group: tab, skip: orders.length, limit: PAGE_SIZE });
      setOrders((prev) => [...prev, ...page.filter((o) => !prev.some((p) => p.id === o.id))]);
    } catch {
      setFailed(true);
    } finally {
      setLoadingMore(false);
    }
  };

  if (isMounted && !isAuthenticated) {
    return (
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12 max-w-5xl flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Please sign in</h1>
          <p className="text-gray-500">Sign in to see your orders.</p>
          <SignInModal>
            <Button className="bg-green-700 hover:bg-green-700/90">Sign In</Button>
          </SignInModal>
          <p className="text-sm text-gray-500">
            Ordered as a guest?{" "}
            <Link href="/order-tracking" className="text-green-700 font-semibold hover:underline">
              Track your order
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">Order History</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#22c55e]">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">Orders</span>
        </div>
      </div>

      <div role="tablist" aria-label="Filter orders" className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {ORDER_TABS.map(({ key, label }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectTab(key)}
              className={cn(
                "shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-green-700 bg-green-700 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-800"
              )}
            >
              {label}
              {summary && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  )}
                >
                  {summary[key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-green-100/50 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-100" aria-busy="true" aria-label="Loading orders">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-6 flex items-start gap-4 animate-pulse">
                <div className="h-14 w-14 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded bg-gray-100" />
                  <div className="h-3 w-3/5 rounded bg-gray-100" />
                  <div className="h-3 w-2/5 rounded bg-gray-100" />
                </div>
                <div className="h-5 w-20 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : failed && orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
            <p className="text-gray-700 font-medium">We couldn't load your orders.</p>
            <Button variant="outline" onClick={loadFirstPage}>
              Try again
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <PackageOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">{EMPTY_COPY[tab].title}</p>
            <p className="text-sm text-gray-500 mt-1">{EMPTY_COPY[tab].hint}</p>
            {tab === "all" && (
              <Button asChild className="mt-5 bg-green-700 hover:bg-green-800">
                <Link href="/products">Browse products</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {hasMore && (
              <div className="p-4 border-t border-gray-100 text-center">
                <Button variant="outline" onClick={loadMore} disabled={loadingMore} className="rounded-xl">
                  {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load more"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex-1" />}>
        <OrderHistoryContent />
      </Suspense>
      <Footer />
    </div>
  );
}
