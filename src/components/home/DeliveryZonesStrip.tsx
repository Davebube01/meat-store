import { Banknote, MapPin, Store } from "lucide-react";
import type { DeliveryZone } from "@/core/api/user/delivery";

/** Where we deliver and the estimated courier fee, straight from the delivery zones API. */
export function DeliveryZonesStrip({ zones }: { zones: DeliveryZone[] }) {
  if (zones.length === 0) return null;
  const sorted = [...zones].sort((a, b) => a.estimated_fee - b.estimated_fee);

  return (
    <section id="delivery" className="scroll-mt-20 bg-[#2d4d3a] py-16 text-white md:py-20">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#86efac]">Delivery zones</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">Where we deliver</h2>
          <p className="mt-4 text-[#c9d8ce]">
            Your delivery fee depends on your area. It&apos;s an estimate, and you pay it in cash to the courier. Only your items are charged online.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex items-center gap-2 text-[#e7f3eb]">
              <Banknote className="h-4 w-4 text-[#86efac]" /> Delivery fee paid in cash on arrival
            </p>
            <p className="flex items-center gap-2 text-[#e7f3eb]">
              <Store className="h-4 w-4 text-[#86efac]" /> Pickup is always free
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8">
          {sorted.map((z) => (
            <li key={z.id} className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.06] px-4 py-3.5 ring-1 ring-white/10">
              <span className="flex min-w-0 items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#86efac]" />
                <span className="truncate text-sm font-medium" title={z.name}>{z.name}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums">₦{z.estimated_fee.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
