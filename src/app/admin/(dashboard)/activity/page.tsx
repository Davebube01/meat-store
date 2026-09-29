"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, Boxes, FileDown, Inbox, Loader2, LogIn, Search, Settings, ShoppingBag, ShoppingCart, Store, Tags, type LucideIcon, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadExport, getActivity, type ActivityEntityType, type ActivityEntry } from "@/core/api";
import { cn } from "@/lib/utils";

const PAGE = 50;

const TYPES: { key: ActivityEntityType | "all"; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "product", label: "Products & stock" },
  { key: "order", label: "Orders" },
  { key: "sale", label: "Counter sales" },
  { key: "category", label: "Categories" },
  { key: "settings", label: "Settings" },
  { key: "staff", label: "Staff" },
  { key: "message", label: "Messages" },
  { key: "admin", label: "Sign-ins & exports" },
];

const ICONS: Record<string, LucideIcon> = {
  product: ShoppingBag, order: ShoppingCart, sale: Store, category: Tags, settings: Settings, admin: LogIn, staff: UserCog, message: Inbox,
};

const FIELD_NAMES: Record<string, string> = {
  cost_price: "Cost price", weight_options: "Sizes", parts: "Cuts", is_active: "Visible", low_stock_threshold: "Low-stock alert",
  image_url: "Image", stock: "Stock", status: "Status",
};

const label = (field: string, entityType: string) => {
  // Only products are "visible"; for staff accounts is_active means active.
  const name = (entityType === "product" ? FIELD_NAMES[field] : field === "is_active" ? "Active" : FIELD_NAMES[field])
    ?? field.replace(/_/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });

function show(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString("en-NG");
  if (Array.isArray(value)) {
    return value.map((v) => (v && typeof v === "object" && "label" in v ? `${(v as { label: string }).label} ₦${(v as { price: number }).price?.toLocaleString("en-NG")}` : String(v))).join(", ") || "—";
  }
  if (typeof value === "string") return value.length > 80 ? `${value.slice(0, 80)}…` : value.replace(/_/g, " ");
  return JSON.stringify(value);
}

function linkFor(entry: ActivityEntry): string | null {
  if (!entry.entity_id) return null;
  if (entry.entity_type === "order") return `/admin/orders/${entry.entity_id}`;
  if (entry.entity_type === "sale") return `/admin/sales/${entry.entity_id}`;
  if (entry.entity_type === "message") return `/admin/messages?open=${entry.entity_id}`;
  return null;
}

function Entry({ entry }: { entry: ActivityEntry }) {
  const Icon = ICONS[entry.entity_type] ?? Boxes;
  const href = linkFor(entry);
  const changes = entry.changes ? Object.entries(entry.changes) : [];
  return (
    <li className="flex gap-3 px-5 py-4">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900">
          {href ? <Link href={href} className="hover:underline">{entry.summary}</Link> : entry.summary}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          {entry.actor_name ?? "System"} · {when(entry.created_at)}
        </p>
        {changes.length > 0 && (
          <dl className="mt-2 grid gap-1 rounded-lg bg-gray-50 px-3 py-2 text-xs sm:grid-cols-[auto_1fr] sm:gap-x-4">
            {changes.map(([field, change]) => (
              <div key={field} className="contents">
                <dt className="font-medium text-gray-500">{label(field, entry.entity_type)}</dt>
                <dd className="text-gray-700">
                  <span className="text-gray-400 line-through">{show(change.from)}</span> → {show(change.to)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </li>
  );
}

export default function ActivityPage() {
  const [type, setType] = useState<ActivityEntityType | "all">("all");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [exporting, setExporting] = useState(false);

  // Search as you type, without a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setLimit(PAGE);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-activity", type, q, limit],
    queryFn: () => getActivity({ entity_type: type === "all" ? undefined : type, q: q || undefined, limit }),
    placeholderData: keepPreviousData,
  });

  const exportAll = async () => {
    setExporting(true);
    try {
      await downloadExport("activity");
    } catch (err) {
      toast.error((err as Error)?.message || "Couldn't download the export");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Audit</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Activity</h1>
          <p className="mt-1 text-sm text-gray-500">Who changed what in the admin, and when.</p>
        </div>
        <Button variant="outline" onClick={exportAll} disabled={exporting}>
          {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />} Export CSV
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={type === t.key}
              onClick={() => {
                setType(t.key);
                setLimit(PAGE);
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                type === t.key ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d]" : "border-gray-200 text-gray-600 hover:border-gray-300",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activity" aria-label="Search activity" className="pl-9" />
        </div>
      </div>

      {isPending ? (
        <div className="flex justify-center p-24 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="flex-1">{(error as Error)?.message || "Couldn't load activity"}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {data!.items.length === 0 ? (
            <p className="px-5 py-16 text-center text-sm text-gray-400">
              {q || type !== "all" ? "Nothing matches." : "No admin activity recorded yet."}
            </p>
          ) : (
            <>
              <ul className="divide-y divide-gray-100">
                {data!.items.map((entry) => <Entry key={entry.id} entry={entry} />)}
              </ul>
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
                <span>Showing {data!.items.length} of {data!.total}</span>
                {data!.items.length < data!.total && (
                  <Button variant="outline" size="sm" disabled={isFetching} onClick={() => setLimit(limit + PAGE)}>
                    {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load more"}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
