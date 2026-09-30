"use client";

import { useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  AlertCircle, Boxes, ChevronDown, FileDown, History, Loader2, PackageSearch, Receipt, ShoppingCart, Users, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { downloadExport, getExportCatalogue, type ExportDataset } from "@/core/api";
import { cn } from "@/lib/utils";

const INFO: Record<ExportDataset, { title: string; description: string; icon: LucideIcon; unit: [string, string] }> = {
  orders: {
    title: "Orders & sales", icon: ShoppingCart, unit: ["order", "orders"],
    description: "One row per order, online and walk-in, with customer, payment method, discount and total.",
  },
  sale_lines: {
    title: "Sale lines with profit", icon: Receipt, unit: ["line", "lines"],
    description: "Every item sold: size, quantity, price, cost and profit. The one your accountant wants.",
  },
  stock_movements: {
    title: "Stock movements", icon: Boxes, unit: ["movement", "movements"],
    description: "Every stock change: sales, restocks, corrections and returns, with who and why.",
  },
  activity: {
    title: "Activity log", icon: History, unit: ["entry", "entries"],
    description: "Who did what in the admin: edits, price changes, cancellations, voids, sign-ins. Filter it first on the Activity page.",
  },
  products: {
    title: "Products & stock", icon: PackageSearch, unit: ["product", "products"],
    description: "Current catalogue: prices, sizes, cost, stock on hand and its value.",
  },
  customers: {
    title: "Customers", icon: Users, unit: ["customer", "customers"],
    description: "Customer accounts with orders, total spent and last order. Deleted accounts are left out.",
  },
};

const ORDER: ExportDataset[] = ["orders", "sale_lines", "stock_movements", "activity", "products", "customers"];

const lagos = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });

function presets() {
  const now = new Date();
  const today = lagos(now);
  const [y, m] = today.split("-").map(Number);
  const daysAgo = (n: number) => lagos(new Date(now.getTime() - n * 86_400_000));
  return [
    { key: "today", label: "Today", from: today, to: today },
    { key: "yesterday", label: "Yesterday", from: daysAgo(1), to: daysAgo(1) },
    { key: "7d", label: "Last 7 days", from: daysAgo(6), to: today },
    { key: "month", label: "This month", from: `${today.slice(0, 7)}-01`, to: today },
    { key: "last_month", label: "Last month", from: lagos(new Date(Date.UTC(y, m - 2, 1, 12))), to: lagos(new Date(Date.UTC(y, m - 1, 0, 12))) },
    { key: "year", label: "This year", from: `${y}-01-01`, to: today },
    { key: "all", label: "All time", from: "", to: "" },
  ];
}

const pretty = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" });

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });

export default function ExportsPage() {
  const queryClient = useQueryClient();
  const options = presets();
  const [from, setFrom] = useState(options[3].from);
  const [to, setTo] = useState(options[3].to);
  const [busy, setBusy] = useState<ExportDataset | null>(null);
  const [openColumns, setOpenColumns] = useState<ExportDataset | null>(null);
  const active = options.find((p) => p.from === from && p.to === to)?.key;
  const badRange = !!from && !!to && from > to;
  const range = { date_from: from || undefined, date_to: to || undefined };

  const catalogue = useQuery({
    queryKey: ["admin-exports", from, to],
    queryFn: () => getExportCatalogue(range),
    enabled: !badRange,
    placeholderData: keepPreviousData,
  });

  const rangeText = !from && !to ? "all time" : from === to ? pretty(from) : `${from ? pretty(from) : "the start"} to ${to ? pretty(to) : "today"}`;

  const download = async (dataset: ExportDataset, dated: boolean) => {
    setBusy(dataset);
    try {
      await downloadExport(dataset, dated ? range : {});
      queryClient.invalidateQueries({ queryKey: ["admin-exports"] });
    } catch (err) {
      toast.error((err as Error)?.message || "Couldn't download the export");
    } finally {
      setBusy(null);
    }
  };

  const datasets = ORDER.map((key) => catalogue.data?.datasets.find((d) => d.key === key)).filter((d) => !!d);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Reports</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Exports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Download your data as CSV for Excel or Google Sheets. Money is plain numbers so it adds up; times are Abuja time.
        </p>
      </div>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900">Date range</p>
          {!badRange && <p className="text-xs text-gray-500">For orders, sale lines, stock and activity: <span className="font-medium text-gray-700">{rangeText}</span></p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-pressed={active === p.key}
              onClick={() => { setFrom(p.from); setTo(p.to); }}
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
            {badRange ? <span className="text-red-600">The start date is after the end date.</span> : "Both days included."}
          </p>
        </div>
      </section>

      {catalogue.isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="flex-1">{(catalogue.error as Error)?.message || "Couldn't load exports"}</p>
          <Button variant="outline" size="sm" onClick={() => catalogue.refetch()}>Retry</Button>
        </div>
      ) : catalogue.isPending ? (
        <div className="flex justify-center p-16"><Loader2 className="h-7 w-7 animate-spin text-green-600" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {datasets.map(({ key, dated, rows, columns }) => {
            const { title, description, icon: Icon, unit } = INFO[key];
            const empty = rows === 0;
            const refreshing = catalogue.isFetching && dated;
            return (
              <div key={key} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#3f7a55]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{title}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{description}</p>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setOpenColumns(openColumns === key ? null : key)}
                    aria-expanded={openColumns === key}
                    className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800"
                  >
                    {columns.length} columns <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", openColumns === key && "rotate-180")} />
                  </button>
                  {openColumns === key && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {columns.map((c) => <span key={c} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{c}</span>)}
                    </div>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <span className={cn("text-sm tabular-nums", empty ? "text-gray-400" : "text-gray-700", refreshing && "opacity-50")}>
                    {empty
                      ? dated ? "Nothing in this range" : `No ${unit[1]} yet`
                      : <><strong className="font-semibold">{rows.toLocaleString("en-NG")}</strong> {rows === 1 ? unit[0] : unit[1]}{dated ? "" : " now"}</>}
                  </span>
                  <Button
                    variant="outline"
                    disabled={busy !== null || (dated && badRange) || empty}
                    onClick={() => download(key, dated)}
                  >
                    {busy === key ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                    Download CSV
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!!catalogue.data?.recent.length && (
        <section className="rounded-2xl border border-gray-200 bg-white">
          <h2 className="border-b border-gray-100 px-5 py-3 text-sm font-semibold text-gray-900">Recent downloads</h2>
          <ul className="divide-y divide-gray-100">
            {catalogue.data.recent.map((r, i) => (
              <li key={i} className="flex flex-col gap-0.5 px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="min-w-0">
                  <span className="block truncate text-gray-800">{r.summary}</span>
                  {r.file && <span className="block truncate font-mono text-xs text-gray-400">{r.file}</span>}
                </span>
                <span className="shrink-0 text-xs text-gray-500">{r.by ?? "Someone"} · {when(r.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
