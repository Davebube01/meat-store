"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertTriangle, Loader2, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  addMyAddress, deleteMyAddress, getMyAddresses, setMyDefaultAddress, updateMyAddress,
  type SavedAddress, type SavedAddressInput,
} from "@/core/api/user/account";
import { getDeliveryZones } from "@/core/api/user/delivery";

const KEY = ["my-addresses"];
const LABELS = ["Home", "Office", "Other"];
const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

function AddressDialog({ open, onOpenChange, editing, onSaved }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: SavedAddress | null;
  onSaved: () => void;
}) {
  const zones = useQuery({ queryKey: ["delivery-zones"], queryFn: getDeliveryZones, staleTime: 5 * 60_000 });
  const [v, setV] = useState<SavedAddressInput>(() =>
    editing
      ? { label: editing.label, zone_id: editing.zone_id, address: editing.address, apartment: editing.apartment ?? "", landmark: editing.landmark ?? "", instructions: editing.instructions ?? "", is_default: editing.is_default }
      : { label: "Home", zone_id: "", address: "", apartment: "", landmark: "", instructions: "", is_default: false },
  );
  const [error, setError] = useState<string | null>(null);
  const set = (patch: Partial<SavedAddressInput>) => setV((p) => ({ ...p, ...patch }));
  const valid = v.label.trim() && v.zone_id && v.address.trim().length >= 5;

  const save = useMutation({
    mutationFn: () => (editing ? updateMyAddress(editing.id, v) : addMyAddress(v)),
    onMutate: () => setError(null),
    onSuccess: () => {
      toast.success(editing ? "Address updated" : "Address saved");
      onSaved();
      onOpenChange(false);
    },
    onError: (err: Error) => setError(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit address" : "Add an address"}</DialogTitle>
          <DialogDescription>Saved addresses can be picked in one tap at checkout.</DialogDescription>
        </DialogHeader>
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid && !save.isPending) save.mutate();
          }}
        >
          <div className="space-y-2">
            <Label>Label</Label>
            <div className="flex flex-wrap gap-2">
              {LABELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set({ label: l })}
                  className={cn("h-9 rounded-lg border px-3 text-sm font-medium", v.label === l ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d]" : "border-gray-200 text-gray-600 hover:border-gray-300")}
                >
                  {l}
                </button>
              ))}
              {!LABELS.includes(v.label) && <Input aria-label="Label" value={v.label} maxLength={40} onChange={(e) => set({ label: e.target.value })} className="h-9 w-32" />}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-zone">Area</Label>
            <select
              id="addr-zone"
              value={v.zone_id}
              onChange={(e) => set({ zone_id: e.target.value })}
              className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm"
            >
              <option value="">Choose your area…</option>
              {zones.data?.map((z) => (
                <option key={z.id} value={z.id}>{z.name} (est. {naira(z.estimated_fee)})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-street">Street address</Label>
            <Input id="addr-street" value={v.address} maxLength={200} placeholder="e.g. Plot 7, Adetokunbo Ademola Crescent" onChange={(e) => set({ address: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="addr-apt">Flat / house no. <span className="font-normal text-gray-400">(optional)</span></Label>
              <Input id="addr-apt" value={v.apartment ?? ""} maxLength={80} onChange={(e) => set({ apartment: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-landmark">Nearest landmark <span className="font-normal text-gray-400">(optional)</span></Label>
              <Input id="addr-landmark" value={v.landmark ?? ""} maxLength={120} onChange={(e) => set({ landmark: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-note">Note for the courier <span className="font-normal text-gray-400">(optional)</span></Label>
            <Input id="addr-note" value={v.instructions ?? ""} maxLength={160} placeholder="Gate code, which floor…" onChange={(e) => set({ instructions: e.target.value })} />
          </div>
          {!editing?.is_default && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={!!v.is_default} onChange={(e) => set({ is_default: e.target.checked })} className="h-4 w-4 accent-[#3f7a55]" />
              Use as my default address
            </label>
          )}
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <DialogFooter>
            <button type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-lg px-4 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={!valid || save.isPending} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#3f7a55] px-5 text-sm font-semibold text-white hover:bg-[#2d583d] disabled:bg-gray-300">
              {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} {editing ? "Save changes" : "Save address"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const addresses = useQuery({ queryKey: KEY, queryFn: getMyAddresses });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [dialogKey, setDialogKey] = useState(0);
  const refresh = () => queryClient.invalidateQueries({ queryKey: KEY });

  const makeDefault = useMutation({
    mutationFn: setMyDefaultAddress,
    onSuccess: (a) => {
      toast.success(`${a.label} is now your default address`);
      refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });
  const remove = useMutation({
    mutationFn: deleteMyAddress,
    onSuccess: () => {
      toast.success("Address removed");
      refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const open = (a: SavedAddress | null) => {
    setEditing(a);
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  };

  const list = addresses.data ?? [];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a]">Addresses</h1>
          <p className="mt-1 text-sm text-gray-500">Pick one at checkout instead of typing it again.</p>
        </div>
        {list.length > 0 && (
          <button type="button" onClick={() => open(null)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#3f7a55] px-4 text-sm font-semibold text-white hover:bg-[#2d583d]">
            <Plus className="h-4 w-4" /> Add address
          </button>
        )}
      </div>

      {addresses.isPending ? (
        <div className="flex justify-center p-16 text-gray-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : addresses.isError ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Couldn&apos;t load your addresses. {(addresses.error as Error).message}</p>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f7f5] text-[#3f7a55]"><MapPin className="h-7 w-7" /></span>
          <p className="mt-4 font-semibold text-gray-900">No saved addresses yet</p>
          <p className="mt-1 text-sm text-gray-500">Save your home or office for faster checkout.</p>
          <button type="button" onClick={() => open(null)} className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#3f7a55] px-4 text-sm font-semibold text-white hover:bg-[#2d583d]">
            <Plus className="h-4 w-4" /> Add address
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {list.map((a) => (
            <li key={a.id} className={cn("flex flex-col rounded-2xl border bg-white p-5", a.is_default ? "border-[#3f7a55]" : "border-gray-200")}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-gray-900">{a.label}</p>
                {a.is_default && <span className="rounded-full bg-[#f4f7f5] px-2.5 py-0.5 text-xs font-semibold text-[#2d583d]">Default</span>}
              </div>
              <p className="mt-2 text-sm text-gray-700">{a.address}{a.apartment && `, ${a.apartment}`}</p>
              {a.landmark && <p className="text-sm text-gray-500">Near {a.landmark}</p>}
              <p className="mt-2 text-xs text-gray-500">
                {a.zone_name}
                {a.zone_fee !== null && <> · delivery est. {naira(a.zone_fee)}, cash</>}
              </p>
              {a.zone_fee === null && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700">
                  <AlertTriangle className="h-3.5 w-3.5" /> We don&apos;t deliver to this area right now. Edit it to pick another.
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                <button type="button" onClick={() => open(a)} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                {!a.is_default && (
                  <button type="button" onClick={() => makeDefault.mutate(a.id)} disabled={makeDefault.isPending} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
                    <Star className="h-3.5 w-3.5" /> Make default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Remove "${a.label}"?`)) remove.mutate(a.id);
                  }}
                  disabled={remove.isPending}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AddressDialog key={dialogKey} open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} onSaved={refresh} />
    </>
  );
}
