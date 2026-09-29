"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ArrowLeft, Check, Loader2, Mail, MessageCircle, Package, Phone, RotateCcw, Send, Trash2, UserRound } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteAdminMessage, replyToAdminMessage, setAdminMessageStatus, type ContactMessage,
} from "@/core/api/admin/messages";
import { useAdminCan } from "@/core/store/useAdminCan";
import { cn } from "@/lib/utils";
import { TOPIC_LABELS, TOPIC_STYLES, longWhen, waLink } from "./format";

interface Props {
  m: ContactMessage;
  onChanged: (m: ContactMessage) => void;
  onDeleted: () => void;
  onBack: () => void;
}

const chip = "inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50";

export function MessageDetail({ m, onChanged, onDeleted, onBack }: Props) {
  const can = useAdminCan();
  const [reply, setReply] = useState("");
  const [markHandled, setMarkHandled] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggle = useMutation({
    mutationFn: () => setAdminMessageStatus(m.id, m.status === "new" ? "handled" : "new"),
    onSuccess: onChanged,
    onError: (e: Error) => toast.error(e.message),
  });
  const send = useMutation({
    mutationFn: () => replyToAdminMessage(m.id, reply.trim(), markHandled),
    onSuccess: (updated) => {
      setReply("");
      onChanged(updated);
      toast.success(`Reply sent to ${updated.email}`);
    },
  });
  const remove = useMutation({
    mutationFn: () => deleteAdminMessage(m.id),
    onSuccess: () => {
      setConfirmDelete(false);
      toast.success("Message deleted");
      onDeleted();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const firstName = m.name.trim().split(/\s+/)[0];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-100 p-5 md:p-6">
        <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 lg:hidden">
          <ArrowLeft className="h-4 w-4" /> All messages
        </button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-gray-900">{m.name}</h2>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", TOPIC_STYLES[m.topic])}>{TOPIC_LABELS[m.topic]}</span>
              {m.status === "handled" && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Handled</span>}
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{m.email}{m.phone && ` · ${m.phone}`}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggle.mutate()}
              disabled={toggle.isPending}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold disabled:opacity-60",
                m.status === "new" ? "bg-[#3f7a55] text-white hover:bg-[#2d583d]" : "border border-gray-200 text-gray-700 hover:bg-gray-50",
              )}
            >
              {toggle.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : m.status === "new" ? <Check className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
              {m.status === "new" ? "Mark handled" : "Reopen"}
            </button>
            <button type="button" onClick={() => setConfirmDelete(true)} title="Delete message" aria-label="Delete message" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {m.phone && (
            <>
              <a href={`tel:${m.phone}`} className={chip}><Phone className="h-3.5 w-3.5" /> Call</a>
              <a href={waLink(m.phone)} target="_blank" rel="noreferrer" className={chip}><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>
            </>
          )}
          <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`} className={chip}><Mail className="h-3.5 w-3.5" /> Email app</a>
          {m.user_id && can("customers.view") && (
            <Link href={`/admin/customers/${m.user_id}`} className={chip}><UserRound className="h-3.5 w-3.5" /> Customer</Link>
          )}
          {m.order_ref && (m.order_id && can("orders.view") ? (
            <Link href={`/admin/orders/${m.order_id}`} className={chip}><Package className="h-3.5 w-3.5" /> Order {m.order_ref.toUpperCase()}</Link>
          ) : (
            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-gray-50 px-3 text-sm text-gray-500" title="No single order matches this number">
              <Package className="h-3.5 w-3.5" /> Order {m.order_ref} (not found)
            </span>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-[#fafbfa] p-5 md:p-6">
        <div className="max-w-[85%]">
          <div className="rounded-2xl rounded-tl-sm border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-800 whitespace-pre-line">{m.message}</div>
          <p className="mt-1 px-1 text-xs text-gray-400">{firstName} · {longWhen(m.created_at)}</p>
        </div>
        {m.replies.map((r) => (
          <div key={r.id} className="ml-auto max-w-[85%]">
            <div className="rounded-2xl rounded-tr-sm bg-[#3f7a55] p-4 text-sm leading-relaxed text-white whitespace-pre-line">{r.body}</div>
            <p className="mt-1 px-1 text-right text-xs text-gray-400">{r.sent_by ?? "Staff"} · emailed {longWhen(r.sent_at)}</p>
          </div>
        ))}
        {m.status === "handled" && m.handled_at && (
          <p className="text-center text-xs text-gray-400">Marked handled {longWhen(m.handled_at)}{m.handled_by && ` by ${m.handled_by}`}</p>
        )}
      </div>

      {/* Reply */}
      <form
        className="border-t border-gray-100 p-4 md:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (reply.trim().length >= 2 && !send.isPending) send.mutate();
        }}
      >
        <label htmlFor="reply" className="sr-only">Reply to {m.name}</label>
        <textarea
          id="reply"
          rows={3}
          maxLength={5000}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) e.currentTarget.form?.requestSubmit();
          }}
          placeholder={`Reply to ${firstName}…`}
          className="w-full resize-y rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-[#3f7a55] focus:ring-2 focus:ring-[#3f7a55]/15"
        />
        {send.isError && <p className="mt-2 text-sm text-red-600">{(send.error as Error).message}</p>}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Sent by email to {m.email}.{" "}
            {m.status === "new" && (
              <label className="ml-1 inline-flex cursor-pointer items-center gap-1.5 text-gray-600">
                <input type="checkbox" checked={markHandled} onChange={(e) => setMarkHandled(e.target.checked)} className="h-3.5 w-3.5 accent-[#3f7a55]" />
                Mark handled
              </label>
            )}
          </div>
          <button
            type="submit"
            disabled={reply.trim().length < 2 || send.isPending}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#3f7a55] px-4 text-sm font-semibold text-white hover:bg-[#2d583d] disabled:opacity-50"
          >
            {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send reply
          </button>
        </div>
      </form>

      <Dialog open={confirmDelete} onOpenChange={(o) => !remove.isPending && setConfirmDelete(o)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this message?</DialogTitle>
            <DialogDescription>
              {m.name}&apos;s message{m.replies.length ? " and your replies" : ""} will be removed for good. Use this for spam; mark real messages handled instead.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <button type="button" onClick={() => setConfirmDelete(false)} className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Keep it
            </button>
            <button type="button" onClick={() => remove.mutate()} disabled={remove.isPending} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
              {remove.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
