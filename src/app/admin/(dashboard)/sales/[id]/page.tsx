"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, ArrowLeft, Ban, CheckCircle2, Loader2, Plus, Printer } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { naira } from "@/components/admin/sales/ticket";
import { COUNTER_PAYMENTS, getAdminSettings, getSale, voidSale } from "@/core/api";
import { shortOrderId } from "@/lib/orderStatus";

const VOID_REASONS = ["Rung up by mistake", "Customer returned it", "Wrong amount charged"];

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos",
  });

export default function SaleReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const justCreated = useSearchParams().get("new") === "1";
  const queryClient = useQueryClient();
  const [voiding, setVoiding] = useState(false);
  const [reason, setReason] = useState("");

  const { data: sale, isPending, isError, error } = useQuery({ queryKey: ["admin-sale", id], queryFn: () => getSale(id) });
  const { data: settings } = useQuery({ queryKey: ["admin-settings"], queryFn: getAdminSettings });

  const voidMutation = useMutation({
    mutationFn: () => voidSale(id, reason.trim()),
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin-sale", id], updated);
      queryClient.invalidateQueries({ queryKey: ["admin-sales"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setVoiding(false);
      toast.success("Sale voided and stock put back");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isPending) {
    return (
      <div className="flex justify-center p-24 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }
  if (isError || !sale) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
        <AlertCircle className="h-5 w-5" />
        <p>{(error as Error)?.message || "Sale not found"}</p>
      </div>
    );
  }

  const voided = sale.status === "cancelled";
  const store = settings?.store;
  const paidBy = COUNTER_PAYMENTS.find((m) => m.key === sale.payment_method)?.label ?? sale.payment_method;

  return (
    <div className="space-y-6">
      {/* Print only the receipt, at till-roll width. */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #receipt, #receipt * { visibility: visible !important; }
          #receipt { position: absolute; inset: 0 auto auto 0; width: 80mm; border: 0 !important; box-shadow: none !important; padding: 0 !important; }
        }
      `}</style>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/sales" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4" /> Sales
        </Link>
        <div className="flex gap-2">
          {!voided && (
            <Button variant="outline" onClick={() => setVoiding(true)} className="text-red-600 hover:text-red-700">
              <Ban className="mr-2 h-4 w-4" /> Void sale
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print receipt
          </Button>
          <Button asChild className="bg-[#3f7a55] hover:bg-[#2d583d]">
            <Link href="/admin/sales/new"><Plus className="mr-2 h-4 w-4" /> New sale</Link>
          </Button>
        </div>
      </div>

      {justCreated && !voided && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 className="h-4 w-4" /> Sale complete — {naira(sale.total_amount)} by {paidBy}.
        </div>
      )}
      {voided && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Voided{sale.cancelled_at ? ` ${when(sale.cancelled_at)}` : ""}: {sale.cancellation_reason}. Its stock was put back.
        </div>
      )}

      <article id="receipt" className="mx-auto max-w-sm rounded-2xl border border-gray-200 bg-white p-6 font-mono text-sm text-gray-900">
        <header className="text-center">
          <p className="font-sans text-lg font-bold">{store?.store_name ?? "Receipt"}</p>
          {store?.address && <p className="text-xs text-gray-600">{store.address}</p>}
          {store?.contact_phone && <p className="text-xs text-gray-600">{store.contact_phone}</p>}
          {voided && <p className="mt-2 font-sans text-base font-bold text-red-600">VOID</p>}
        </header>

        <dl className="mt-4 space-y-0.5 border-y border-dashed border-gray-300 py-3 text-xs">
          <div className="flex justify-between"><dt>Sale</dt><dd>{shortOrderId(sale.id)}</dd></div>
          <div className="flex justify-between"><dt>Date</dt><dd>{when(sale.created_at)}</dd></div>
          {sale.served_by_name && <div className="flex justify-between"><dt>Served by</dt><dd>{sale.served_by_name}</dd></div>}
          {sale.customer_name && sale.customer_name !== "Guest" && (
            <div className="flex justify-between"><dt>Customer</dt><dd>{sale.customer_name}</dd></div>
          )}
        </dl>

        <ul className="space-y-2 py-3">
          {sale.items.map((item) => (
            <li key={item.id}>
              <div className="flex justify-between gap-3">
                <span>{item.product?.name ?? "Item"}</span>
                <span className="tabular-nums">{naira(item.price_at_time * item.quantity)}</span>
              </div>
              <p className="text-xs text-gray-600">
                {[item.selected_option, item.quantity > 1 ? `${item.quantity} × ${naira(item.price_at_time)}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </li>
          ))}
        </ul>

        <dl className="space-y-0.5 border-t border-dashed border-gray-300 pt-3">
          <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{naira(sale.subtotal)}</dd></div>
          {sale.discount_amount > 0 && (
            <div className="flex justify-between">
              <dt>Discount{sale.discount_note ? ` (${sale.discount_note})` : ""}</dt>
              <dd className="tabular-nums">−{naira(sale.discount_amount)}</dd>
            </div>
          )}
          <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd className="tabular-nums">{naira(sale.total_amount)}</dd></div>
          <div className="flex justify-between text-xs text-gray-600"><dt>Paid by</dt><dd>{paidBy}</dd></div>
        </dl>

        <p className="mt-4 text-center text-xs text-gray-500">Thank you!</p>
      </article>

      <Dialog open={voiding} onOpenChange={setVoiding}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Void this sale?</DialogTitle>
            <DialogDescription>
              It stops counting towards revenue and its stock goes back on the shelf. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {VOID_REASONS.map((r) => (
                <button key={r} type="button" onClick={() => setReason(r)}
                  className={`rounded-full border px-3 py-1 text-xs ${reason === r ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d]" : "border-gray-200 text-gray-600"}`}>
                  {r}
                </button>
              ))}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="void_reason">Reason</Label>
              <Textarea id="void_reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setVoiding(false)}>Keep sale</Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={reason.trim().length < 3 || voidMutation.isPending}
              onClick={() => voidMutation.mutate()}
            >
              {voidMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Void sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
