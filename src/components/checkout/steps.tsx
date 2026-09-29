"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Banknote, Check, ChevronRight, Clock, CreditCard, Info, Loader2, Lock, MapPin, Store, Truck, UserRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SignInModal } from "@/components/SignInModal";
import { cn } from "@/lib/utils";
import type { DeliveryZone } from "@/core/api/user/delivery";
import type { StoreInfo } from "@/core/api/user/store";
import type { SavedAddress } from "@/core/api/user/account";
import { bookingDates, dayLabel, hasOpenSlot, longDate, slotsFor } from "./slots";

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

/* ------------------------------------------------------------------ shell */

export function StepCard({ n, title, state, summary, onEdit, children }: {
  n: number;
  title: string;
  state: "active" | "done" | "upcoming";
  summary?: React.ReactNode;
  onEdit?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <section
      aria-current={state === "active" ? "step" : undefined}
      className={cn("rounded-2xl border bg-white", state === "active" ? "border-gray-200 shadow-sm" : "border-gray-100")}
    >
      <div className="flex items-center gap-3 px-5 py-4 md:px-6">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            state === "done" && "bg-[#dcebe1] text-[#2d583d]",
            state === "active" && "bg-[#3f7a55] text-white",
            state === "upcoming" && "border border-gray-200 text-gray-400",
          )}
        >
          {state === "done" ? <Check className="h-4 w-4" /> : n}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={cn("font-semibold", state === "upcoming" ? "text-gray-400" : "text-gray-900")}>{title}</h2>
          {state === "done" && summary && <div className="truncate text-sm text-gray-500">{summary}</div>}
        </div>
        {state === "done" && onEdit && (
          <button type="button" onClick={onEdit} className="text-sm font-semibold text-[#3f7a55] hover:underline">
            Edit
          </button>
        )}
      </div>
      {state === "active" && <div className="border-t border-gray-100 px-5 py-5 md:px-6">{children}</div>}
    </section>
  );
}

function FieldError({ children }: { children?: string }) {
  return children ? <p className="text-xs font-medium text-red-600">{children}</p> : null;
}

