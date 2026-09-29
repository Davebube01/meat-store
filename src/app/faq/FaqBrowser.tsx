"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Search, X } from "lucide-react";
import { FAQ_SECTIONS, type Faq } from "@/core/api/user/faq";
import type { DeliveryZone } from "@/core/api/user/delivery";
import { cn } from "@/lib/utils";

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

function Item({ faq, open }: { faq: Faq; open: boolean }) {
  return (
    <details open={open} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900">
        {faq.question}
        <span className="text-xl leading-none text-gray-400 transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">{faq.answer}</p>
    </details>
  );
}

function Zones({ zones }: { zones: DeliveryZone[] }) {
  const sorted = [...zones].sort((a, b) => a.estimated_fee - b.estimated_fee);
  return (
    <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-semibold text-gray-900">Where we deliver</p>
      <p className="mt-0.5 text-xs text-gray-500">Estimated courier fee, paid in cash on arrival. Pickup is free.</p>
      <ul className="mt-3 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {sorted.map((z) => (
          <li key={z.id} className="flex items-center justify-between gap-3 border-b border-gray-100 py-2 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-gray-700">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#3f7a55]" />
              <span className="truncate">{z.name}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-gray-900">{naira(z.estimated_fee)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FaqBrowser({ faqs, zones }: { faqs: Faq[]; zones: DeliveryZone[] }) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();

  const sections = useMemo(() => {
    const matches = term
      ? faqs.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(term))
      : faqs;
    return FAQ_SECTIONS.map((s) => ({ ...s, items: matches.filter((f) => f.section === s.key) })).filter(
      (s) => s.items.length > 0,
    );
  }, [faqs, term]);
  const count = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <>
      <div className="relative -mt-7 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions, e.g. delivery fee"
          aria-label="Search questions"
          className="h-13 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 text-base shadow-sm outline-none focus:border-[#3f7a55] focus:ring-2 focus:ring-[#3f7a55]/20 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {term && (
        <p className="mt-3 text-sm text-gray-500" aria-live="polite">
          {count === 0 ? "No questions match." : `${count} question${count === 1 ? "" : "s"} match.`}
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        {!term && (
          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="sticky top-32 space-y-1">
              {sections.map((s) => (
                <li key={s.key}>
                  <a href={`#${s.key}`} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-[#f4f7f5] hover:text-[#2d583d]">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className={cn("min-w-0 space-y-10", term && "lg:col-span-2 lg:max-w-3xl")}>
          {sections.map((s) => (
            <section key={s.key} id={s.key} className="scroll-mt-32">
              <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a]">{s.label}</h2>
              <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
                {s.items.map((f, i) => (
                  <Item key={`${f.id ?? f.question}-${term ? "q" : ""}`} faq={f} open={!!term && i < 3} />
                ))}
              </div>
              {s.key === "delivery" && !term && zones.length > 0 && <Zones zones={zones} />}
            </section>
          ))}

          {count === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="font-medium text-gray-900">Can&apos;t find it?</p>
              <p className="mt-1 text-sm text-gray-500">Ask us directly and we&apos;ll get back to you.</p>
              <Link href="/contact" className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#3f7a55] px-5 text-sm font-semibold text-white hover:bg-[#2d583d]">
                Contact us
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
