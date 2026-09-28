"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, Boxes, Loader2, PackageCheck, PackageX, RefreshCw, TriangleAlert, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RestockDialog } from "@/components/admin/inventory/RestockDialog";
import { adjustProductStock, getAdminInventory, type MovementReason, type RestockItem } from "@/core/api";
import { getThumbnailUrl } from "@/lib/imageUrl";
import { shortOrderId } from "@/lib/orderStatus";

const PAGE = 30;

const REASONS: { key: MovementReason | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "order_placed", label: "Sales" },
  { key: "restock", label: "Restocks" },
  { key: "correction", label: "Corrections" },
  { key: "order_cancelled", label: "Cancellations" },
  { key: "initial_stock", label: "Initial stock" },
];

const REASON_STYLE: Record<string, { label: string; className: string }> = {
  order_placed: { label: "Sale", className: "bg-blue-50 text-blue-700" },
  order_cancelled: { label: "Cancellation return", className: "bg-purple-50 text-purple-700" },
  restock: { label: "Restock", className: "bg-green-50 text-green-700" },
  correction: { label: "Correction", className: "bg-amber-50 text-amber-700" },
  initial_stock: { label: "Initial stock", className: "bg-gray-100 text-gray-700" },
};

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const qty = (n: number) => Number(n.toFixed(2)).toLocaleString("en-NG");
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });

