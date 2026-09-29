"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LegalText } from "@/components/legal/LegalText";
import { parseLegal } from "@/components/legal/parseLegal";
import { getAdminLegalPage, saveAdminLegalPage, type AdminLegalPage } from "@/core/api/admin/pages";
import type { LegalSlug } from "@/core/api/user/pages";
import { cn } from "@/lib/utils";

const PAGES: { slug: LegalSlug; label: string }[] = [
  { slug: "terms", label: "Terms of service" },
  { slug: "privacy", label: "Privacy policy" },
];

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" });

/** Placeholders are shown as-is in the preview; the store's details fill them on the live page. */
function Editor({ page, onSaved }: { page: AdminLegalPage; onSaved: (p: AdminLegalPage) => void }) {
  const [body, setBody] = useState(page.body);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const dirty = body.trim() !== page.body.trim();
  const isDefaultText = body.trim() === page.default_body.trim();
  const tooShort = body.trim().length < 200;

  const save = useMutation({
    mutationFn: (text: string) => saveAdminLegalPage(page.slug, text),
    onSuccess: (saved) => {
      onSaved(saved);
      toast.success(saved.is_default ? `${saved.title} reset to the default text` : `${saved.title} saved`);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
        <span>
          {page.is_default ? "Using the built-in text." : `Your own text, last saved ${shortDate(page.updated_at)}${page.updated_by ? ` by ${page.updated_by}` : ""}.`}
        </span>
        <a href={`/${page.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-[#3f7a55] hover:underline">
          View live page <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-sm font-medium sm:w-fit">
        {(["write", "preview"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={cn("flex-1 rounded-md px-4 py-1.5 capitalize", tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
            {t}
          </button>
        ))}
      </div>

      {tab === "write" ? (
        <Textarea
          aria-label={`${page.title} text`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={24}
          maxLength={40000}
          className="font-mono text-[13px] leading-relaxed"
        />
      ) : (
        <div className="max-h-[640px] overflow-y-auto rounded-xl border border-gray-200 p-6">
          <LegalText blocks={parseLegal(body)} />
        </div>
      )}

      <details className="rounded-xl bg-[#f7f8f7] px-4 py-3 text-sm text-gray-600">
        <summary className="cursor-pointer font-medium text-gray-800">Formatting and placeholders</summary>
        <ul className="mt-2 space-y-1">
          <li><code className="text-gray-900">## Heading</code> starts a section (listed under &quot;On this page&quot;)</li>
          <li><code className="text-gray-900">- item</code> makes a bullet, <code className="text-gray-900">**bold**</code> makes bold text</li>
          <li><code className="text-gray-900">[text](/contact)</code> makes a link (to a page on this site, <code>mailto:</code> or <code>https://</code>)</li>
          <li>A blank line starts a new paragraph</li>
          <li>
            <code className="text-gray-900">{"{store_name}"}</code>, <code className="text-gray-900">{"{address}"}</code> and{" "}
            <code className="text-gray-900">{"{contact}"}</code> (your email, phone and Contact page) are filled in from Store details
          </li>
        </ul>
      </details>

      {save.isError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{(save.error as Error).message}</p>}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {!isDefaultText && (
          <Button type="button" variant="ghost" onClick={() => setBody(page.default_body)}>
            Use the default text
          </Button>
        )}
        {dirty && (
          <Button type="button" variant="ghost" onClick={() => setBody(page.body)}>
            Discard changes
          </Button>
        )}
        <Button type="button" disabled={!dirty || tooShort || save.isPending} onClick={() => save.mutate(body)} className="bg-[#3f7a55] hover:bg-[#2d583d]">
          {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save {page.title.toLowerCase()}
        </Button>
      </div>
      {dirty && tooShort && <p className="text-right text-xs text-red-600">The page needs at least 200 characters.</p>}
    </div>
  );
}

export function LegalPagesEditor() {
  const queryClient = useQueryClient();
  const [slug, setSlug] = useState<LegalSlug>("terms");
  const q = useQuery({ queryKey: ["admin-legal", slug], queryFn: () => getAdminLegalPage(slug) });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">Legal pages</h2>
        <p className="mt-1 text-sm text-gray-500">
          Your Terms of service and Privacy policy, linked from the footer, sign-up and checkout.
        </p>
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          The built-in text describes how this store works, but it&apos;s a starting point, not legal advice. Have a lawyer review
          it, especially the refund and responsibility sections, and update it if you change how you work.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex gap-2">
          {PAGES.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSlug(p.slug)}
              className={cn(
                "h-9 rounded-full border px-4 text-sm font-medium",
                slug === p.slug ? "border-[#3f7a55] bg-[#3f7a55] text-white" : "border-gray-200 text-gray-700 hover:border-gray-300",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        {q.data ? (
          <Editor
            key={`${q.data.slug}-${q.data.updated_at}-${q.data.is_default}`}
            page={q.data}
            onSaved={(saved) => queryClient.setQueryData(["admin-legal", saved.slug], saved)}
          />
        ) : q.isError ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" /> Couldn&apos;t load this page.
            <Button variant="outline" size="sm" onClick={() => q.refetch()}>Retry</Button>
          </div>
        ) : (
          <div className="flex justify-center p-16"><Loader2 className="h-6 w-6 animate-spin text-green-600" /></div>
        )}
      </div>
    </div>
  );
}
