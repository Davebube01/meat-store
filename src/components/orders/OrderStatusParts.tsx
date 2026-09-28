"use client";

import { Bike, KeyRound, Phone } from "lucide-react";
import type { UserOrder } from "@/core/api/user/orders";
import { cn } from "@/lib/utils";
import { orderSteps } from "./orderStatusText";

// Shared by the customer order page and guest order tracking, so both tell
// the same story about an order.

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export function OrderProgress({ order }: { order: UserOrder }) {
  return (
    <ol className="grid grid-cols-5 px-3 py-5 md:px-6">
      {orderSteps(order).map((s, i) => (
        <li key={s.label} className="relative flex flex-col items-center text-center">
          {i > 0 && <span className={cn("absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2", s.done || s.current ? "bg-[#3f7a55]" : "bg-gray-200")} aria-hidden />}
          <span
            className={cn(
              "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
              s.done ? "bg-[#3f7a55] text-white" : s.current ? "bg-[#22c55e] text-white ring-4 ring-green-100" : "bg-gray-100 text-gray-300",
            )}
          >
            <s.icon className="h-4 w-4" />
          </span>
          <span className={cn("mt-2 text-[11px] font-medium leading-tight sm:text-xs", s.done || s.current ? "text-gray-900" : "text-gray-400")}>{s.label}</span>
          {s.at && s.done && (
            <span className="mt-0.5 hidden text-[10px] text-gray-400 sm:block">
              {new Date(s.at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/** The delivery PIN and the courier, once the order is out for delivery. */
export function PinAndCourier({ order }: { order: UserOrder }) {
  const d = order.delivery;
  if (!d?.delivery_pin || order.status !== "in_transit") return null;
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl bg-[#1f3a2a] p-5 text-white">
        <p className="flex items-center gap-2 text-sm text-[#a9bfb1]"><KeyRound className="h-4 w-4" /> Your delivery PIN</p>
        <p className="mt-2 font-mono text-4xl font-bold tracking-[0.35em]">{d.delivery_pin}</p>
        <p className="mt-2 text-xs text-[#c9d8ce]">Give it to the courier only when your order is in your hands. It&apos;s how we know you received it.</p>
      </div>
      {d.courier_name && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="flex items-center gap-2 text-sm text-gray-500"><Bike className="h-4 w-4 text-[#3f7a55]" /> Your courier</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{d.courier_name}</p>
          {d.courier_service && <p className="text-sm text-gray-500">{d.courier_service}</p>}
          {d.courier_phone && (
            <a href={`tel:${d.courier_phone}`} className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-[#3f7a55] px-4 text-sm font-semibold text-white hover:bg-[#2d583d]">
              <Phone className="h-4 w-4" /> Call {d.courier_phone}
            </a>
          )}
          <p className="mt-3 text-xs text-gray-500">Pay the delivery fee ({naira(order.delivery_fee)} est.) to them in cash.</p>
        </div>
      )}
    </section>
  );
}
