"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FAQ_SECTIONS, type Faq, type FaqSection } from "@/core/api/user/faq";
import type { FaqInput } from "@/core/api/admin/faqs";
import { cn } from "@/lib/utils";

interface Row extends FaqInput {
  key: string;
}

interface Props {
  initial: Faq[];
  isDefault: boolean;
  saving: boolean;
  error: string | null;
  onSave: (items: FaqInput[]) => void;
}

let nextKey = 0;
const toRow = (f: Faq): Row => ({ key: f.id ?? `new-${nextKey++}`, id: f.id, section: f.section, question: f.question, answer: f.answer, is_published: f.is_published });
const strip = (rows: Row[]): FaqInput[] => rows.map(({ id, section, question, answer, is_published }) => ({ id, section, question: question.trim(), answer: answer.trim(), is_published }));

/** Keyed by the parent on the saved list, so it resets after each save. */
export function FaqEditor({ initial, isDefault, saving, error, onSave }: Props) {
  const [rows, setRows] = useState<Row[]>(() => initial.map(toRow));
  const [tried, setTried] = useState(false);
  const [initialJson] = useState(() => JSON.stringify(strip(initial.map(toRow))));

  // Saved in section order, so the list matches what customers see.
  const ordered = FAQ_SECTIONS.flatMap((s) => rows.filter((r) => r.section === s.key));
  const dirty = isDefault || JSON.stringify(strip(ordered)) !== initialJson;
  const invalid = (r: Row) => r.question.trim().length < 5 || r.answer.trim().length < 5;
  const anyInvalid = rows.some(invalid);
  const shown = rows.filter((r) => r.is_published).length;

  const update = (key: string, patch: Partial<Row>) => setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const remove = (key: string) => setRows((prev) => prev.filter((r) => r.key !== key));
  const add = (section: FaqSection) =>
    setRows((prev) => [...prev, { key: `new-${nextKey++}`, id: null, section, question: "", answer: "", is_published: true }]);
  const move = (key: string, dir: -1 | 1) =>
    setRows((prev) => {
      const row = prev.find((r) => r.key === key)!;
      const same = prev.filter((r) => r.section === row.section);
      const i = same.indexOf(row);
      const swap = same[i + dir];
      if (!swap) return prev;
      return prev.map((r) => (r === row ? swap : r === swap ? row : r));
    });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (dirty && !anyInvalid && rows.length > 0 && !saving) onSave(strip(ordered));
      }}
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">FAQ page</h2>
        <p className="mt-1 text-sm text-gray-500">
          Questions on the store&apos;s <a href="/faq" target="_blank" rel="noreferrer" className="font-medium text-[#3f7a55] hover:underline">FAQ page</a> and
          the first few on the Contact page. {shown} of {rows.length} shown.
        </p>
        {isDefault && (
          <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            These are the built-in questions, written to match how the store works. Edit them and save to make the list your own.
          </p>
        )}
      </div>

      {FAQ_SECTIONS.map((s) => {
        const items = rows.filter((r) => r.section === s.key);
        return (
          <section key={s.key} className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-gray-900">{s.label}</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => add(s.key)}>
                <Plus className="mr-1 h-4 w-4" /> Add question
              </Button>
            </div>
            {items.length === 0 && <p className="mt-4 text-sm text-gray-400">No questions in this section; it won&apos;t appear on the page.</p>}
            <ol className="mt-4 space-y-3">
              {items.map((r, i) => (
                <li key={r.key} className={cn("rounded-xl border p-4", r.is_published ? "border-gray-200" : "border-dashed border-gray-300 bg-gray-50")}>
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1 space-y-2">
                      <Input
                        aria-label="Question"
                        value={r.question}
                        maxLength={200}
                        placeholder="Question"
                        className="font-medium"
                        onChange={(e) => update(r.key, { question: e.target.value })}
                        aria-invalid={tried && r.question.trim().length < 5}
                      />
                      <Textarea
                        aria-label="Answer"
                        rows={3}
                        value={r.answer}
                        maxLength={2000}
                        placeholder="Answer"
                        onChange={(e) => update(r.key, { answer: e.target.value })}
                        aria-invalid={tried && r.answer.trim().length < 5}
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          aria-label="Section"
                          value={r.section}
                          onChange={(e) => update(r.key, { section: e.target.value as FaqSection })}
                          className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700"
                        >
                          {FAQ_SECTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                        </select>
                        {tried && invalid(r) && <span className="text-xs text-red-600">Question and answer need at least 5 characters.</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <button type="button" title="Move up" aria-label="Move up" disabled={i === 0} onClick={() => move(r.key, -1)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                      <button type="button" title="Move down" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(r.key, 1)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                      <button
                        type="button"
                        title={r.is_published ? "Hide from the page" : "Show on the page"}
                        aria-label={r.is_published ? "Hide from the page" : "Show on the page"}
                        onClick={() => update(r.key, { is_published: !r.is_published })}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                      >
                        {r.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button type="button" title="Delete" aria-label="Delete" onClick={() => remove(r.key)} className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      {rows.length === 0 && <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">Keep at least one question. To take one off the page without losing it, hide it instead.</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-end gap-3">
        {dirty && !isDefault && (
          <Button type="button" variant="ghost" onClick={() => { setRows(initial.map(toRow)); setTried(false); }}>
            Discard changes
          </Button>
        )}
        <Button type="submit" disabled={!dirty || rows.length === 0 || saving} className="bg-[#3f7a55] hover:bg-[#2d583d]">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save FAQ page
        </Button>
      </div>
    </form>
  );
}
