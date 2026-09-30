"use client";

import { useEffect, useState } from "react";
import { Product, StockMovement, adjustProductStock, getProductStockMovements } from "@/core/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Boxes, Loader2, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface StockPanelProps {
  product: Product;
  onProductChange: (product: Product) => void;
}

const REASON_LABELS: Record<string, string> = {
  initial_stock: "Initial stock",
  order_placed: "Order placed",
  order_cancelled: "Order cancelled",
  restock: "Restock",
  correction: "Correction",
};

export function StockPanel({ product, onProductChange }: StockPanelProps) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [direction, setDirection] = useState<"add" | "remove">("add");
  const [amountInput, setAmountInput] = useState("");
  const [reason, setReason] = useState("restock");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadHistory = () => {
    setLoadingHistory(true);
    getProductStockMovements(product.id)
      .then(setMovements)
      .catch(() => toast.error("Failed to load stock history."))
      .finally(() => setLoadingHistory(false));
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Enter a positive amount.");
      return;
    }

    const change = direction === "add" ? amount : -amount;
    setSubmitting(true);
    try {
      const updated = await adjustProductStock(product.id, {
        change,
        reason,
        note: note.trim() || undefined,
      });
      onProductChange(updated);
      setAmountInput("");
      setNote("");
      toast.success(direction === "add" ? "Stock added." : "Stock removed.");
      loadHistory();
    } catch (error: any) {
      toast.error(error.message || "Failed to adjust stock.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-6">
          <Boxes className="w-5 h-5 text-[#3f7a55]" />
          <h3 className="text-lg font-bold text-gray-900">Stock</h3>
        </div>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-3xl font-bold text-gray-900">{product.stock_quantity}</span>
          <span className="text-sm text-gray-500">units currently in stock</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1 w-fit gap-1">
            <button
              type="button"
              onClick={() => setDirection("add")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                direction === "add" ? "bg-white shadow-sm text-[#3f7a55]" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
            <button
              type="button"
              onClick={() => setDirection("remove")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                direction === "remove" ? "bg-white shadow-sm text-red-600" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Minus className="w-3.5 h-3.5" /> Remove
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="any"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <DropdownSelect
                id="reason"
                value={reason}
                onValueChange={setReason}
                className="h-10"
                options={[
                  { value: "restock", label: "Restock" },
                  { value: "correction", label: "Correction" },
                ]}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">
              Note <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Delivery from supplier, or recount after spoilage"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className={cn(
              "w-full text-white",
              direction === "add" ? "bg-[#3f7a55] hover:bg-[#2d583d]" : "bg-red-600 hover:bg-red-700"
            )}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : direction === "add" ? (
              "Add Stock"
            ) : (
              "Remove Stock"
            )}
          </Button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Stock History</h3>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : movements.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No stock movements recorded yet.</p>
        ) : (
          <ul className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {movements.map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs capitalize",
                        m.change >= 0 ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
                      )}
                    >
                      {REASON_LABELS[m.reason] || m.reason}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {m.previous_quantity} → {m.new_quantity}
                    {m.note && <span className="text-gray-400"> — {m.note}</span>}
                  </p>
                </div>
                <span className={cn("font-bold text-sm shrink-0", m.change >= 0 ? "text-green-600" : "text-red-600")}>
                  {m.change >= 0 ? "+" : ""}{m.change}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
