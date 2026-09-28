import Link from "next/link";
import { Banknote, ShoppingBag, Receipt, PackageCheck, TrendingUp, TrendingDown, Clock, PiggyBank } from "lucide-react";
import type { DashboardKpis, DashboardRange } from "@/core/api";
import { naira, percentChange } from "./format";

const PREV_LABEL: Record<DashboardRange, string> = {
  today: "vs yesterday",
  "7d": "vs previous 7 days",
  "30d": "vs previous 30 days",
};

function Delta({ current, previous, range }: { current: number; previous: number; range: DashboardRange }) {
  const pct = percentChange(current, previous);
  if (pct === null) {
    return <span className="text-xs text-gray-400">No sales to compare {PREV_LABEL[range].replace("vs ", "")}</span>;
  }
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-green-600" : "text-red-600"}`}>
      <Icon className="h-3.5 w-3.5" />
      {up ? "+" : ""}
      {pct.toFixed(1)}%
      <span className="font-normal text-gray-400">{PREV_LABEL[range]}</span>
    </span>
  );
}

function Card({ label, icon: Icon, iconClass, value, children, href }: {
  label: string;
  icon: React.ElementType;
  iconClass: string;
  value: React.ReactNode;
  children: React.ReactNode;
  href?: string;
}) {
  const body = (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-[#3f7a55]/40">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="text-[28px] font-bold leading-none tracking-tight text-gray-900 tabular-nums">{value}</div>
      <div>{children}</div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

function ProfitNote({ kpis, range }: { kpis: DashboardKpis; range: DashboardRange }) {
  if (kpis.gross_profit === null) {
    return (
      <Link href="/admin/products" className="text-xs text-gray-400 hover:text-[#3f7a55]">
        {kpis.revenue ? "Add cost prices to your products to see profit" : "No sales yet"}
      </Link>
    );
  }
  const coverage = kpis.profit_coverage ?? 1;
  return (
    <div className="space-y-1">
      {kpis.gross_profit_prev !== null && (
        <Delta current={kpis.gross_profit} previous={kpis.gross_profit_prev} range={range} />
      )}
      <p className="text-xs text-gray-500">
        {kpis.profit_margin !== null && <>{Math.round(kpis.profit_margin * 100)}% margin</>}
        {coverage < 0.995 && (
          <Link href="/admin/products" className="text-amber-600 hover:underline">
            {" "}· covers {Math.round(coverage * 100)}% of sales
          </Link>
        )}
      </p>
    </div>
  );
}

export function KpiCards({ kpis, range }: { kpis: DashboardKpis; range: DashboardRange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      <Card label="Revenue" icon={Banknote} iconClass="bg-green-50 text-[#3f7a55]" value={naira(kpis.revenue)}>
        <div className="space-y-1">
          <Delta current={kpis.revenue} previous={kpis.revenue_prev} range={range} />
          {kpis.walk_in_revenue > 0 && (
            <Link href="/admin/sales" className="block text-xs text-gray-500 hover:text-[#3f7a55]">
              {naira(kpis.walk_in_revenue)} at the counter
            </Link>
          )}
        </div>
      </Card>
      <Card
        label="Gross profit"
        icon={PiggyBank}
        iconClass="bg-green-50 text-[#3f7a55]"
        value={kpis.gross_profit === null ? "—" : naira(kpis.gross_profit)}
      >
        <ProfitNote kpis={kpis} range={range} />
      </Card>
      <Card label="Orders" icon={ShoppingBag} iconClass="bg-green-50 text-[#3f7a55]" value={kpis.orders}>
        <Delta current={kpis.orders} previous={kpis.orders_prev} range={range} />
      </Card>
      <Card label="Avg order value" icon={Receipt} iconClass="bg-green-50 text-[#3f7a55]" value={naira(kpis.avg_order_value)}>
        <Delta current={kpis.avg_order_value} previous={kpis.avg_order_value_prev} range={range} />
      </Card>
      <Card
        label="Awaiting dispatch"
        icon={PackageCheck}
        iconClass="bg-amber-50 text-amber-600"
        value={kpis.awaiting_dispatch}
        href="/admin/orders"
      >
        {kpis.overdue_dispatch > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
            <Clock className="h-3.5 w-3.5" />
            {kpis.overdue_dispatch} past their delivery slot
          </span>
        ) : (
          <span className="text-xs text-gray-400">
            {kpis.awaiting_dispatch ? "All within their slots" : "Nothing waiting"}
          </span>
        )}
      </Card>
    </div>
  );
}
