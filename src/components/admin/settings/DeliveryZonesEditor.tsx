"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Info, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AdminDeliveryZone, DeliveryZoneInput } from "@/core/api";

type Row = { key: string; id?: string; name: string; fee: string; is_active: boolean; orders_count: number };

const toRows = (zones: AdminDeliveryZone[]): Row[] =>
  zones.map((z) => ({ key: z.id, id: z.id, name: z.name, fee: String(z.fee), is_active: z.is_active, orders_count: z.orders_count }));

interface Props {
  initial: AdminDeliveryZone[];
  saving: boolean;
  error: string | null;
  onSave: (zones: DeliveryZoneInput[]) => void;
}

/** Keyed by the parent on the saved list, so it resets after each save. */
export function DeliveryZonesEditor({ initial, saving, error, onSave }: Props) {
  const [rows, setRows] = useState<Row[]>(() => toRows(initial));
  const [newCount, setNewCount] = useState(0);

  const update = (key: string, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const move = (i: number, dir: -1 | 1) =>
    setRows((rs) => {
      const next = [...rs];
      [next[i], next[i + dir]] = [next[i + dir], next[i]];
      return next;
    });

  const problems = (() => {
    const names = rows.map((r) => r.name.trim().toLowerCase());
    if (rows.some((r) => r.name.trim().length < 2)) return "Every zone needs a name.";
    if (names.some((n, i) => names.indexOf(n) !== i)) return "Two zones have the same name.";
    if (rows.some((r) => r.fee === "" || !Number.isFinite(Number(r.fee)) || Number(r.fee) < 0)) return "Every zone needs a fee of ₦0 or more.";
    if (!rows.some((r) => r.is_active)) return "Keep at least one zone switched on, or customers can't choose delivery.";
    return null;
  })();

  const editable = (rs: Row[]) => JSON.stringify(rs.map((r) => [r.id, r.name, r.fee, r.is_active]));
  const dirty = editable(rows) !== editable(toRows(initial));

  return (
    <div className="space-y-4">
      <div className="flex gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Fees are estimates shown at checkout. Customers pay them in cash to the courier; they&apos;re never charged online.
          Changes apply to new orders straight away.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <ul className="divide-y divide-gray-100 md:hidden">
          {rows.map((r, i) => (
            <li key={r.key} className={r.is_active ? "space-y-3 p-4" : "space-y-3 bg-gray-50/60 p-4"}>
              <div className="flex items-center justify-between">
                <div className="flex">
                  <button type="button" aria-label={`Move ${r.name} up`} disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label={`Move ${r.name} down`} disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                {/* Saved zones are switched off instead, so past orders keep their area. */}
                {!r.id && (
                  <button type="button" aria-label="Remove new zone" onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))} className="rounded p-1 text-gray-400 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`name-${r.key}`}>Zone</Label>
                <Input id={`name-${r.key}`} value={r.name} maxLength={80} placeholder="e.g. Lugbe" onChange={(e) => update(r.key, { name: e.target.value })} className={r.is_active ? "" : "text-gray-500"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor={`fee-${r.key}`}>Fee (₦)</Label>
                  <Input id={`fee-${r.key}`} type="number" min={0} step={100} inputMode="numeric" value={r.fee} onChange={(e) => update(r.key, { fee: e.target.value })} className="tabular-nums" />
                </div>
                <div className="grid gap-1.5">
                  <Label>Active</Label>
                  <div className="flex h-9 items-center gap-2">
                    <Switch checked={r.is_active} onCheckedChange={(is_active) => update(r.key, { is_active })} aria-label={`${r.name} active`} />
                    <span className="text-xs text-gray-500">{r.is_active ? "On" : "Off"}</span>
                  </div>
                </div>
              </div>
              {r.id && <p className="text-xs text-gray-500">{r.orders_count} order{r.orders_count === 1 ? "" : "s"} placed in this zone</p>}
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th className="w-16 px-3 py-3"><span className="sr-only">Order</span></th>
                <th className="px-3 py-3">Zone</th>
                <th className="w-40 px-3 py-3">Fee (₦)</th>
                <th className="hidden w-24 px-3 py-3 text-right md:table-cell">Orders</th>
                <th className="w-28 px-3 py-3">Active</th>
                <th className="w-12 px-3 py-3"><span className="sr-only">Remove</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r, i) => (
                <tr key={r.key} className={r.is_active ? "" : "bg-gray-50/60"}>
                  <td className="px-3 py-2">
                    <div className="flex">
                      <button type="button" aria-label={`Move ${r.name} up`} disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button type="button" aria-label={`Move ${r.name} down`} disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Input aria-label="Zone name" value={r.name} maxLength={80} placeholder="e.g. Lugbe" onChange={(e) => update(r.key, { name: e.target.value })} className={r.is_active ? "" : "text-gray-500"} />
                  </td>
                  <td className="px-3 py-2">
                    <Input aria-label={`Fee for ${r.name}`} type="number" min={0} step={100} inputMode="numeric" value={r.fee} onChange={(e) => update(r.key, { fee: e.target.value })} className="tabular-nums" />
                  </td>
                  <td className="hidden px-3 py-2 text-right tabular-nums text-gray-500 md:table-cell">{r.id ? r.orders_count : "New"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Switch checked={r.is_active} onCheckedChange={(is_active) => update(r.key, { is_active })} aria-label={`${r.name} active`} />
                      <span className="text-xs text-gray-500">{r.is_active ? "On" : "Off"}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {/* Saved zones are switched off instead, so past orders keep their area. */}
                    {!r.id && (
                      <button type="button" aria-label="Remove new zone" onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))} className="rounded p-1 text-gray-400 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 p-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setRows((rs) => [...rs, { key: `new-${newCount}`, name: "", fee: "", is_active: true, orders_count: 0 }]);
              setNewCount((n) => n + 1);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add zone
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-500">Saved zones can&apos;t be deleted, only switched off, so past orders keep their delivery area.</p>

      {(error || (dirty && problems)) && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error ?? problems}</p>
      )}

      <div className="flex items-center justify-end gap-3">
        {dirty && (
          <Button type="button" variant="ghost" onClick={() => setRows(toRows(initial))}>
            Discard changes
          </Button>
        )}
        <Button
          type="button"
          disabled={!dirty || !!problems || saving}
          className="bg-[#3f7a55] hover:bg-[#2d583d]"
          onClick={() => onSave(rows.map((r) => ({ id: r.id, name: r.name.trim(), fee: Number(r.fee), is_active: r.is_active })))}
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save zones
        </Button>
      </div>
    </div>
  );
}
