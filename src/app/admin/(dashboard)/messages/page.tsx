"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Inbox, MessageSquareReply, Search, X } from "lucide-react";
import { MessageDetail } from "@/components/admin/messages/MessageDetail";
import { TOPIC_LABELS, TOPIC_STYLES, shortWhen } from "@/components/admin/messages/format";
import {
  getAdminMessage, getAdminMessages, type ContactMessage, type MessageStatus, type MessageTopic,
} from "@/core/api/admin/messages";
import { cn } from "@/lib/utils";

type Filter = MessageStatus | "all";

function MessagesInbox() {
  const router = useRouter();
  const params = useSearchParams();
  const openId = params.get("open");
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<Filter>("new");
  const [topic, setTopic] = useState<MessageTopic | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setQ(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const list = useQuery({
    queryKey: ["admin-messages", status, topic, q],
    queryFn: () => getAdminMessages({ status, topic: topic || undefined, q: q || undefined }),
    placeholderData: keepPreviousData,
  });
  // The open message is fetched on its own, so a link from a notification or
  // the activity log works whatever the filters are.
  const selected = useQuery({
    queryKey: ["admin-message", openId],
    queryFn: () => getAdminMessage(openId!),
    enabled: !!openId,
  });

  const open = (id: string | null) => router.replace(id ? `/admin/messages?open=${id}` : "/admin/messages", { scroll: false });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    queryClient.invalidateQueries({ queryKey: ["admin-messages-new"] });
    queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
  };
  const changed = (m: ContactMessage) => {
    queryClient.setQueryData(["admin-message", m.id], m);
    refresh();
  };

  const rows = list.data?.messages ?? [];
  const counts = list.data;
  const TABS: { key: Filter; label: string; count?: number }[] = [
    { key: "new", label: "New", count: counts?.new_count },
    { key: "handled", label: "Handled", count: counts?.handled_count },
    { key: "all", label: "All" },
  ];
  const filtered = !!(topic || q);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-gray-500">Sales</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">From the store&apos;s Contact page. Replies are emailed to the customer and kept here.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setStatus(t.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium",
                status === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800",
              )}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={cn("rounded-full px-1.5 text-xs tabular-nums", t.key === "new" && t.count > 0 ? "bg-[#22c55e] text-white" : "bg-gray-200 text-gray-600")}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
        <select
          aria-label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as MessageTopic | "")}
          className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700"
        >
          <option value="">All topics</option>
          {(Object.keys(TOPIC_LABELS) as MessageTopic[]).map((k) => <option key={k} value={k}>{TOPIC_LABELS[k]}</option>)}
        </select>
        <div className="relative md:ml-auto md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, email, order, text"
            aria-label="Search messages"
            className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-9 text-sm outline-none focus:border-[#3f7a55] [&::-webkit-search-cancel-button]:hidden"
          />
          {searchInput && (
            <button type="button" onClick={() => setSearchInput("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {list.isError ? (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> Couldn&apos;t load messages.
          <button type="button" onClick={() => list.refetch()} className="font-semibold underline">Try again</button>
        </div>
      ) : (
        <div className="grid min-h-[560px] grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white lg:h-[calc(100vh-280px)] lg:grid-cols-[minmax(0,360px)_1fr]">
          {/* List: hidden on small screens while a message is open */}
          <ul className={cn("divide-y divide-gray-100 overflow-y-auto border-gray-200 lg:border-r", openId && "hidden lg:block")}>
            {list.isPending &&
              Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="space-y-2 p-4">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                </li>
              ))}
            {!list.isPending && rows.length === 0 && (
              <li className="flex flex-col items-center gap-2 px-6 py-16 text-center text-sm text-gray-500">
                <Inbox className="h-9 w-9 text-gray-300" />
                {filtered ? "No messages match." : status === "new" ? "You're all caught up." : "No messages yet."}
              </li>
            )}
            {rows.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => open(m.id)}
                  className={cn(
                    "block w-full border-l-2 p-4 text-left transition-colors hover:bg-[#f4f7f5]",
                    openId === m.id ? "border-[#3f7a55] bg-[#f4f7f5]" : "border-transparent",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("flex min-w-0 items-center gap-2 text-sm", m.status === "new" ? "font-semibold text-gray-900" : "text-gray-700")}>
                      {m.status === "new" && <span className="h-2 w-2 shrink-0 rounded-full bg-[#22c55e]" aria-label="New" />}
                      <span className="truncate">{m.name}</span>
                    </span>
                    <span className="shrink-0 text-xs text-gray-400">{shortWhen(m.created_at)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{m.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", TOPIC_STYLES[m.topic])}>{TOPIC_LABELS[m.topic]}</span>
                    {m.replies.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                        <MessageSquareReply className="h-3 w-3" /> {m.replies.length} {m.replies.length === 1 ? "reply" : "replies"}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className={cn("min-h-0", !openId && "hidden lg:block")}>
            {selected.data ? (
              <MessageDetail
                key={selected.data.id}
                m={selected.data}
                onChanged={changed}
                onDeleted={() => {
                  queryClient.removeQueries({ queryKey: ["admin-message", openId] });
                  open(null);
                  refresh();
                }}
                onBack={() => open(null)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center text-sm text-gray-500">
                {openId && selected.isError ? (
                  <>
                    <AlertCircle className="h-8 w-8 text-gray-300" />
                    This message no longer exists.
                    <button type="button" onClick={() => open(null)} className="font-semibold text-[#3f7a55] hover:underline">Back to messages</button>
                  </>
                ) : openId ? (
                  "Loading…"
                ) : (
                  <>
                    <Inbox className="h-9 w-9 text-gray-300" />
                    Pick a message to read and reply.
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesInbox />
    </Suspense>
  );
}
