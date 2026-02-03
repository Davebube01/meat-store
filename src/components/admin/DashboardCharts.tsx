"use client";

import ReactECharts from "echarts-for-react";

export function SalesChart() {
  const option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#eee",
        },
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: "Sales",
        type: "line",
        smooth: true,
        data: [15000, 23000, 22000, 34000, 28000, 45000, 52000],
        itemStyle: {
          color: "#FF6B35",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(255, 107, 53, 0.2)",
              },
              {
                offset: 1,
                color: "rgba(255, 107, 53, 0)",
              },
            ],
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "350px" }} />;
}

export function OrderStatusChart() {
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "0%",
      left: "center",
    },
    series: [
      {
        name: "Order Status",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Pending", itemStyle: { color: "#fbbf24" } },
          { value: 735, name: "Processing", itemStyle: { color: "#3b82f6" } },
          { value: 580, name: "Delivered", itemStyle: { color: "#22c55e" } },
          { value: 484, name: "Cancelled", itemStyle: { color: "#ef4444" } },
        ],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "350px" }} />;
}
