"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Boxes, FileDown, History, Loader2, Receipt, ShoppingCart, Users, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { downloadExport, type ExportDataset } from "@/core/api";
import { cn } from "@/lib/utils";

const DATASETS: { key: ExportDataset; title: string; description: string; icon: LucideIcon; dated: boolean }[] = [
  {
    key: "orders", title: "Orders & sales", icon: ShoppingCart, dated: true,
    description: "One row per order — online and walk-in — with customer, payment method, discount and total.",
  },
  {
    key: "sale_lines", title: "Sale lines with profit", icon: Receipt, dated: true,
    description: "Every item sold: size, quantity, price, cost and profit. The one your accountant wants.",
  },
  {
    key: "stock_movements", title: "Stock movements", icon: Boxes, dated: true,
    description: "Every stock change: sales, restocks, corrections and returns, with who and why.",
  },
  {
    key: "activity", title: "Activity log", icon: History, dated: true,
    description: "Who did what in the admin: edits, price changes, cancellations, voids, sign-ins.",
  },
  {
    key: "products", title: "Products & stock", icon: Boxes, dated: false,
    description: "Current catalogue: prices, sizes, cost, stock on hand and its value. A snapshot of right now.",
  },
  {
    key: "customers", title: "Customers", icon: Users, dated: false,
    description: "Customer accounts with orders, total spent and last order. A snapshot of right now.",
  },
];

const lagos = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });

function presets() {
  const now = new Date();
  const today = lagos(now);
  const [y, m] = today.split("-").map(Number);
  const firstOfMonth = `${today.slice(0, 7)}-01`;
  const lastMonthStart = lagos(new Date(Date.UTC(y, m - 2, 1, 12)));
  const lastMonthEnd = lagos(new Date(Date.UTC(y, m - 1, 0, 12)));
  const daysAgo = (n: number) => lagos(new Date(now.getTime() - n * 86_400_000));
  return [
    { key: "today", label: "Today", from: today, to: today },
    { key: "7d", label: "Last 7 days", from: daysAgo(6), to: today },
    { key: "month", label: "This month", from: firstOfMonth, to: today },
    { key: "last_month", label: "Last month", from: lastMonthStart, to: lastMonthEnd },
    { key: "all", label: "All time", from: "", to: "" },
  ];
}

export default function ExportsPage() {
  const options = presets();
  const [from, setFrom] = useState(options[2].from);
  const [to, setTo] = useState(options[2].to);
  const [busy, setBusy] = useState<ExportDataset | null>(null);
  const active = options.find((p) => p.from === from && p.to === to)?.key;
  const badRange = !!from && !!to && from > to;

  const download = async (dataset: ExportDataset, dated: boolean) => {
    setBusy(dataset);
    try {
      await downloadExport(dataset, dated ? { date_from: from || undefined, date_to: to || undefined } : {});
    } catch (err) {
      toast.error((err as Error)?.message || "Couldn't download the export");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Reports</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Exports</h1>
        <p className="mt-1 text-sm text-gray-500">Download your data as CSV — opens in Excel or Google Sheets.</p>
      </div>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-sm font-semibold text-gray-900">Date range</p>
        <div className="flex flex-wrap gap-2">
          {options.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-pressed={active === p.key}
              onClick={() => {
                setFrom(p.from);
                setTo(p.to);
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                active === p.key ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d]" : "border-gray-200 text-gray-600 hover:border-gray-300",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="from" className="text-xs text-gray-600">From</Label>
            <Input id="from" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className="w-44" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="to" className="text-xs text-gray-600">To</Label>
            <Input id="to" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className="w-44" />
          </div>
          <p className="pb-2 text-xs text-gray-500">
            {badRange ? <span className="text-red-600">The start date is after the end date.</span>
              : !from && !to ? "Everything, from the first order." : "Days in Abuja time, both ends included."}
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {DATASETS.map(({ key, title, description, icon: Icon, dated }) => (
          <div key={key} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#3f7a55]">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="mt-0.5 text-sm text-gray-500">{description}</p>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between gap-3">
              <span className="text-xs text-gray-400">{dated ? (from || to ? "Uses the date range above" : "All time") : "Current snapshot"}</span>
              <Button
                variant="outline"
                disabled={busy !== null || (dated && badRange)}
                onClick={() => download(key, dated)}
              >
                {busy === key ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                Download CSV
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
