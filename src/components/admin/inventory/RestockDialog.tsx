"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RestockItem } from "@/core/api";

interface Props {
  item: RestockItem | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (quantity: number, note: string) => void;
}

/** Remounted per product (keyed by the parent), so the form always starts fresh. */
export function RestockDialog({ item, saving, error, onClose, onSubmit }: Props) {
  // Suggest roughly two weeks' worth at the recent pace, or 10 if nothing sold.
  const suggested = item
    ? Math.max(1, Math.ceil(item.sold_last_7_days > 0 ? item.sold_last_7_days * 2 - item.stock_quantity : 10))
    : 10;
  const [quantity, setQuantity] = useState(String(suggested));
  const [note, setNote] = useState("");
  const qty = Number(quantity);
  const valid = Number.isFinite(qty) && qty > 0;

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restock {item?.name}</DialogTitle>
          <DialogDescription>
            Adds stock and records it in the stock log as a restock.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid && !saving) onSubmit(qty, note.trim());
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="restock-qty">Quantity to add</Label>
            <Input
              id="restock-qty"
              type="number"
              min="0.5"
              step="0.5"
              inputMode="decimal"
              autoFocus
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {item && valid && (
              <p className="text-sm text-gray-500">
                Stock goes from <b className="text-gray-900">{item.stock_quantity}</b> to{" "}
                <b className="text-[#2d583d]">{item.stock_quantity + qty}</b>
                {item.sold_last_7_days > 0 && <> · sold {item.sold_last_7_days} in the last 7 days</>}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="restock-note">
              Note <span className="font-normal text-gray-400">(optional)</span>
            </Label>
            <Input
              id="restock-note"
              value={note}
              maxLength={200}
              placeholder="e.g. Monday delivery from farm"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!valid || saving} className="bg-[#3f7a55] hover:bg-[#2d583d]">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add {valid ? qty : ""} to stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
