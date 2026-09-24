import Link from "next/link";
import Image from "next/image";
import { ChevronRight, PackageCheck } from "lucide-react";
import type { LowStockProduct, TopProduct } from "@/core/api";
import { getThumbnailUrl } from "@/lib/imageUrl";
import { naira } from "./format";

function Thumb({ url, name }: { url: string | null; name: string }) {
  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
      <Image src={getThumbnailUrl(url, 80)} alt={name} fill unoptimized className="object-cover" />
    </div>
  );
}

export function LowStockCard({ items, lowCount, outCount, threshold }: {
  items: LowStockProduct[];
  lowCount: number;
  outCount: number;
  threshold: number;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">Low stock</p>
          <p className="text-xs text-gray-400">
            {outCount} out · {lowCount} at or below {threshold}
          </p>
        </div>
        <Link href="/admin/products" className="inline-flex items-center text-xs font-semibold text-[#3f7a55] hover:underline">
          Products <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-12 text-center">
          <PackageCheck className="h-8 w-8 text-green-500" />
          <p className="text-sm font-medium text-gray-700">All stocked up</p>
          <p className="text-xs text-gray-400">No active product is at or below {threshold}.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((p) => {
            const out = p.stock_quantity <= 0;
            const pct = Math.max(4, Math.min(100, (p.stock_quantity / threshold) * 100));
            return (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <Thumb url={p.image_url} name={p.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full ${out ? "bg-red-500" : "bg-amber-500"}`} style={{ width: out ? "4%" : `${pct}%` }} />
                    </div>
                    <span className={`text-xs font-semibold tabular-nums ${out ? "text-red-600" : "text-amber-600"}`}>
                      {out ? "Out" : `${p.stock_quantity} left`}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/products/${p.slug}`}
                  className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#3f7a55] hover:text-[#3f7a55]"
                >
                  Restock
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function TopProductsCard({ items, rangeLabel }: { items: TopProduct[]; rangeLabel: string }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <p className="text-sm font-semibold text-gray-900">Top products</p>
        <p className="text-xs text-gray-400">{rangeLabel} · by units sold</p>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 py-12 text-sm text-gray-400">No sales in this period</div>
      ) : (
        <ol className="divide-y divide-gray-100">
          {items.map((p, i) => (
            <li key={p.product_id} className="flex items-center gap-3 px-5 py-3">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                  i === 0 ? "bg-green-100 text-[#2d583d]" : "bg-gray-100 text-gray-500"
                }`}
              >
                {i + 1}
              </span>
              <Thumb url={p.image_url} name={p.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">{naira(p.revenue)} revenue</p>
              </div>
              <span className="text-sm font-semibold tabular-nums text-gray-900">{p.units} sold</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
