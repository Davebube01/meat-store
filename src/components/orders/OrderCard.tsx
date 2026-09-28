"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Clock, KeyRound, RotateCcw, Store, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { getThumbnailUrl } from "@/lib/imageUrl";
import { getStatusInfo, isFinished, isUnpaid, shortOrderId } from "@/lib/orderStatus";
import type { UserOrder } from "@/core/api/user/orders";
import { buyAgain } from "./buyAgain";
import { longDay } from "./orderStatusText";

const MAX_THUMBS = 3;
const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export function OrderCard({ order }: { order: UserOrder }) {
  const router = useRouter();
  const status = getStatusInfo(order);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const thumbs = order.items.slice(0, MAX_THUMBS);
  const extra = order.items.length - thumbs.length;
  const names = order.items.map((i) => i.product?.name ?? "Item").join(", ");
  const pickup = order.delivery_method === "pickup";
  const payable = isUnpaid(order.status) && order.payment_method !== "cod";
  const outWithPin = order.status === "in_transit" && !!order.delivery?.delivery_pin;
  const slot = !pickup && order.delivery?.time_slot && !isFinished(order.status)
    ? `${longDay(order.delivery.delivery_date)}, ${order.delivery.time_slot}`
    : null;
  const href = `/orders/${order.id}`;

  return (
    <article className="group relative p-5 transition-colors hover:bg-[#f4f7f5]/60 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex shrink-0 -space-x-3" aria-hidden>
          {thumbs.map((item) => (
            <span key={item.id} className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-white bg-gray-100 shadow-sm">
              <Image src={getThumbnailUrl(item.product?.image_url, 112)} alt="" fill unoptimized className="object-cover" />
            </span>
          ))}
          {extra > 0 && (
            <span className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-white bg-gray-100 text-xs font-semibold text-gray-600 shadow-sm">
              +{extra}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href={href} className="font-mono font-semibold text-gray-900 after:absolute after:inset-0 hover:text-[#3f7a55]">
              {shortOrderId(order.id)}
            </Link>
            <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", status.className)}>{status.label}</span>
          </div>
          <p className="mt-1 truncate text-sm text-gray-700">{names}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
            <span>{new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span aria-hidden>·</span>
            <span>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              {pickup ? <Store className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />} {pickup ? "Pickup" : "Delivery"}
            </span>
          </p>
          {slot && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#2d583d]">
              <Clock className="h-3.5 w-3.5" /> {slot}
            </p>
          )}
          {outWithPin && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-[#1f3a2a] px-2 py-1 text-xs font-medium text-white">
              <KeyRound className="h-3.5 w-3.5" /> PIN {order.delivery!.delivery_pin}
            </p>
          )}
          {order.status === "cancelled" && order.cancellation_reason && (
            <p className="mt-1.5 text-xs text-red-700">Cancelled: {order.cancellation_reason}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
          <span className="text-lg font-bold tabular-nums text-gray-900">{naira(order.total_amount)}</span>
          {order.status === "delivered" ? (
            <button
              type="button"
              onClick={() => {
                if (buyAgain(order)) router.push("/cart");
              }}
              className="relative z-10 inline-flex items-center gap-1.5 rounded-lg border border-[#3f7a55] px-3 py-1.5 text-sm font-semibold text-[#2d583d] hover:bg-[#f4f7f5]"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Buy again
            </button>
          ) : (
            <span className={cn("inline-flex items-center gap-0.5 text-sm font-semibold", payable ? "text-orange-700" : "text-[#3f7a55]")}>
              {payable ? "Pay now" : isFinished(order.status) ? "View details" : "Track order"}
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
