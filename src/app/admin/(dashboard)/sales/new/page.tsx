"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2, Minus, Plus, Search, ShoppingBasket, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddLineDialog } from "@/components/admin/sales/AddLineDialog";
import { lineLabel, naira, stockUnit, toPayload, type TicketLine } from "@/components/admin/sales/ticket";
import { COUNTER_PAYMENTS, createSale, getAdminProducts, type CounterPayment, type Product } from "@/core/api";
import { getThumbnailUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/utils";

export default function NewSalePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [picking, setPicking] = useState<Product | null>(null);
  const [lines, setLines] = useState<TicketLine[]>([]);
  const [payment, setPayment] = useState<CounterPayment | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [discountNote, setDiscountNote] = useState("");

  const { data: products, isPending } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getAdminProducts(),
  });

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (products ?? [])
      .filter((p) => p.is_active && (!q || p.name.toLowerCase().includes(q)))
      .sort((a, b) => Number(b.stock_quantity > 0) - Number(a.stock_quantity > 0) || a.name.localeCompare(b.name));
  }, [products, search]);

  const held = (productId: string) =>
    lines.filter((l) => l.product.id === productId).reduce((n, l) => n + l.quantity * l.stockUnits, 0);

  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
  const discount = parseFloat(discountInput) || 0;
  const total = Math.max(0, subtotal - discount);
  const discountProblem =
    discount < 0 ? "Discount can't be negative"
      : discount > subtotal ? "Discount is more than the sale"
        : discount > 0 && !discountNote.trim() ? "Say why the discount was given"
          : null;

  const changeQty = (line: TicketLine, delta: number) => {
    const next = line.quantity + delta;
    if (next < 1) return;
    if (delta > 0 && held(line.product.id) + line.stockUnits > line.product.stock_quantity + 1e-9) {
      toast.warning(`Only ${line.product.stock_quantity} ${stockUnit(line.product)} of ${line.product.name} in stock`);
      return;
    }
    setLines(lines.map((l) => (l.key === line.key ? { ...l, quantity: next } : l)));
  };

  const sale = useMutation({
    mutationFn: () =>
      createSale({
        items: lines.map(toPayload),
        payment_method: payment!,
        customer_name: customerName.trim() || undefined,
        customer_phone: customerPhone.trim() || undefined,
        discount_amount: discount || undefined,
        discount_note: discountNote.trim() || undefined,
      }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-sales"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      router.push(`/admin/sales/${created.id}?new=1`);
    },
    onError: (err: Error) => toast.error(err.message || "Couldn't complete the sale"),
  });

  const canComplete = lines.length > 0 && payment !== null && !discountProblem && !sale.isPending;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/sales" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4" /> Sales
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-gray-900">New walk-in sale</h1>
        <p className="mt-1 text-sm text-gray-500">Ring up a customer at the counter. Stock comes off as soon as you complete the sale.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Products */}
        <section className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="h-11 pl-9"
            />
          </div>

          {isPending ? (
            <div className="flex justify-center p-16 text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          ) : shown.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">No products match.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {shown.map((p) => {
                const left = p.stock_quantity - held(p.id);
                const out = left <= 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={out}
                    onClick={() => setPicking(p)}
                    className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition-colors hover:border-[#3f7a55]/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100">
                      {p.image_url && (
                        <Image src={getThumbnailUrl(p.image_url, 320)} alt="" fill unoptimized className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <p className="line-clamp-2 text-sm font-semibold text-gray-900">{p.name}</p>
                      <p className="mt-auto pt-1 text-xs text-gray-500">
                        {naira(p.price)} · {out ? <span className="text-red-600">Sold out</span> : `${Number(left.toFixed(2))} ${stockUnit(p)} left`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Ticket */}
        <aside className="h-fit space-y-5 rounded-2xl border border-gray-200 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold text-gray-900">This sale</h2>

          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-gray-400">
              <ShoppingBasket className="h-8 w-8" />
              <p className="text-sm">Tap a product to add it.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {lines.map((l) => (
                <li key={l.key} className="flex items-start gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{l.product.name}</p>
                    {lineLabel(l) && <p className="text-xs text-gray-500">{lineLabel(l)}</p>}
                    {l.amount === undefined && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <button type="button" aria-label="Decrease quantity" onClick={() => changeQty(l, -1)} disabled={l.quantity <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 disabled:opacity-30">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold tabular-nums">{l.quantity}</span>
                        <button type="button" aria-label="Increase quantity" onClick={() => changeQty(l, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums text-gray-900">{naira(l.unitPrice * l.quantity)}</p>
                    <button type="button" aria-label={`Remove ${l.product.name}`} onClick={() => setLines(lines.filter((x) => x.key !== l.key))}
                      className="mt-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <Label htmlFor="discount" className="text-xs text-gray-600">Discount (₦)</Label>
                <Input id="discount" type="number" min="0" inputMode="decimal" value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)} placeholder="0" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="discount_note" className="text-xs text-gray-600">Reason</Label>
                <Input id="discount_note" value={discountNote} onChange={(e) => setDiscountNote(e.target.value)}
                  placeholder="e.g. Regular customer" disabled={!discount} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <Label htmlFor="customer_name" className="text-xs text-gray-600">Customer (optional)</Label>
                <Input id="customer_name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Name" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="customer_phone" className="text-xs text-gray-600">Phone (optional)</Label>
                <Input id="customer_phone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="080…" />
              </div>
            </div>
          </div>

          <fieldset className="space-y-2 border-t border-gray-100 pt-4">
            <legend className="text-xs font-medium text-gray-600">Paid by</legend>
            <div className="grid grid-cols-3 gap-2">
              {COUNTER_PAYMENTS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  aria-pressed={payment === m.key}
                  onClick={() => setPayment(m.key)}
                  className={cn(
                    "h-10 rounded-xl border text-sm font-semibold transition-colors",
                    payment === m.key ? "border-[#3f7a55] bg-[#f4f7f5] text-[#2d583d] ring-1 ring-[#3f7a55]" : "border-gray-200 text-gray-700 hover:border-gray-300",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-1 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="tabular-nums">{naira(subtotal)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-gray-600"><span>Discount</span><span className="tabular-nums">−{naira(discount)}</span></div>
            )}
            <div className="flex justify-between text-base font-bold text-gray-900"><span>Total</span><span className="tabular-nums">{naira(total)}</span></div>
            {discountProblem && <p className="text-xs text-red-600">{discountProblem}</p>}
          </div>

          <Button
            className="h-12 w-full bg-[#3f7a55] text-base hover:bg-[#2d583d]"
            disabled={!canComplete}
            onClick={() => sale.mutate()}
          >
            {sale.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : payment ? `Complete sale · ${naira(total)}` : "Choose how they paid"}
          </Button>
        </aside>
      </div>

      <AddLineDialog
        key={picking?.id ?? "none"}
        product={picking}
        heldOnTicket={picking ? held(picking.id) : 0}
        onClose={() => setPicking(null)}
        onAdd={(line) => {
          setLines([...lines, line]);
          setPicking(null);
        }}
      />
    </div>
  );
}
