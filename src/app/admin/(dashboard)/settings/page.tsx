"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, CreditCard, Loader2, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreDetailsForm } from "@/components/admin/settings/StoreDetailsForm";
import { DeliveryZonesEditor } from "@/components/admin/settings/DeliveryZonesEditor";
import { PaymentsCard } from "@/components/admin/settings/PaymentsCard";
import {
  getAdminSettings, updateDeliveryZones, updateStoreDetails,
  type AdminSettings, type DeliveryZoneInput, type StoreDetails,
} from "@/core/api";

const SECTIONS = [
  { key: "store", label: "Store details", icon: Store },
  { key: "zones", label: "Delivery zones", icon: MapPin },
  { key: "payments", label: "Payments", icon: CreditCard },
] as const;
type Section = (typeof SECTIONS)[number]["key"];

const QUERY_KEY = ["admin-settings"];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [section, setSection] = useState<Section>("store");
  const [storeError, setStoreError] = useState<string | null>(null);
  const [zonesError, setZonesError] = useState<string | null>(null);

  const { data, isPending, isError, error, refetch } = useQuery({ queryKey: QUERY_KEY, queryFn: getAdminSettings });

  const saveStore = useMutation({
    mutationFn: (v: StoreDetails) => updateStoreDetails(v),
    onMutate: () => setStoreError(null),
    onSuccess: (store) => {
      queryClient.setQueryData<AdminSettings>(QUERY_KEY, (prev) => (prev ? { ...prev, store } : prev));
      // The low-stock threshold feeds these pages.
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
      toast.success("Store details saved");
    },
    onError: (err: Error) => setStoreError(err.message),
  });

  const saveZones = useMutation({
    mutationFn: (zones: DeliveryZoneInput[]) => updateDeliveryZones(zones),
    onMutate: () => setZonesError(null),
    onSuccess: (zones) => {
      queryClient.setQueryData<AdminSettings>(QUERY_KEY, (prev) => (prev ? { ...prev, zones } : prev));
      toast.success("Delivery zones saved. Checkout uses the new fees now.");
    },
    onError: (err: Error) => setZonesError(err.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Store</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Settings</h1>
      </div>

      {isPending ? (
        <div className="flex flex-col items-center justify-center p-24 text-gray-400">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-green-600" />
          <p>Loading settings…</p>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-semibold">Couldn&apos;t load settings</p>
            <p className="text-sm opacity-90">{(error as Error)?.message}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto lg:flex-col">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                type="button"
                aria-current={section === s.key ? "page" : undefined}
                onClick={() => setSection(s.key)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  section === s.key ? "bg-green-50 text-[#2d583d]" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </button>
            ))}
          </nav>

          <div className="min-w-0">
            {section === "store" && (
              <StoreDetailsForm
                key={JSON.stringify(data.store)}
                initial={data.store}
                saving={saveStore.isPending}
                error={storeError}
                onSave={(v) => saveStore.mutate(v)}
              />
            )}
            {section === "zones" && (
              <DeliveryZonesEditor
                key={JSON.stringify(data.zones)}
                initial={data.zones}
                saving={saveZones.isPending}
                error={zonesError}
                onSave={(z) => saveZones.mutate(z)}
              />
            )}
            {section === "payments" && <PaymentsCard status={data.payments} />}
          </div>
        </div>
      )}
    </div>
  );
}
