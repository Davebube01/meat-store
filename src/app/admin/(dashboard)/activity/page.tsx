"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, AlertTriangle, FileDown, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityItem } from "@/components/admin/activity/ActivityItem";
import { RANGES, TYPES, dayLabel, rangeDates, type RangeKey } from "@/components/admin/activity/format";
import { downloadExport, getActivity, getActivitySummary, type ActivityEntityType, type ActivityEntry } from "@/core/api";
import { cn } from "@/lib/utils";

const PAGE = 50;

const selectClass = "h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#3f7a55]";

function ActivityLog() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Filters live in the URL, so a view can be bookmarked, shared or linked to
  // (the Staff page links to ?actor=<id>).
  const type = (params.get("type") as ActivityEntityType | null) ?? null;
  const actor = params.get("actor");
  const range = (params.get("range") as RangeKey | null) ?? "all";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const flagged = params.get("flagged") === "1";
  const q = params.get("q") ?? "";

  const setParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    const s = next.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };

  const [searchInput, setSearchInput] = useState(q);
  const [limit, setLimit] = useState(PAGE);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput.trim() !== q) setParams({ q: searchInput.trim() || null });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Back to the first page whenever the filters change.
  const filterKey = params.toString();
  const [lastKey, setLastKey] = useState(filterKey);
  if (lastKey !== filterKey) {
    setLastKey(filterKey);
    setLimit(PAGE);
  }

  const dates = useMemo(() => rangeDates(range, from, to), [range, from, to]);
  const filters = { entity_type: type ?? undefined, actor_id: actor ?? undefined, q: q || undefined, flagged: flagged || undefined };

  const list = useQuery({
    queryKey: ["admin-activity", filters, dates, limit],
    queryFn: () => getActivity({ ...filters, ...dates, limit }),
    placeholderData: keepPreviousData,
  });
  const summary = useQuery({
    queryKey: ["admin-activity-summary", q, dates],
    queryFn: () => getActivitySummary({ q: q || undefined, ...dates }),
    placeholderData: keepPreviousData,
  });

  // Entries grouped under their Abuja day.
  const days = useMemo(() => {
    const groups: { label: string; items: ActivityEntry[] }[] = [];
    for (const entry of list.data?.items ?? []) {
      const label = dayLabel(entry.created_at);
      if (groups.at(-1)?.label === label) groups.at(-1)!.items.push(entry);
      else groups.push({ label, items: [entry] });
    }
    return groups;
  }, [list.data]);

  const s = summary.data;
  const actorName = s?.actors.find((a) => a.id === actor)?.name;
  const anyFilter = !!(type || actor || range !== "all" || flagged || q);

  const exportCsv = async () => {
    setExporting(true);
    try {
      await downloadExport("activity", dates, filters);
    } catch (err) {
      toast.error((err as Error)?.message || "Couldn't download the export");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Audit</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Activity</h1>
          <p className="mt-1 text-sm text-gray-500">Who changed what in the admin, and when.</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={exporting} title={anyFilter ? "Exports what's shown, with these filters" : undefined}>
          {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
          {anyFilter ? "Export these" : "Export CSV"}
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search what happened, a product, a person"
              aria-label="Search activity"
              className="h-10 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-[#3f7a55] [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
          <select aria-label="Person" value={actor ?? ""} onChange={(e) => setParams({ actor: e.target.value || null })} className={selectClass}>
            <option value="">Everyone</option>
            {actor && !actorName && <option value={actor}>Selected person</option>}
            {s?.actors.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.count})</option>)}
          </select>
          <select
            aria-label="When"
            value={range}
            onChange={(e) => setParams({ range: e.target.value === "all" ? null : e.target.value, ...(e.target.value !== "custom" && { from: null, to: null }) })}
            className={selectClass}
          >
            {RANGES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
          {range === "custom" && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input type="date" aria-label="From" value={from} max={to || undefined} onChange={(e) => setParams({ from: e.target.value })} className={selectClass} />
              to
              <input type="date" aria-label="To" value={to} min={from || undefined} onChange={(e) => setParams({ to: e.target.value })} className={selectClass} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={flagged}
            onClick={() => setParams({ flagged: flagged ? null : "1" })}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium",
              flagged ? "border-amber-500 bg-amber-50 text-amber-800" : "border-gray-200 text-gray-600 hover:border-gray-300",
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Worth a look
            {s && <span className="tabular-nums text-xs opacity-70">{s.flagged}</span>}
          </button>
          <span className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" />
          <button
            type="button"
            aria-pressed={!type}
            onClick={() => setParams({ type: null })}
            className={cn("rounded-full border px-3.5 py-1.5 text-sm font-medium", !type ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d]" : "border-gray-200 text-gray-600 hover:border-gray-300")}
          >
            Everything {s && <span className="tabular-nums text-xs opacity-70">{s.total}</span>}
          </button>
          {TYPES.filter((t) => !s || s.types[t.key] || type === t.key).map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={type === t.key}
              onClick={() => setParams({ type: type === t.key ? null : t.key })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                type === t.key ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d]" : "border-gray-200 text-gray-600 hover:border-gray-300",
              )}
            >
              {t.label} {s && <span className="tabular-nums text-xs opacity-70">{s.types[t.key] ?? 0}</span>}
            </button>
          ))}
          {anyFilter && (
            <button
              type="button"
              onClick={() => { setSearchInput(""); router.replace(pathname, { scroll: false }); }}
              className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {list.isPending ? (
        <div className="flex justify-center p-24 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : list.isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="flex-1">{(list.error as Error)?.message || "Couldn't load activity"}</p>
          <Button variant="outline" size="sm" onClick={() => list.refetch()}>Retry</Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {days.length === 0 ? (
            <p className="px-5 py-16 text-center text-sm text-gray-400">
              {anyFilter ? "Nothing matches these filters." : "No admin activity recorded yet."}
            </p>
          ) : (
            <>
              {days.map((d) => (
                <section key={d.label}>
                  <h2 className="border-y border-gray-100 bg-gray-50 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {d.label}
                  </h2>
                  <ul className="divide-y divide-gray-100">
                    {d.items.map((entry) => (
                      <ActivityItem key={entry.id} entry={entry} onPerson={(id) => setParams({ actor: id })} />
                    ))}
                  </ul>
                </section>
              ))}
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
                <span>Showing {list.data!.items.length} of {list.data!.total}</span>
                {list.data!.items.length < list.data!.total && (
                  <Button variant="outline" size="sm" disabled={list.isFetching} onClick={() => setLimit(limit + PAGE)}>
                    {list.isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load more"}
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

export default function ActivityPage() {
  return (
    <Suspense>
      <ActivityLog />
    </Suspense>
  );
}