function Stat({ label, value, sub, icon: Icon, tone }: { label: string; value: React.ReactNode; sub: string; icon: React.ElementType; tone: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="text-[28px] font-bold leading-none tracking-tight tabular-nums text-gray-900">{value}</div>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function Runway({ item, threshold }: { item: RestockItem; threshold: number }) {
  const out = item.stock_quantity <= 0;
  const pct = out ? 3 : Math.max(6, Math.min(100, (item.stock_quantity / threshold) * 100));
  return (
    <div className="w-40">
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${out ? "bg-red-500" : "bg-amber-500"}`} style={{ width: `${pct}%` }} />
      </div>
      <p className={`mt-1.5 text-xs font-medium ${out ? "text-red-600" : "text-amber-700"}`}>
        {out
          ? "Out of stock"
          : item.days_left !== null
            ? `About ${item.days_left < 1 ? "less than a day" : `${Math.round(item.days_left)} day${Math.round(item.days_left) === 1 ? "" : "s"}`} left`
            : "No recent sales"}
      </p>
    </div>
  );
}

export default function AdminInventoryPage() {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState<MovementReason | "all">("all");
  const [limit, setLimit] = useState(PAGE);
  const [restocking, setRestocking] = useState<RestockItem | null>(null);
  const [restockError, setRestockError] = useState<string | null>(null);

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-inventory", reason, limit],
    queryFn: () => getAdminInventory({ reason: reason === "all" ? undefined : reason, limit }),
    placeholderData: keepPreviousData,
  });

  const restock = useMutation({
    mutationFn: ({ item, quantity, note }: { item: RestockItem; quantity: number; note: string }) =>
      adjustProductStock(item.id, { change: quantity, reason: "restock", note: note || undefined }),
    onSuccess: (product, { quantity }) => {
      toast.success(`Added ${quantity} to ${product.name}. Now ${product.stock_quantity} in stock.`);
      setRestocking(null);
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (err: Error) => setRestockError(err.message),
  });

  const pickReason = (r: MovementReason | "all") => {
    setReason(r);
    setLimit(PAGE);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Catalog</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">What&apos;s running low, and every stock change across the store.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {isPending ? (
        <div className="flex flex-col items-center justify-center p-24 text-gray-400">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-green-600" />
          <p>Loading inventory…</p>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-semibold">Couldn&apos;t load inventory</p>
            <p className="text-sm opacity-90">{(error as Error)?.message}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat
              label="In stock"
              value={data.summary.in_stock}
              sub={`of ${data.summary.active_products} active products`}
              icon={PackageCheck}
              tone="bg-green-50 text-[#3f7a55]"
            />
            <Stat
              label="Low stock"
              value={data.summary.low_stock}
              sub={`${data.summary.low_stock_threshold} or fewer left`}
              icon={TriangleAlert}
              tone="bg-amber-50 text-amber-600"
            />
            <Stat
              label="Out of stock"
              value={data.summary.out_of_stock}
              sub="Can't be ordered until restocked"
              icon={PackageX}
              tone="bg-red-50 text-red-600"
            />
            <Stat
              label="Stock value at cost"
              value={
                data.summary.products_without_cost < data.summary.active_products
                  ? naira(data.summary.stock_cost_value)
                  : "—"
              }
              sub={
                `${naira(data.summary.stock_value)} at selling prices` +
                (data.summary.products_without_cost > 0
                  ? ` · ${data.summary.products_without_cost} product${data.summary.products_without_cost === 1 ? "" : "s"} without a cost price`
                  : "")
              }
              icon={Wallet}
              tone="bg-green-50 text-[#3f7a55]"
            />
          </div>

          {/* Needs restock */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Needs restock</h2>
              <p className="text-xs text-gray-400">Most urgent first, based on the last 7 days of sales</p>
            </div>
            {data.needs_restock.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
                <PackageCheck className="h-8 w-8 text-green-500" />
                <p className="text-sm font-medium text-gray-700">All stocked up</p>
                <p className="text-xs text-gray-400">No active product is at or below {data.summary.low_stock_threshold}.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      <th className="px-5 py-3">Product</th>
                      <th className="px-5 py-3 text-right">In stock</th>
                      <th className="hidden px-5 py-3 text-right md:table-cell">Sold (7 days)</th>
                      <th className="px-5 py-3">Runway</th>
                      <th className="px-5 py-3 text-right"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.needs_restock.map((item) => (
                      <tr key={item.id} className="hover:bg-green-50/40">
                        <td className="px-5 py-3">
                          <Link href={`/admin/products/${item.slug}`} className="flex items-center gap-3">
                            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              <Image src={getThumbnailUrl(item.image_url, 80)} alt="" fill unoptimized className="object-cover" />
                            </span>
                            <span className="font-medium text-gray-900 hover:text-[#3f7a55]">{item.name}</span>
                          </Link>
                        </td>
                        <td className={`px-5 py-3 text-right font-semibold tabular-nums ${item.stock_quantity <= 0 ? "text-red-600" : "text-gray-900"}`}>
                          {qty(item.stock_quantity)}
                        </td>
                        <td className="hidden px-5 py-3 text-right tabular-nums text-gray-600 md:table-cell">{qty(item.sold_last_7_days)}</td>
                        <td className="px-5 py-3">
                          <Runway item={item} threshold={data.summary.low_stock_threshold} />
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Button
                            size="sm"
                            className="bg-[#3f7a55] hover:bg-[#2d583d]"
                            onClick={() => {
                              setRestockError(null);
                              setRestocking(item);
                            }}
                          >
                            Restock
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Movement log */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Stock log</h2>
                <p className="text-xs text-gray-400">{data.movements_total} change{data.movements_total === 1 ? "" : "s"}</p>
              </div>
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter stock changes">
                {REASONS.map((r) => (
                  <button
                    key={r.key}
                    role="tab"
                    aria-selected={reason === r.key}
                    onClick={() => pickReason(r.key)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      reason === r.key
                        ? "border-[#3f7a55] bg-[#3f7a55] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {data.movements.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
                <Boxes className="h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-400">No stock changes here yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      <th className="px-5 py-3">When</th>
                      <th className="px-5 py-3">Product</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3 text-right">Change</th>
                      <th className="hidden px-5 py-3 text-right md:table-cell">Stock after</th>
                      <th className="hidden px-5 py-3 lg:table-cell">By / note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.movements.map((m) => {
                      const style = REASON_STYLE[m.reason] ?? { label: m.reason, className: "bg-gray-100 text-gray-700" };
                      return (
                        <tr key={m.id}>
                          <td className="whitespace-nowrap px-5 py-3 text-gray-500">{when(m.created_at)}</td>
                          <td className="px-5 py-3">
                            {m.product_slug ? (
                              <Link href={`/admin/products/${m.product_slug}`} className="font-medium text-gray-900 hover:text-[#3f7a55]">
                                {m.product_name}
                              </Link>
                            ) : (
                              <span className="font-medium text-gray-900">{m.product_name}</span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.className}`}>{style.label}</span>
                          </td>
                          <td className={`px-5 py-3 text-right font-semibold tabular-nums ${m.change > 0 ? "text-green-700" : "text-red-600"}`}>
                            {m.change > 0 ? "+" : "−"}
                            {qty(Math.abs(m.change))}
                          </td>
                          <td className="hidden px-5 py-3 text-right tabular-nums text-gray-600 md:table-cell">{qty(m.new_quantity)}</td>
                          <td className="hidden max-w-xs px-5 py-3 text-gray-500 lg:table-cell">
                            {m.order_id ? (
                              <Link href={`/admin/orders/${m.order_id}`} className="font-mono text-xs text-gray-700 hover:text-[#3f7a55]">
                                Order {shortOrderId(m.order_id)}
                              </Link>
                            ) : (
                              <span className="text-xs">{m.admin_name ?? "—"}</span>
                            )}
                            {m.note && <p className="truncate text-xs text-gray-400" title={m.note}>{m.note}</p>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {data.movements.length < data.movements_total && (
              <div className="border-t border-gray-100 p-3 text-center">
                <Button variant="ghost" size="sm" disabled={isFetching} onClick={() => setLimit((l) => l + PAGE)}>
                  {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Show more ({data.movements_total - data.movements.length} older)
                </Button>
              </div>
            )}
          </section>
        </>
      )}

      <RestockDialog
        key={restocking?.id ?? "none"}
        item={restocking}
        saving={restock.isPending}
        error={restockError}
        onClose={() => setRestocking(null)}
        onSubmit={(quantity, note) => {
          if (!restocking) return;
          setRestockError(null);
          restock.mutate({ item: restocking, quantity, note });
        }}
      />
    </div>
  );
}
