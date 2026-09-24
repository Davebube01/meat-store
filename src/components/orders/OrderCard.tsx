"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Store, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getThumbnailUrl } from "@/lib/imageUrl";
import { getStatusInfo, isFinished, isUnpaid, shortOrderId } from "@/lib/orderStatus";
import type { UserOrder } from "@/core/api/user/orders";

const MAX_THUMBS = 2;

export function OrderCard({ order }: { order: UserOrder }) {
  const status = getStatusInfo(order);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const thumbs = order.items.slice(0, MAX_THUMBS);
  const extra = order.items.length - thumbs.length;
  const summary = order.items.map((item) => `${item.product?.name ?? "Item"} × ${item.quantity}`).join(", ");
  const pickup = order.delivery_method === "pickup";
  const payable = isUnpaid(order.status) && order.payment_method !== "cod";

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group block p-5 sm:p-6 hover:bg-green-50/40 transition-colors focus-visible:outline-none focus-visible:bg-green-50/60"
    >
      {/* Stacked on phones (details, then price + action); side by side from `sm` up. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex min-w-0 items-start gap-4 sm:flex-1">
          <div className="flex -space-x-3 shrink-0" aria-hidden>
            {thumbs.map((item) => (
              <div key={item.id} className="relative h-14 w-14 rounded-xl overflow-hidden border-2 border-white bg-gray-100 shadow-sm">
                <Image src={getThumbnailUrl(item.product?.image_url)} alt="" fill unoptimized className="object-cover" />
              </div>
            ))}
            {extra > 0 && (
              <div className="relative h-14 w-14 rounded-xl border-2 border-white bg-gray-100 shadow-sm flex items-center justify-center text-xs font-semibold text-gray-600">
                +{extra}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-bold text-gray-900">{shortOrderId(order.id)}</span>
              <Badge className={cn("shadow-none border text-xs", status.className)}>{status.label}</Badge>
            </div>

            <p className="mt-1 text-sm text-gray-700 truncate">{summary}</p>

            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
              <span>{new Date(order.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>
              <span aria-hidden>•</span>
              <span>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <span aria-hidden>•</span>
              <span className="inline-flex items-center gap-1">
                {pickup ? <Store className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
                {pickup ? "Pickup" : "Delivery"}
              </span>
            </p>

            {order.status === "cancelled" && (
              <p className="mt-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
                <span className="font-medium">Reason:</span> {order.cancellation_reason || "Reason not recorded"}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-gray-100 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
          <span className="font-bold text-gray-900 text-lg">₦{order.total_amount.toLocaleString()}</span>
          <span className={cn("inline-flex items-center gap-0.5 text-sm font-medium group-hover:underline", payable ? "text-orange-700 font-semibold" : "text-green-700")}>
            {payable ? "Pay now" : isFinished(order.status) ? "View details" : "Track order"}
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
