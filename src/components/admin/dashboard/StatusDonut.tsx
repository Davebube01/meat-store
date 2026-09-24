"use client";

import { useMemo } from "react";
import { echarts, ReactEChartsCore } from "./charts";
import { statusMeta } from "./format";

export function StatusDonut({ breakdown, rangeLabel }: { breakdown: { status: string; count: number }[]; rangeLabel: string }) {
  const total = breakdown.reduce((sum, s) => sum + s.count, 0);

  const option = useMemo(
    () => ({
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      series: [
        {
          type: "pie",
          radius: ["62%", "86%"],
          avoidLabelOverlap: false,
          padAngle: 2,
          itemStyle: { borderRadius: 4 },
          label: { show: false },
          data: breakdown.map((s) => ({
            name: statusMeta(s.status).label,
            value: s.count,
            itemStyle: { color: statusMeta(s.status).color },
          })),
        },
      ],
    }),
    [breakdown],
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Orders by status</p>
        <span className="text-xs text-gray-400">{rangeLabel}</span>
      </div>

      {total === 0 ? (
        <div className="flex flex-1 items-center justify-center py-12 text-sm text-gray-400">No orders placed yet</div>
      ) : (
        <>
          <div className="relative mx-auto my-2 h-44 w-44">
            <ReactEChartsCore echarts={echarts} option={option} style={{ height: 176, width: 176 }} notMerge />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums text-gray-900">{total}</span>
              <span className="text-xs text-gray-400">orders placed</span>
            </div>
          </div>
          <ul className="mt-2 space-y-2">
            {breakdown.map((s) => {
              const meta = statusMeta(s.status);
              return (
                <li key={s.status} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: meta.color }} />
                  <span className="flex-1 text-gray-600">{meta.label}</span>
                  <span className="font-semibold tabular-nums text-gray-900">{s.count}</span>
                  <span className="w-10 text-right text-xs tabular-nums text-gray-400">
                    {Math.round((s.count / total) * 100)}%
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
