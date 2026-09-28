"use client";

import { useState } from "react";
import { Minus, Plus, Scale } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pricePerStockUnit, type Product } from "@/core/api";
import { cn } from "@/lib/utils";
import { naira, stockUnit, type TicketLine } from "./ticket";

interface Props {
  product: Product | null;
  /** Stock this product already has on the ticket, in its stock unit. */
  heldOnTicket: number;
  onClose: () => void;
  onAdd: (line: TicketLine) => void;
}

const WEIGHED = "__weighed__";

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-sm font-medium transition-colors",
        selected ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d] ring-1 ring-[#3f7a55]" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
      )}
    >
      {children}
    </button>
  );
}

/** Remounted per product (keyed by the parent), so it always starts fresh. */
export function AddLineDialog({ product, heldOnTicket, onClose, onAdd }: Props) {
  const sizes = product?.weight_options ?? [];
  const parts = product?.parts ?? [];
  const [size, setSize] = useState<string>(sizes[0]?.label ?? WEIGHED);
  const [part, setPart] = useState<string | undefined>(parts[0]);
  const [quantity, setQuantity] = useState(1);
  const [amountInput, setAmountInput] = useState("");

  if (!product) return null;

  const unit = stockUnit(product);
  const weighed = size === WEIGHED;
  const option = sizes.find((s) => s.label === size);
  const amount = parseFloat(amountInput);
  const perUnit = pricePerStockUnit(product);

  const stockUsed = weighed ? (amount > 0 ? amount : 0) : (option?.stock_units ?? 1) * quantity;
  const available = product.stock_quantity - heldOnTicket;
  const lineTotal = weighed ? Math.round(perUnit * (amount || 0) * 100) / 100 : (option?.price ?? product.price) * quantity;
  const valid = (weighed ? amount > 0 : quantity >= 1) && stockUsed <= available + 1e-9;

  const add = () => {
    if (!valid) return;
    onAdd({
      key: `${product.id}-${Date.now()}`,
      product,
      quantity: weighed ? 1 : quantity,
      weightOption: weighed ? undefined : option?.label,
      part,
      amount: weighed ? amount : undefined,
      unitPrice: weighed ? lineTotal : option?.price ?? product.price,
      stockUnits: weighed ? amount : option?.stock_units ?? 1,
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            {Number(available.toFixed(2))} {unit} available
            {heldOnTicket > 0 && ` (${Number(heldOnTicket.toFixed(2))} already on this sale)`}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-gray-900">Size</legend>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <Choice key={s.label} selected={size === s.label} onClick={() => setSize(s.label)}>
                  {s.label} <span className="font-normal text-gray-500">· {naira(s.price)}</span>
                </Choice>
              ))}
              <Choice selected={weighed} onClick={() => setSize(WEIGHED)}>
                <Scale className="h-3.5 w-3.5" /> Weighed
              </Choice>
            </div>
          </fieldset>

          {parts.length > 0 && (
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-gray-900">Cut</legend>
              <div className="flex flex-wrap gap-2">
                {parts.map((p) => (
                  <Choice key={p} selected={part === p} onClick={() => setPart(p)}>
                    {p}
                  </Choice>
                ))}
              </div>
            </fieldset>
          )}

          {weighed ? (
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount off the scale ({unit})</Label>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                autoFocus
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder={unit === "kg" ? "e.g. 1.7" : "e.g. 2"}
              />
              <p className="text-xs text-gray-500">Charged at {naira(perUnit)} per {unit}.</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Label className="text-sm font-semibold text-gray-900">Quantity</Label>
              <div className="flex h-10 items-center rounded-xl border border-gray-200">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-full w-10 items-center justify-center text-gray-600 disabled:opacity-30" disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold tabular-nums">{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}
                  className="flex h-full w-10 items-center justify-center text-gray-600">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {stockUsed > available + 1e-9 && (
            <p className="text-sm text-red-600">Only {Number(available.toFixed(2))} {unit} left.</p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!valid} className="bg-[#3f7a55] hover:bg-[#2d583d]">
              Add · {naira(lineTotal)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
