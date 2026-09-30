import type { SalesDay } from "@/core/api";
import { naira } from "./ticket";

const hourLabel = (h: number) => (h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`);

/** Best sellers and a simple sales-by-hour chart for the day. */
export function DayInsights({ day }: { day: SalesDay }) {
  if (day.summary.count === 0) return null;

  // Shop hours at least, widened to any hour that had sales.
  const first = Math.min(8, ...day.hourly.map((h) => h.hour));
  const last = Math.max(19, ...day.hourly.map((h) => h.hour));
  const byHour = new Map(day.hourly.map((h) => [h.hour, h]));
  const peak = Math.max(...day.hourly.map((h) => h.total), 1);
  const busiest = [...day.hourly].sort((a, b) => b.total - a.total)[0];

  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">Best sellers</h2>
        <ol className="mt-3 space-y-2.5">
          {day.top_items.map((t, i) => (
            <li key={t.product_id} className="flex items-center gap-3 text-sm">
              <span className="w-4 text-xs font-semibold text-gray-400">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-gray-800">{t.name}</span>
              <span className="text-xs text-gray-500">×{t.quantity}</span>
              <span className="w-20 text-right font-medium tabular-nums text-gray-900">{naira(t.total)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-900">By hour</h2>
          {busiest && <p className="text-xs text-gray-500">Busiest {hourLabel(busiest.hour)}–{hourLabel((busiest.hour + 1) % 24)}</p>}
        </div>
        <div className="mt-4 flex h-28 items-end gap-1" role="img" aria-label="Sales by hour">
          {Array.from({ length: last - first + 1 }, (_, i) => first + i).map((h) => {
            const v = byHour.get(h);
            return (
              <div key={h} className="group relative flex h-full flex-1 flex-col justify-end">
                <div
                  className={v ? "rounded-t bg-[#3f7a55] group-hover:bg-[#2d583d]" : "rounded-t bg-gray-100"}
                  style={{ height: v ? `${Math.max(6, (v.total / peak) * 100)}%` : "3px" }}
                />
                {v && (
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[11px] text-white group-hover:block">
                    {hourLabel(h)}: {naira(v.total)} · {v.count} sale{v.count === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-gray-400">
          <span>{hourLabel(first)}</span>
          <span>{hourLabel(last)}</span>
        </div>
      </section>
    </>
  );
}