function Primary({ children, disabled, loading }: { children: React.ReactNode; disabled?: boolean; loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-6 font-semibold text-white shadow-lg shadow-green-500/25 transition-colors hover:bg-[#16a34a] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none sm:w-auto"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------- contact */

export interface ContactValues {
  fullName: string;
  email: string;
  phone: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactStep({ initial, signedInEmail, onSubmit }: {
  initial: ContactValues;
  /** Set when signed in: the order is tied to this account's email. */
  signedInEmail?: string;
  onSubmit: (v: ContactValues) => void;
}) {
  const [v, setV] = useState<ContactValues>(initial);
  const [tried, setTried] = useState(false);

  const errors = {
    fullName: v.fullName.trim().length < 2 ? "Enter your full name" : undefined,
    email: signedInEmail ? undefined : !EMAIL_RE.test(v.email.trim()) ? "Enter a valid email so we can send your receipt" : undefined,
    phone: v.phone.replace(/\D/g, "").length < 10 ? "Enter a phone number the courier can reach" : undefined,
  };
  const valid = !errors.fullName && !errors.email && !errors.phone;

  const form = (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (valid) onSubmit({ fullName: v.fullName.trim(), email: (signedInEmail ?? v.email).trim(), phone: v.phone.trim() });
      }}
    >
      {signedInEmail && (
        <p className="flex items-center gap-2 rounded-xl bg-[#f4f7f5] px-4 py-3 text-sm text-gray-700">
          <UserRound className="h-4 w-4 text-[#3f7a55]" /> Signed in as <b className="truncate">{signedInEmail}</b>
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" autoComplete="name" value={v.fullName} onChange={(e) => setV({ ...v, fullName: e.target.value })} aria-invalid={tried && !!errors.fullName} />
        {tried && <FieldError>{errors.fullName}</FieldError>}
      </div>
      {!signedInEmail && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={v.email} placeholder="you@example.com" onChange={(e) => setV({ ...v, email: e.target.value })} aria-invalid={tried && !!errors.email} />
          {tried ? <FieldError>{errors.email}</FieldError> : <p className="text-xs text-gray-500">For your receipt and order updates.</p>}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" autoComplete="tel" inputMode="tel" value={v.phone} placeholder="0803 000 0000" onChange={(e) => setV({ ...v, phone: e.target.value })} aria-invalid={tried && !!errors.phone} />
        {tried && <FieldError>{errors.phone}</FieldError>}
      </div>
      <div className="flex justify-end pt-2">
        <Primary>
          Continue to delivery <ChevronRight className="h-4 w-4" />
        </Primary>
      </div>
    </form>
  );

  if (signedInEmail) return form;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div>
        <p className="mb-4 text-sm text-gray-500">Checking out as a guest. No account needed.</p>
        {form}
      </div>
      <aside className="h-fit rounded-xl border border-gray-200 bg-[#f4f7f5] p-4">
        <p className="font-semibold text-gray-900">Have an account?</p>
        <p className="mt-1 text-sm text-gray-600">Sign in to fill this in for you and keep your orders in one place.</p>
        <SignInModal>
          <button type="button" className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#3f7a55] bg-white text-sm font-semibold text-[#2d583d] hover:bg-green-50">
            Sign in
          </button>
        </SignInModal>
      </aside>
    </div>
  );
}

/* --------------------------------------------------------------- delivery */

export interface DeliveryValues {
  method: "delivery" | "pickup";
  deliveryZone: string;
  deliveryFee: number;
  address: string;
  apartment: string;
  landmark: string;
  instructions: string;
  deliveryDate: string;
  timeSlot: string;
}

export function DeliveryStep({ initial, zones, zonesError, store, saved = [], onBack, onSubmit }: {
  initial: DeliveryValues;
  zones: DeliveryZone[] | undefined;
  zonesError: boolean;
  store: StoreInfo | undefined;
  /** Signed-in customer's saved addresses (only ones we still deliver to). */
  saved?: SavedAddress[];
  onBack: () => void;
  onSubmit: (v: DeliveryValues) => void;
}) {
  const usable = saved.filter((a) => a.zone_fee !== null);
  const fromSaved = (a: SavedAddress): Partial<DeliveryValues> => ({
    deliveryZone: a.zone_id,
    deliveryFee: a.zone_fee ?? 0,
    address: a.address,
    apartment: a.apartment ?? "",
    landmark: a.landmark ?? "",
    instructions: a.instructions ?? "",
  });
  // Nothing typed yet: start from the default saved address.
  const [v, setV] = useState<DeliveryValues>(() => {
    const def = usable.find((a) => a.is_default);
    return def && !initial.address ? { ...initial, ...fromSaved(def) } : initial;
  });
  const [tried, setTried] = useState(false);
  const dates = useMemo(() => bookingDates(), []);
  const slots = slotsFor(v.deliveryDate);
  const cheapest = zones?.length ? Math.min(...zones.map((z) => z.estimated_fee)) : null;
  const set = (patch: Partial<DeliveryValues>) => setV((p) => ({ ...p, ...patch }));

  // A remembered date/slot from an earlier visit may have passed: drop it.
  useEffect(() => {
    if (!v.deliveryDate) return;
    const stale = new Date(v.deliveryDate).toDateString() !== new Date().toDateString() && new Date(v.deliveryDate) < new Date();
    const slotGone = v.timeSlot && slotsFor(v.deliveryDate).find((s) => s.text === v.timeSlot)?.closed;
    if (stale) set({ deliveryDate: "", timeSlot: "" });
    else if (slotGone) set({ timeSlot: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const delivery = v.method === "delivery";
  const errors = delivery
    ? {
        zone: !v.deliveryZone ? "Choose your area" : undefined,
        address: v.address.trim().length < 5 ? "Enter your street address" : undefined,
        date: !v.deliveryDate ? "Choose a delivery day" : undefined,
        slot: v.deliveryDate && !v.timeSlot ? "Choose a delivery time" : undefined,
      }
    : {};
  const valid = !Object.values(errors).some(Boolean);

  return (
    <form
      noValidate
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (valid) onSubmit(v);
      }}
    >
      {/* Method */}
      <div role="radiogroup" aria-label="Delivery method" className="grid gap-3 sm:grid-cols-2">
        {([
          { key: "delivery", icon: Truck, title: "Home delivery", sub: "Pick a day and a 1-hour slot", tag: cheapest !== null ? `from ${naira(cheapest)} · cash` : undefined },
          { key: "pickup", icon: Store, title: "Pickup", sub: "Collect it from our shop", tag: "Free" },
        ] as const).map((m) => {
          const on = v.method === m.key;
          return (
            <button
              key={m.key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => set({ method: m.key })}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                on ? "border-[#3f7a55] bg-[#f4f7f5]" : "border-gray-200 hover:border-gray-300",
              )}
            >
              <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", on ? "border-[#3f7a55]" : "border-gray-300")}>
                {on && <span className="h-2.5 w-2.5 rounded-full bg-[#3f7a55]" />}
              </span>
              <m.icon className={cn("h-5 w-5 shrink-0", on ? "text-[#3f7a55]" : "text-gray-400")} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-gray-900">{m.title}</span>
                <span className="block text-xs text-gray-500">{m.sub}</span>
              </span>
              {m.tag && <span className={cn("shrink-0 text-xs font-semibold", m.key === "pickup" ? "text-[#16a34a]" : "text-gray-500")}>{m.tag}</span>}
            </button>
          );
        })}
      </div>

      {delivery ? (
        <>
          {usable.length > 0 && (
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-gray-900">Your saved addresses</legend>
              <div className="flex flex-wrap gap-2">
                {usable.map((a) => {
                  const on = v.address === a.address && v.deliveryZone === a.zone_id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set(fromSaved(a))}
                      className={cn(
                        "flex max-w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        on ? "border-[#3f7a55] bg-[#f4f7f5] ring-1 ring-[#3f7a55]" : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <MapPin className={cn("h-4 w-4 shrink-0", on ? "text-[#3f7a55]" : "text-gray-400")} />
                      <span className="min-w-0">
                        <span className="block font-medium text-gray-900">{a.label}</span>
                        <span className="block max-w-[220px] truncate text-xs text-gray-500">{a.address}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Zone */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-gray-900">Your area</legend>
            {zonesError ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Couldn&apos;t load delivery areas. Refresh the page to try again.</p>
            ) : !zones ? (
              <p className="flex items-center gap-2 text-sm text-gray-400"><Loader2 className="h-4 w-4 animate-spin" /> Loading areas…</p>
            ) : (
              <div role="radiogroup" aria-label="Delivery area" className="grid gap-2 sm:grid-cols-2">
                {zones.map((z) => {
                  const on = v.deliveryZone === z.id;
                  return (
                    <button
                      key={z.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => set({ deliveryZone: z.id, deliveryFee: z.estimated_fee })}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                        on ? "border-[#3f7a55] bg-[#f4f7f5] ring-1 ring-[#3f7a55]" : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <MapPin className={cn("h-4 w-4 shrink-0", on ? "text-[#3f7a55]" : "text-gray-400")} />
                      <span className="min-w-0 flex-1 truncate font-medium text-gray-800" title={z.name}>{z.name}</span>
                      <span className="shrink-0 text-xs tabular-nums text-gray-500">{naira(z.estimated_fee)}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {tried && <FieldError>{errors.zone}</FieldError>}
            <p className="flex gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-xs text-blue-900">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              The delivery fee is an estimate you pay the courier in cash when your order arrives. Only your items are charged online.
            </p>
          </fieldset>

          {/* Address */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-gray-900">Address</legend>
            <div className="space-y-2">
              <Label htmlFor="address">Street address</Label>
              <Input id="address" autoComplete="street-address" value={v.address} placeholder="e.g. Plot 7, Adetokunbo Ademola Crescent" onChange={(e) => set({ address: e.target.value })} aria-invalid={tried && !!errors.address} />
              {tried && <FieldError>{errors.address}</FieldError>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="apartment">Flat / house no. <span className="font-normal text-gray-400">(optional)</span></Label>
                <Input id="apartment" value={v.apartment} onChange={(e) => set({ apartment: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark">Nearest landmark <span className="font-normal text-gray-400">(optional)</span></Label>
                <Input id="landmark" value={v.landmark} placeholder="e.g. opposite Banex Plaza" onChange={(e) => set({ landmark: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Note for the courier <span className="font-normal text-gray-400">(optional)</span></Label>
              <Textarea id="instructions" rows={2} maxLength={160} value={v.instructions} placeholder="Gate code, which floor, who to call…" onChange={(e) => set({ instructions: e.target.value })} />
              <p className="text-right text-xs text-gray-400">{v.instructions.length}/160</p>
            </div>
          </fieldset>

          {/* Date + slot */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-gray-900">When</legend>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="radiogroup" aria-label="Delivery day">
              {dates.map((d) => {
                const iso = d.toISOString();
                const open = hasOpenSlot(iso);
                const on = !!v.deliveryDate && new Date(v.deliveryDate).toDateString() === d.toDateString();
                return (
                  <button
                    key={iso}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    disabled={!open}
                    onClick={() => set({ deliveryDate: iso, timeSlot: "" })}
                    className={cn(
                      "flex w-16 shrink-0 flex-col items-center rounded-xl border py-2 transition-colors",
                      on ? "border-[#3f7a55] bg-[#3f7a55] text-white" : open ? "border-gray-200 hover:border-gray-300" : "border-gray-100 bg-gray-50 text-gray-300",
                    )}
                  >
                    <span className={cn("text-[11px] font-medium", on ? "text-white/80" : "text-gray-500", !open && "text-gray-300")}>{dayLabel(d)}</span>
                    <span className="text-lg font-semibold leading-tight">{d.getDate()}</span>
                    <span className={cn("text-[10px]", on ? "text-white/80" : "text-gray-400")}>{d.toLocaleDateString("en-NG", { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            {tried && <FieldError>{errors.date}</FieldError>}

            {v.deliveryDate && (
              <>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-[#3f7a55]" /> Times for {longDate(v.deliveryDate)}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4" role="radiogroup" aria-label="Delivery time">
                  {slots.map((s) => {
                    const on = v.timeSlot === s.text;
                    return (
                      <button
                        key={s.text}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        disabled={s.closed}
                        onClick={() => set({ timeSlot: s.text })}
                        className={cn(
                          "rounded-lg border px-2 py-2.5 text-sm font-medium tabular-nums transition-colors",
                          on ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d] ring-1 ring-[#3f7a55]" : s.closed ? "border-gray-100 bg-gray-50 text-gray-300 line-through" : "border-gray-200 text-gray-700 hover:border-gray-300",
                        )}
                      >
                        {s.text.replace(" - ", "–")}
                      </button>
                    );
                  })}
                </div>
                {tried && <FieldError>{errors.slot}</FieldError>}
                <p className="text-xs text-gray-500">Mon–Sat 8am–7pm, Sun 10am–4pm. Same-day slots need about an hour&apos;s notice.</p>
              </>
            )}
          </fieldset>
        </>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-[#f4f7f5] p-5">
          <p className="flex items-center gap-2 font-semibold text-gray-900">
            <Store className="h-5 w-5 text-[#3f7a55]" /> Collect from {store?.store_name ?? "our shop"}
          </p>
          {store?.pickup_address && <p className="mt-2 text-sm text-gray-700">{store.pickup_address}</p>}
          {store?.pickup_instructions && <p className="mt-1 whitespace-pre-line text-sm text-gray-500">{store.pickup_instructions}</p>}
          <p className="mt-3 text-sm text-gray-600">
            We&apos;ll prepare your order and let you know when it&apos;s ready. Bring your order number when you come.
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
        <button type="button" onClick={onBack} className="h-12 rounded-xl px-4 text-sm font-semibold text-gray-600 hover:bg-gray-100">
          Back
        </button>
        <Primary>
          Continue to review <ChevronRight className="h-4 w-4" />
        </Primary>
      </div>
    </form>
  );
}

/* ----------------------------------------------------------------- review */

export type PaymentChoice = "paystack" | "cod";

export function ReviewStep({ pickup, total, payment, onPayment, placing, onBack, onPlace }: {
  pickup: boolean;
  total: number;
  payment: PaymentChoice;
  onPayment: (p: PaymentChoice) => void;
  placing: boolean;
  onBack: () => void;
  onPlace: () => void;
}) {
  const options = [
    { key: "paystack" as const, icon: CreditCard, title: "Pay online", sub: "Card, bank transfer or USSD, secured by Paystack" },
    { key: "cod" as const, icon: Banknote, title: pickup ? "Pay at pickup" : "Pay on delivery", sub: pickup ? "Pay in cash when you collect" : "Pay the courier in cash when it arrives" },
  ];

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!placing) onPlace();
      }}
    >
      <div role="radiogroup" aria-label="Payment method" className="space-y-3">
        {options.map((o) => {
          const on = payment === o.key;
          return (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onPayment(o.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                on ? "border-[#3f7a55] bg-[#f4f7f5]" : "border-gray-200 hover:border-gray-300",
              )}
            >
              <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", on ? "border-[#3f7a55]" : "border-gray-300")}>
                {on && <span className="h-2.5 w-2.5 rounded-full bg-[#3f7a55]" />}
              </span>
              <o.icon className={cn("h-5 w-5 shrink-0", on ? "text-[#3f7a55]" : "text-gray-400")} />
              <span>
                <span className="block font-semibold text-gray-900">{o.title}</span>
                <span className="block text-xs text-gray-500">{o.sub}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onBack} disabled={placing} className="h-12 rounded-xl px-4 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50">
          Back
        </button>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <Primary loading={placing}>
            {payment === "paystack" ? (
              <>
                <Lock className="h-4 w-4" /> {placing ? "Opening payment…" : `Pay ${naira(total)}`}
              </>
            ) : placing ? (
              "Placing order…"
            ) : (
              "Place order"
            )}
          </Primary>
          <p className="text-center text-xs text-gray-500 sm:text-right">
            {payment === "paystack"
              ? "You'll finish paying in a secure Paystack window."
              : pickup
                ? `You'll pay ${naira(total)} in cash at pickup.`
                : `You'll pay ${naira(total)} for your items plus the delivery fee, in cash on delivery.`}
          </p>
          <p className="text-center text-xs text-gray-400 sm:text-right">
            By placing your order you agree to our{" "}
            <Link href="/terms" target="_blank" className="underline underline-offset-2 hover:text-gray-600">terms</Link> and{" "}
            <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-gray-600">privacy policy</Link>.
          </p>
        </div>
      </div>
    </form>
  );
}
