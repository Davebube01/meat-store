"use client";

import { useMemo } from "react";
import type { RevenuePoint } from "@/core/api";
import { echarts, ReactEChartsCore } from "./charts";
import { naira, nairaCompact } from "./format";

const BRAND = "#3f7a55";

const dayLabel = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short" });

export function RevenueChart({ series }: { series: RevenuePoint[] }) {
  const total = series.reduce((sum, p) => sum + p.revenue, 0);
  const totalPrev = series.reduce((sum, p) => sum + p.revenue_prev, 0);

  const option = useMemo(
    () => ({
      grid: { left: 8, right: 12, top: 16, bottom: 4, containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#1a1a1a",
        borderWidth: 0,
        textStyle: { color: "#fff", fontSize: 12 },
        formatter: (params: { dataIndex: number }[]) => {
          const p = series[params[0].dataIndex];
          return `<b>${dayLabel(p.date)}</b><br/>${naira(p.revenue)} · ${p.orders} order${p.orders === 1 ? "" : "s"}<br/><span style="opacity:.6">Previous: ${naira(p.revenue_prev)}</span>`;
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: series.map((p) => dayLabel(p.date)),
        axisLine: { lineStyle: { color: "#e6e9e7" } },
        axisTick: { show: false },
        axisLabel: { color: "#7d8581", fontSize: 11, hideOverlap: true },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#f1f3f2" } },
        axisLabel: { color: "#7d8581", fontSize: 11, formatter: (v: number) => nairaCompact(v) },
      },
      series: [
        {
          name: "Previous period",
          type: "line",
          data: series.map((p) => p.revenue_prev),
          symbol: "none",
          lineStyle: { color: "#a8aeab", width: 1.5, type: "dashed" },
          z: 1,
        },
        {
          name: "Revenue",
          type: "line",
          data: series.map((p) => p.revenue),
          smooth: 0.25,
          symbol: "circle",
          symbolSize: 6,
          showSymbol: false,
          lineStyle: { color: BRAND, width: 2.5 },
          itemStyle: { color: BRAND },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(34,197,94,0.22)" },
              { offset: 1, color: "rgba(34,197,94,0.02)" },
            ]),
          },
          z: 2,
        },
      ],
    }),
    [series],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Revenue</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 tabular-nums">{naira(total)}</p>
          <p className="mt-1 text-xs text-gray-400">
            Last {series.length} days · paid online or collected on delivery · courier fees excluded
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded" style={{ background: BRAND }} />
            This period
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-[1.5px] border-dashed border-gray-400" />
            Previous {series.length} days ({naira(totalPrev)})
          </span>
        </div>
      </div>
      <ReactEChartsCore echarts={echarts} option={option} style={{ height: 280 }} notMerge lazyUpdate />
    </div>
  );
}
