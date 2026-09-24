import Link from "next/link";
import { ChevronRight, Clock, Truck } from "lucide-react";
import type { SlotGroup } from "@/core/api";
import { shortOrderId } from "@/lib/orderStatus";
import { statusMeta } from "./format";

const STATE_STYLE: Record<SlotGroup["state"], { row: string; tag?: { text: string; className: string } }> = {
  overdue: { row: "bg-red-50/60 border-red-100", tag: { text: "Past slot", className: "text-red-600" } },
  now: { row: "bg-green-50/60 border-green-100", tag: { text: "Now", className: "text-green-700" } },
  done: { row: "border-gray-100", tag: { text: "Done", className: "text-gray-400" } },
  upcoming: { row: "border-gray-100" },
};

export function TodaysDeliveries({ slots }: { slots: SlotGroup[] }) {
  const orders = slots.reduce((n, s) => n + s.orders.length, 0);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">Today&apos;s deliveries</p>
          <p className="text-xs text-gray-400">
            {orders} order{orders === 1 ? "" : "s"} across {slots.length} slot{slots.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/admin/orders" className="inline-flex items-center text-xs font-semibold text-[#3f7a55] hover:underline">
          All orders <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {slots.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-12 text-center">
          <Truck className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-400">No deliveries booked for today</p>
        </div>
      ) : (
        <ul className="flex-1 space-y-2 p-3">
          {slots.map((slot) => {
            const style = STATE_STYLE[slot.state];
            return (
              <li key={slot.time_slot} className={`rounded-xl border px-3 py-2.5 ${style.row}`}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-gray-700">{slot.time_slot}</span>
                  {style.tag && (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${style.tag.className}`}>
                      {slot.state === "overdue" && <Clock className="h-3 w-3" />}
                      {style.tag.text}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {slot.orders.map((o) => (
                    <Link
                      key={o.id}
                      href={`/admin/orders/${o.id}`}
                      title={`${o.customer_name} · ${o.delivery_zone ?? ""}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs hover:border-[#3f7a55]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusMeta(o.status).color }} />
                      <span className="font-mono">{shortOrderId(o.id)}</span>
                      <span className="max-w-[110px] truncate text-gray-500">{o.delivery_zone}</span>
                    </Link>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
