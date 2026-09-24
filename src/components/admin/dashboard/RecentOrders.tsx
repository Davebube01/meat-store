import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { DashboardOrder } from "@/core/api";
import { getStatusInfo, shortOrderId } from "@/lib/orderStatus";
import { naira } from "./format";

const timeAgo = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
};

export function RecentOrders({ orders }: { orders: DashboardOrder[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <p className="text-sm font-semibold text-gray-900">Recent orders</p>
        <Link href="/admin/orders" className="inline-flex items-center text-xs font-semibold text-[#3f7a55] hover:underline">
          View all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-gray-400">No orders yet. They&apos;ll show up here as they come in.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Status</th>
                <th className="hidden px-5 py-3 md:table-cell">Delivery</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => {
                const status = getStatusInfo(o);
                return (
                  <tr key={o.id} className="hover:bg-green-50/40">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-mono font-medium text-gray-900 hover:text-[#3f7a55]">
                        {shortOrderId(o.id)}
                      </Link>
                      <p className="text-xs text-gray-400">{timeAgo(o.created_at)}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{o.customer_name}</p>
                      <p className="text-xs text-gray-400">
                        {o.items_count} item{o.items_count === 1 ? "" : "s"}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3 text-gray-600 md:table-cell">
                      {o.delivery_method === "pickup" ? (
                        "Pickup"
                      ) : (
                        <>
                          <p className="truncate">{o.delivery_zone ?? "Delivery"}</p>
                          {o.time_slot && <p className="text-xs text-gray-400">{o.time_slot}</p>}
                        </>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-gray-900">{naira(o.total_amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
