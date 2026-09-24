// Register only the echarts pieces the dashboard uses, instead of the full
// ~1MB bundle that `import ReactECharts from "echarts-for-react"` pulls in.
import * as echarts from "echarts/core";
import { LineChart, PieChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([LineChart, PieChart, GridComponent, TooltipComponent, CanvasRenderer]);

export { echarts };
export { default as ReactEChartsCore } from "echarts-for-react/lib/core";
