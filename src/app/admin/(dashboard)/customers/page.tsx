"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AlertCircle, BadgeCheck, Loader2, Repeat, Search, UserPlus, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCustomers, getCustomersSummary, type CustomerSort } from "@/core/api";

const PAGE = 50;

const SORTS: { key: CustomerSort; label: string }[] = [
  { key: "recent", label: "Newest" },
  { key: "last_order", label: "Last order" },
  { key: "spent", label: "Top spenders" },
  { key: "orders", label: "Most orders" },
  { key: "name", label: "Name A–Z" },
];

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" });
const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

function Stat({ label, value, sub, icon: Icon }: { label: string; value: number | string; sub: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-[#3f7a55]">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="text-[28px] font-bold leading-none tracking-tight tabular-nums text-gray-900">{value}</div>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}

export default function CustomersPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CustomerSort>("recent");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [limit, setLimit] = useState(PAGE);

  // Search on the server, a moment after typing stops.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setLimit(PAGE);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const summary = useQuery({ queryKey: ["admin-customers-summary"], queryFn: getCustomersSummary });
  const list = useQuery({
    queryKey: ["admin-customers", search, sort, status, limit],
    queryFn: () => getCustomers({ search: search || undefined, sort, status: status === "all" ? undefined : status, limit: limit + 1 }),
    placeholderData: keepPreviousData,
  });

  // We ask for one extra row to know whether there are more.
  const rows = list.data?.slice(0, limit) ?? [];
  const hasMore = (list.data?.length ?? 0) > limit;
  const s = summary.data;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Sales</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Customers</h1>
        <p className="mt-1 text-sm text-gray-500">People with an account. Spending counts only money actually taken.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Customers" value={s?.total_customers ?? "—"} sub={s ? `+ ${s.guest_customers} guest checkout${s.guest_customers === 1 ? "" : "s"} without an account` : " "} icon={Users} />
        <Stat label="New this month" value={s?.new_this_month ?? "—"} sub="Accounts created since the 1st" icon={UserPlus} />
        <Stat
          label="Repeat customers"
          value={s?.repeat_customers ?? "—"}
          sub={s && s.total_customers ? `${Math.round((s.repeat_customers / s.total_customers) * 100)}% have paid for 2+ orders` : "Paid for 2 or more orders"}
          icon={Repeat}
        />
        <Stat
          label="Verified email"
          value={s?.verified ?? "—"}
          sub={s ? `${s.active_last_30_days} ordered in the last 30 days` : " "}
          icon={BadgeCheck}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, email or phone"
              aria-label="Search customers"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as typeof status);
                setLimit(PAGE);
              }}
              aria-label="Account status"
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm"
            >
              <option value="all">All accounts</option>
              <option value="active">Active</option>
              <option value="inactive">Deactivated</option>
            </select>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as CustomerSort);
                setLimit(PAGE);
              }}
              aria-label="Sort by"
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm"
            >
              {SORTS.map((o) => (
                <option key={o.key} value={o.key}>
                  Sort: {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {list.isPending ? (
          <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-green-600" />
            <p>Loading customers…</p>
          </div>
        ) : list.isError ? (
          <div className="m-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p className="flex-1 text-sm">{(list.error as Error).message}</p>
            <Button variant="outline" size="sm" onClick={() => list.refetch()}>
              Retry
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-16 text-center">
            <UserRound className="h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">{search ? `No customers match “${search}”` : "No customers yet"}</p>
          </div>
        ) : (
          <>
          <ul className={`divide-y divide-gray-100 md:hidden ${list.isFetching ? "opacity-60" : ""}`}>
            {rows.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/customers/${c.id}`} className="flex items-center gap-3 px-4 py-3 active:bg-gray-50">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcebe1] text-xs font-semibold text-[#2d583d]">
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-medium text-gray-900">{c.name}</span>
                      {c.email_verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#3f7a55]" aria-label="Email verified" />}
                      {c.status === "inactive" && (
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500">Deactivated</span>
                      )}
                    </div>
                    <p className="truncate text-xs text-gray-400">{c.phone || c.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold tabular-nums text-gray-900">{naira(c.totalSpent)}</p>
                    <p className="text-xs tabular-nums text-gray-400">{c.ordersCount} order{c.ordersCount === 1 ? "" : "s"}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3">Customer</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Phone</th>
                  <th className="px-5 py-3 text-right">Orders</th>
                  <th className="px-5 py-3 text-right">Spent</th>
                  <th className="hidden px-5 py-3 md:table-cell">Last order</th>
                  <th className="hidden px-5 py-3 xl:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-100 ${list.isFetching ? "opacity-60" : ""}`}>
                {rows.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/admin/customers/${c.id}`)}
                    className="cursor-pointer hover:bg-green-50/40"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcebe1] text-xs font-semibold text-[#2d583d]">
                          {initials(c.name)}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/customers/${c.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 font-medium text-gray-900 hover:text-[#3f7a55]"
                          >
                            <span className="truncate">{c.name}</span>
                            {c.email_verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#3f7a55]" aria-label="Email verified" />}
                            {c.status === "inactive" && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500">Deactivated</span>
                            )}
                          </Link>
                          <p className="truncate text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3 text-gray-600 lg:table-cell">{c.phone || <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      <span className="font-semibold text-gray-900">{c.ordersCount}</span>
                      {c.paid_orders !== undefined && c.paid_orders !== c.ordersCount && (
                        <span className="block text-xs text-gray-400">{c.paid_orders} paid</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-gray-900">{naira(c.totalSpent)}</td>
                    <td className="hidden px-5 py-3 text-gray-600 md:table-cell">
                      {c.last_order_at ? shortDate(c.last_order_at) : <span className="text-gray-300">Never</span>}
                    </td>
                    <td className="hidden px-5 py-3 text-gray-500 xl:table-cell">{shortDate(c.joinDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}

        {hasMore && (
          <div className="border-t border-gray-100 p-3 text-center">
            <Button variant="ghost" size="sm" disabled={list.isFetching} onClick={() => setLimit((l) => l + PAGE)}>
              {list.isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Show more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
