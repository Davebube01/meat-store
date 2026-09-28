"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SizeRow, guessKg, marginLabel } from "./sizeRows";

const inputClass = "border-gray-200 focus-visible:ring-[#3f7a55]/30 focus-visible:border-[#3f7a55]";

export function SizeOptionsEditor({ rows, onChange, costPrice }: {
  rows: SizeRow[];
  onChange: (rows: SizeRow[]) => void;
  /** Cost per unit of stock, for showing each size's margin. */
  costPrice?: number;
}) {
  const update = (index: number, patch: Partial<SizeRow>) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const updateLabel = (index: number, label: string) => {
    const row = rows[index];
    const previousGuess = guessKg(row.label) ?? "1";
    // Follow the label ("2kg" → 2) until the admin types their own value.
    const stockUnits = row.stockUnits === "" || row.stockUnits === previousGuess ? guessKg(label) ?? "1" : row.stockUnits;
    update(index, { label, stockUnits });
  };

  return (
    <div className="grid gap-3">
      <div>
        <Label className="text-sm font-medium text-gray-700">Sizes &amp; prices</Label>
        <p className="mt-1 text-xs text-gray-500">
          Each size has its own price. <span className="font-medium">Stock used</span> is how much of this product&apos;s
          stock one of that size takes, in the unit you count stock in — e.g. 2 for a 2kg pack of a cut stocked in kg,
          or 1 for a whole goat stocked by the piece. Leave empty to sell at one price.
        </p>
      </div>

      {rows.length > 0 && (
        <div className="grid gap-2">
          <div className="hidden grid-cols-[1fr_1fr_1fr_40px] gap-2 text-xs font-medium text-gray-500 sm:grid">
            <span>Label</span>
            <span>Price (₦)</span>
            <span>Stock used</span>
            <span />
          </div>
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 rounded-lg border border-gray-100 p-2 sm:grid-cols-[1fr_1fr_1fr_40px] sm:border-0 sm:p-0">
              <Input
                aria-label={`Size ${i + 1} label`}
                value={row.label}
                onChange={(e) => updateLabel(i, e.target.value)}
                placeholder="e.g. 2kg"
                className={`col-span-2 sm:col-span-1 ${inputClass}`}
              />
              <Input
                aria-label={`Size ${i + 1} price`}
                type="number"
                min="0"
                value={row.price}
                onChange={(e) => update(i, { price: e.target.value })}
                placeholder="0"
                className={inputClass}
              />
              <Input
                aria-label={`Size ${i + 1} stock used`}
                type="number"
                min="0"
                step="any"
                value={row.stockUnits}
                onChange={(e) => update(i, { stockUnits: e.target.value })}
                placeholder="1"
                className={inputClass}
              />
              <Button
                type="button"
                variant="ghost"
                aria-label={`Remove size ${row.label || i + 1}`}
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
                className="col-span-2 text-gray-400 hover:text-red-600 sm:col-span-1 sm:px-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {costPrice !== undefined && parseFloat(row.price) > 0 && parseFloat(row.stockUnits) > 0 && (
                <p
                  className={`col-span-2 text-xs sm:col-span-4 ${
                    parseFloat(row.price) < costPrice * parseFloat(row.stockUnits) ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {marginLabel(parseFloat(row.price), costPrice * parseFloat(row.stockUnits))}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...rows, { label: "", price: "", stockUnits: "1" }])}
        className="w-fit border-dashed text-[#3f7a55]"
      >
        <Plus className="mr-1.5 h-4 w-4" /> Add size
      </Button>
    </div>
  );
}
