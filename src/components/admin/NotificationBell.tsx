"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Mail, PackageX, TriangleAlert } from "lucide-react";
import {
  AdminNotification,
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} from "@/core/api";

const QUERY_KEY = ["admin-notifications"];

function timeAgo(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function Item({ n, onOpen }: { n: AdminNotification; onOpen: (n: AdminNotification) => void }) {
  const out = n.kind === "out_of_stock";
  const message = n.kind === "contact_message";
  const Icon = message ? Mail : out ? PackageX : TriangleAlert;
  const content = (
    <div className={`flex gap-3 px-4 py-3 ${n.read_at ? "opacity-60" : ""} hover:bg-gray-50`}>
      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${message ? "bg-[#f4f7f5] text-[#3f7a55]" : out ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{n.title}</p>
        {n.body && <p className="text-xs text-gray-500">{n.body}</p>}
        <p className="mt-0.5 text-[11px] text-gray-400">{timeAgo(n.created_at)}</p>
      </div>
      {!n.read_at && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#3f7a55]" aria-label="Unread" />}
    </div>
  );
  return n.link ? (
    <Link href={n.link} onClick={() => onOpen(n)} className="block">
      {content}
    </Link>
  ) : (
    <button type="button" onClick={() => onOpen(n)} className="block w-full text-left">
      {content}
    </button>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getAdminNotifications(),
    refetchInterval: 60_000,
  });
  const unread = data?.unread_count ?? 0;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const openItem = async (n: AdminNotification) => {
    setOpen(false);
    if (!n.read_at) {
      await markAdminNotificationRead(n.id).catch(() => undefined);
      refresh();
    }
  };

  const readAll = async () => {
    await markAllAdminNotificationsRead().catch(() => undefined);
    refresh();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        className="relative p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            {unread > 0 && (
              <button type="button" onClick={readAll} className="text-xs font-semibold text-[#3f7a55] hover:underline">
                Mark all read
              </button>
            )}
          </div>
          {!data?.items.length ? (
            <p className="px-4 py-10 text-center text-sm text-gray-400">
              Nothing yet. You&apos;ll be told here when a product runs low.
            </p>
          ) : (
            <div className="max-h-96 divide-y divide-gray-100 overflow-y-auto">
              {data.items.map((n) => (
                <Item key={n.id} n={n} onOpen={openItem} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
