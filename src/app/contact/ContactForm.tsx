"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage, type ContactPayload } from "@/core/api/user/contact";
import { useAuthStore } from "@/core/store/useAuthStore";
import { isValidEmail } from "@/lib/authValidation";
import { cn } from "@/lib/utils";

const TOPICS: { key: ContactPayload["topic"]; label: string }[] = [
  { key: "order", label: "An order" },
  { key: "delivery", label: "Delivery" },
  { key: "bulk", label: "Bulk or event order" },
  { key: "feedback", label: "Feedback" },
  { key: "other", label: "Something else" },
];

export function ContactForm() {
  const user = useAuthStore((s) => s.user);
  const [v, setV] = useState<ContactPayload>(() => ({
    name: user?.full_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    topic: "order",
    order_ref: "",
    message: "",
    website: "",
  }));
  const [tried, setTried] = useState(false);
  const set = (patch: Partial<ContactPayload>) => setV((p) => ({ ...p, ...patch }));

  const errors = {
    name: v.name.trim().length < 2 ? "Enter your name" : undefined,
    email: !isValidEmail(v.email) ? "Enter a valid email so we can reply" : undefined,
    message: v.message.trim().length < 10 ? "Tell us a little more (at least 10 characters)" : undefined,
  };
  const valid = !errors.name && !errors.email && !errors.message;

  const send = useMutation({
    mutationFn: () =>
      sendContactMessage({
        ...v,
        name: v.name.trim(),
        email: v.email.trim(),
        phone: v.phone?.trim() || undefined,
        order_ref: v.topic === "order" || v.topic === "delivery" ? v.order_ref?.trim() || undefined : undefined,
        message: v.message.trim(),
      }),
  });

  if (send.isSuccess) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#22c55e]" />
        <h2 className="mt-4 font-serif text-2xl font-semibold text-gray-900">Message sent</h2>
        <p className="mt-2 text-gray-600">Thanks, {v.name.trim().split(" ")[0]}. We&apos;ll reply to {v.email.trim()} as soon as we can.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="inline-flex h-11 items-center rounded-xl bg-[#3f7a55] px-5 font-semibold text-white hover:bg-[#2d583d]">Back to shopping</Link>
          <button type="button" onClick={() => { send.reset(); set({ message: "", order_ref: "" }); setTried(false); }} className="inline-flex h-11 items-center rounded-xl border border-gray-200 px-5 font-semibold text-gray-700 hover:bg-gray-50">
            Send another
          </button>
        </div>
      </div>
    );
  }

  const aboutAnOrder = v.topic === "order" || v.topic === "delivery";

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (valid && !send.isPending) send.mutate();
      }}
      className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 md:p-7"
    >
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-gray-900">What&apos;s it about?</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup">
          {TOPICS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="radio"
              aria-checked={v.topic === t.key}
              onClick={() => set({ topic: t.key })}
              className={cn(
                "h-9 rounded-full border px-4 text-sm font-medium transition-colors",
                v.topic === t.key ? "border-[#3f7a55] bg-[#3f7a55] text-white" : "border-gray-200 text-gray-700 hover:border-gray-300",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" autoComplete="name" value={v.name} maxLength={100} onChange={(e) => set({ name: e.target.value })} aria-invalid={tried && !!errors.name} />
          {tried && errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" autoComplete="email" value={v.email} onChange={(e) => set({ email: e.target.value })} aria-invalid={tried && !!errors.email} />
          {tried && errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-phone">Phone <span className="font-normal text-gray-400">(optional)</span></Label>
          <Input id="c-phone" type="tel" autoComplete="tel" value={v.phone ?? ""} maxLength={30} placeholder="If you'd like a call back" onChange={(e) => set({ phone: e.target.value })} />
        </div>
        {aboutAnOrder && (
          <div className="space-y-1.5">
            <Label htmlFor="c-order">Order number <span className="font-normal text-gray-400">(if you have one)</span></Label>
            <Input id="c-order" value={v.order_ref ?? ""} maxLength={64} placeholder="#1A2B3C4D" className="font-mono uppercase" onChange={(e) => set({ order_ref: e.target.value })} />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="c-message">Message</Label>
        <Textarea
          id="c-message"
          rows={6}
          maxLength={3000}
          value={v.message}
          placeholder={v.topic === "bulk" ? "What you need, how much, and when" : "How can we help?"}
          onChange={(e) => set({ message: e.target.value })}
          aria-invalid={tried && !!errors.message}
        />
        <div className="flex justify-between text-xs">
          <span className="text-red-600">{tried && errors.message}</span>
          <span className="text-gray-400">{v.message.length}/3000</span>
        </div>
      </div>

      {/* Honeypot for bots: hidden from people and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set({ website: e.target.value })} />
      </div>

      {send.isError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {(send.error as { status?: number }).status === 429 ? "You've sent a few messages already. Please try again later or call us." : "Couldn't send your message. Please try again."}
        </p>
      )}

      <p className="text-xs text-gray-500">
        We use your details only to reply to you. See our{" "}
        <Link href="/privacy" className="font-medium text-[#3f7a55] hover:underline">privacy policy</Link>.
      </p>

      <button type="submit" disabled={send.isPending} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3f7a55] font-semibold text-white hover:bg-[#2d583d] disabled:opacity-60 sm:w-auto sm:px-8">
        {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send message
      </button>
    </form>
  );
}
