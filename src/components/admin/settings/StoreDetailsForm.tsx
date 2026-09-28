"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { StoreDetails } from "@/core/api";

interface Props {
  initial: StoreDetails;
  saving: boolean;
  error: string | null;
  onSave: (values: StoreDetails) => void;
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

/** Keyed by the parent on the saved values, so it resets after each save. */
export function StoreDetailsForm({ initial, saving, error, onSave }: Props) {
  const [v, setV] = useState<StoreDetails>(initial);
  const set = <K extends keyof StoreDetails>(key: K, value: StoreDetails[K]) => setV((prev) => ({ ...prev, [key]: value }));
  const dirty = JSON.stringify(v) !== JSON.stringify(initial);
  const thresholdOk = Number.isFinite(v.low_stock_threshold) && v.low_stock_threshold >= 0;

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (dirty && thresholdOk && !saving) onSave(v);
      }}
    >
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">Store</h2>
        <p className="mt-1 text-sm text-gray-500">Shown to customers on the store and in order emails.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field id="store_name" label="Store name">
            <Input id="store_name" value={v.store_name} maxLength={80} onChange={(e) => set("store_name", e.target.value)} />
          </Field>
          <Field id="contact_email" label="Contact email">
            <Input id="contact_email" type="email" value={v.contact_email ?? ""} placeholder="hello@yourstore.ng" onChange={(e) => set("contact_email", e.target.value)} />
          </Field>
          <Field id="contact_phone" label="Phone">
            <Input id="contact_phone" type="tel" value={v.contact_phone ?? ""} placeholder="0803 000 0000" maxLength={30} onChange={(e) => set("contact_phone", e.target.value)} />
          </Field>
          <Field id="whatsapp_number" label="WhatsApp" hint="Leave blank if it's the same as your phone.">
            <Input id="whatsapp_number" type="tel" value={v.whatsapp_number ?? ""} maxLength={30} onChange={(e) => set("whatsapp_number", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field id="address" label="Business address">
              <Input id="address" value={v.address ?? ""} maxLength={200} onChange={(e) => set("address", e.target.value)} />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">Pickup</h2>
        <p className="mt-1 text-sm text-gray-500">Where customers collect orders when they choose pickup at checkout.</p>
        <div className="mt-5 grid grid-cols-1 gap-5">
          <Field id="pickup_address" label="Pickup address">
            <Input id="pickup_address" value={v.pickup_address ?? ""} maxLength={200} placeholder="e.g. Plot 12, Aminu Kano Crescent, Wuse 2" onChange={(e) => set("pickup_address", e.target.value)} />
          </Field>
          <Field id="pickup_instructions" label="Pickup instructions">
            <Textarea id="pickup_instructions" rows={3} maxLength={500} value={v.pickup_instructions ?? ""} placeholder="Opening hours, where to park, who to ask for…" onChange={(e) => set("pickup_instructions", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">Stock alerts</h2>
        <div className="mt-5 max-w-xs">
          <Field id="low_stock_threshold" label="Low-stock threshold" hint="Products at or below this show as low stock on the dashboard and inventory.">
            <Input
              id="low_stock_threshold"
              type="number"
              min={0}
              step="1"
              value={Number.isFinite(v.low_stock_threshold) ? v.low_stock_threshold : ""}
              onChange={(e) => set("low_stock_threshold", e.target.value === "" ? NaN : Number(e.target.value))}
            />
          </Field>
        </div>
      </section>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-end gap-3">
        {dirty && (
          <Button type="button" variant="ghost" onClick={() => setV(initial)}>
            Discard changes
          </Button>
        )}
        <Button type="submit" disabled={!dirty || !thresholdOk || saving} className="bg-[#3f7a55] hover:bg-[#2d583d]">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save store details
        </Button>
      </div>
    </form>
  );
}
