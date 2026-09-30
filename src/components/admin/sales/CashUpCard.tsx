"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertTriangle, CheckCircle2, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveTillCount, type TillCount } from "@/core/api";
import { cn } from "@/lib/utils";
import { naira } from "./ticket";

interface Props {
  day: string;
  cashSales: number;
  till: TillCount | null;
  canCount: boolean;
  isFuture: boolean;
  onSaved: () => void;
}

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });

const toNumber = (v: string) => (v.trim() === "" ? NaN : Number(v.replace(/[,\s₦]/g, "")));

function Result({ difference }: { difference: number }) {
  const balanced = Math.abs(difference) < 0.5;
  return balanced ? (
    <span className="inline-flex items-center gap-1.5 font-semibold text-[#2d583d]"><CheckCircle2 className="h-4 w-4" /> Balanced</span>
  ) : (
    <span className={cn("inline-flex items-center gap-1.5 font-semibold", difference < 0 ? "text-red-600" : "text-amber-700")}>
      <AlertTriangle className="h-4 w-4" /> {naira(Math.abs(difference))} {difference < 0 ? "short" : "over"}
    </span>
  );
}

/** End-of-day cash-up: count the till against float + cash sales. */
export function CashUpCard({ day, cashSales, till, canCount, isFuture, onSaved }: Props) {
  const [editing, setEditing] = useState(false);
  const [float, setFloat] = useState(String(till?.opening_float ?? 0));
  const [counted, setCounted] = useState(till ? String(till.counted_cash) : "");
  const [note, setNote] = useState(till?.note ?? "");

  const floatN = toNumber(float);
  const countedN = toNumber(counted);
  const expected = (Number.isFinite(floatN) ? floatN : 0) + cashSales;
  const live = Number.isFinite(countedN) ? countedN - expected : null;
  const valid = Number.isFinite(floatN) && floatN >= 0 && Number.isFinite(countedN) && countedN >= 0;

  // A sale was rung up or voided after the count.
  const changedSince = till && Math.abs(till.opening_float + cashSales - till.expected_cash) >= 0.5;

  const save = useMutation({
    mutationFn: () => saveTillCount(day, { opening_float: floatN, counted_cash: countedN, note: note.trim() || undefined }),
    onSuccess: (t) => {
      setEditing(false);
      onSaved();
      toast[Math.abs(t.difference) < 0.5 ? "success" : "warning"](
        Math.abs(t.difference) < 0.5 ? "Till balanced" : `Till is ${naira(Math.abs(t.difference))} ${t.difference < 0 ? "short" : "over"}. Saved.`,
      );
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const showForm = canCount && !isFuture && (editing || !till);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-[#3f7a55]"><Wallet className="h-[18px] w-[18px]" /></span>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Cash-up</h2>
            <p className="text-xs text-gray-500">Count the till at close and compare.</p>
          </div>
        </div>
        {till && !showForm && canCount && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Count again</Button>
        )}
      </div>

      {till && !showForm ? (
        <div className="mt-4 space-y-3">
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div><dt className="text-xs text-gray-500">Expected</dt><dd className="font-semibold tabular-nums text-gray-900">{naira(till.expected_cash)}</dd></div>
            <div><dt className="text-xs text-gray-500">Counted</dt><dd className="font-semibold tabular-nums text-gray-900">{naira(till.counted_cash)}</dd></div>
            <div><dt className="text-xs text-gray-500">Result</dt><dd className="text-sm"><Result difference={till.difference} /></dd></div>
          </dl>
          <p className="text-xs text-gray-500">
            Float {naira(till.opening_float)} + cash sales. Counted by {till.counted_by ?? "staff"}, {when(till.counted_at)}.
          </p>
          {till.note && <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">{till.note}</p>}
          {changedSince && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Cash sales changed after this count (a sale was rung up or voided). Count again to update it.
            </p>
          )}
        </div>
      ) : showForm ? (
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid && !save.isPending) save.mutate();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="float" className="text-xs">Opening float</Label>
              <Input id="float" inputMode="decimal" value={float} onChange={(e) => setFloat(e.target.value)} className="tabular-nums" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="counted" className="text-xs">Cash counted</Label>
              <Input id="counted" inputMode="decimal" autoFocus={editing} value={counted} onChange={(e) => setCounted(e.target.value)} placeholder="0" className="tabular-nums" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
            <span className="text-gray-600">Expected <strong className="tabular-nums text-gray-900">{naira(expected)}</strong></span>
            {live !== null && <Result difference={live} />}
          </div>
          {live !== null && Math.abs(live) >= 0.5 && (
            <Input aria-label="Note" value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="What happened? e.g. change given from float" />
          )}
          <div className="flex justify-end gap-2">
            {till && <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>}
            <Button type="submit" size="sm" disabled={!valid || save.isPending} className="bg-[#3f7a55] hover:bg-[#2d583d]">
              {save.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />} Save count
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          {isFuture ? "This day hasn't happened yet." : `Not counted. Expected ${naira(cashSales)} in cash sales plus the float.`}
        </p>
      )}
    </section>
  );
}
