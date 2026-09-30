"use client";

import { useState } from "react";
import { ChevronDown, Loader2, Minus, Plus, ShoppingBasket, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COUNTER_PAYMENTS } from "@/core/api";
import { cn } from "@/lib/utils";
import { cashSuggestions, lineLabel, naira, totals, type TicketExtras, type TicketLine } from "./ticket";

interface Props {
  lines: TicketLine[];
  extras: TicketExtras;
  setExtras: (patch: Partial<TicketExtras>) => void;
  onQty: (line: TicketLine, delta: number) => void;
  onRemove: (line: TicketLine) => void;
  onClear: () => void;
  onComplete: () => void;
  submitting: boolean;
}

export function TicketPanel({ lines, extras, setExtras, onQty, onRemove, onClear, onComplete, submitting }: Props) {
  const [moreOpen, setMoreOpen] = useState(!!(extras.discountInput || extras.customerName || extras.customerPhone));
  const { subtotal, discount, total, tendered, discountProblem, cashProblem } = totals(lines, extras);
  const itemCount = lines.reduce((n, l) => n + (l.amount !== undefined ? 1 : l.quantity), 0);
  const change = extras.payment === "cash" && Number.isFinite(tendered) && !cashProblem ? tendered - total : null;
  const canComplete = lines.length > 0 && extras.payment !== null && !discountProblem && !cashProblem && !submitting;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
        <h2 className="text-sm font-semibold text-gray-900">
          This sale {itemCount > 0 && <span className="font-normal text-gray-500">· {itemCount} item{itemCount === 1 ? "" : "s"}</span>}
        </h2>
        {lines.length > 0 && (
          <button type="button" onClick={onClear} className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center text-gray-400">
          <ShoppingBasket className="h-8 w-8" />
          <p className="text-sm">Tap a product to add it.</p>
        </div>
      ) : (
        <ul className="max-h-[40vh] divide-y divide-gray-100 overflow-y-auto px-5 lg:max-h-[34vh]">
          {lines.map((l) => (
            <li key={l.key} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{l.product.name}</p>
                <p className="text-xs text-gray-500">
                  {[lineLabel(l), l.amount === undefined && l.quantity > 1 ? `${naira(l.unitPrice)} each` : null].filter(Boolean).join(" · ")}
                </p>
              </div>
              {l.amount === undefined && (
                <div className="flex items-center rounded-lg border border-gray-200">
                  <button type="button" aria-label={`One less ${l.product.name}`} onClick={() => (l.quantity > 1 ? onQty(l, -1) : onRemove(l))}
                    className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                    {l.quantity > 1 ? <Minus className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                  <span className="w-6 text-center text-sm font-semibold tabular-nums">{l.quantity}</span>
                  <button type="button" aria-label={`One more ${l.product.name}`} onClick={() => onQty(l, 1)}
                    className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <div className="w-20 text-right">
                <p className="text-sm font-semibold tabular-nums text-gray-900">{naira(l.unitPrice * l.quantity)}</p>
                {l.amount !== undefined && (
                  <button type="button" aria-label={`Remove ${l.product.name}`} onClick={() => onRemove(l)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="ml-auto h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-4 border-t border-gray-100 px-5 py-4">
        <button type="button" onClick={() => setMoreOpen(!moreOpen)} className="flex w-full items-center justify-between text-xs font-medium text-gray-500 hover:text-gray-800">
          Discount and customer (optional)
          <ChevronDown className={cn("h-4 w-4 transition-transform", moreOpen && "rotate-180")} />
        </button>
        {moreOpen && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label htmlFor="discount" className="text-xs text-gray-600">Discount (₦)</Label>
                <Input id="discount" inputMode="decimal" value={extras.discountInput} onChange={(e) => setExtras({ discountInput: e.target.value })} placeholder="0" />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="discount_note" className="text-xs text-gray-600">Reason</Label>
                <Input id="discount_note" value={extras.discountNote} maxLength={200} onChange={(e) => setExtras({ discountNote: e.target.value })}
                  placeholder="e.g. Regular customer" disabled={!discount} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input aria-label="Customer name" value={extras.customerName} maxLength={120} onChange={(e) => setExtras({ customerName: e.target.value })} placeholder="Customer name" />
              <Input aria-label="Customer phone" type="tel" value={extras.customerPhone} maxLength={30} onChange={(e) => setExtras({ customerPhone: e.target.value })} placeholder="Phone 080…" />
            </div>
          </div>
        )}

        <fieldset className="space-y-2">
          <legend className="mb-2 text-xs font-medium text-gray-600">Paid by</legend>
          <div className="grid grid-cols-3 gap-2">
            {COUNTER_PAYMENTS.map((m) => (
              <button
                key={m.key}
                type="button"
                aria-pressed={extras.payment === m.key}
                onClick={() => setExtras({ payment: m.key })}
                className={cn(
                  "h-11 rounded-xl border text-sm font-semibold transition-colors",
                  extras.payment === m.key ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d] ring-1 ring-[#3f7a55]" : "border-gray-200 text-gray-700 hover:border-gray-300",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </fieldset>

        {extras.payment === "cash" && lines.length > 0 && (
          <div className="space-y-2 rounded-xl bg-[#f7f8f7] p-3">
            <Label htmlFor="tendered" className="text-xs text-gray-600">Cash given (optional, for change)</Label>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => setExtras({ tenderedInput: String(total) })} className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:border-gray-300">Exact</button>
              {cashSuggestions(total).map((v) => (
                <button key={v} type="button" onClick={() => setExtras({ tenderedInput: String(v) })} className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium tabular-nums text-gray-700 hover:border-gray-300">
                  {naira(v)}
                </button>
              ))}
            </div>
            <Input id="tendered" inputMode="decimal" value={extras.tenderedInput} onChange={(e) => setExtras({ tenderedInput: e.target.value })} placeholder="e.g. 20000" className="bg-white tabular-nums" />
            {cashProblem ? (
              <p className="text-xs text-red-600">{cashProblem}</p>
            ) : change !== null && (
              <p className="flex items-baseline justify-between text-sm">
                <span className="text-gray-600">Change</span>
                <span className="text-xl font-bold tabular-nums text-[#2d583d]">{naira(change)}</span>
              </p>
            )}
          </div>
        )}

        <div className="space-y-1 text-sm">
          {discount > 0 && (
            <>
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="tabular-nums">{naira(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Discount</span><span className="tabular-nums">−{naira(discount)}</span></div>
            </>
          )}
          <div className="flex items-baseline justify-between"><span className="font-semibold text-gray-900">Total</span><span className="text-2xl font-bold tabular-nums text-gray-900">{naira(total)}</span></div>
          {discountProblem && <p className="text-xs text-red-600">{discountProblem}</p>}
        </div>

        <Button className="h-12 w-full bg-[#3f7a55] text-base hover:bg-[#2d583d]" disabled={!canComplete} onClick={onComplete}>
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" />
            : lines.length === 0 ? "Add something to sell"
              : extras.payment ? `Complete sale · ${naira(total)}` : "Choose how they paid"}
        </Button>
      </div>
    </div>
  );
}
