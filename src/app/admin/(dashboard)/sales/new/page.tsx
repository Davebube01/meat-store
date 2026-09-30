"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ArrowLeft, ShoppingBasket } from "lucide-react";
import { AddLineDialog } from "@/components/admin/sales/AddLineDialog";
import { ProductPicker } from "@/components/admin/sales/ProductPicker";
import { TicketPanel } from "@/components/admin/sales/TicketPanel";
import { naira, parseMoney, stockUnit, toPayload, totals, type TicketExtras, type TicketLine } from "@/components/admin/sales/ticket";
import { createSale, getAdminCategories, getAdminProducts, type Product } from "@/core/api";

const DRAFT_KEY = "meat-store-sale-draft";
const EMPTY_EXTRAS: TicketExtras = { payment: null, customerName: "", customerPhone: "", discountInput: "", discountNote: "", tenderedInput: "" };

interface Draft {
  lines: TicketLine[];
  extras: TicketExtras;
  clientRef: string;
}

const newRef = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

// The ticket survives a reload or a wander to another page (this tab only),
// so a half-rung sale isn't lost.
function loadDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    const d = raw ? (JSON.parse(raw) as Draft) : null;
    return d && Array.isArray(d.lines) && d.lines.length ? d : null;
  } catch {
    return null;
  }
}

export default function NewSalePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [picking, setPicking] = useState<Product | null>(null);
  const [lines, setLines] = useState<TicketLine[]>([]);
  const [extras, setExtrasState] = useState<TicketExtras>(EMPTY_EXTRAS);
  // One key per ticket: the server sells it once, however many times it's sent.
  const [clientRef, setClientRef] = useState(newRef);
  const [restored, setRestored] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const { data: products, isPending } = useQuery({ queryKey: ["admin-products"], queryFn: () => getAdminProducts() });
  const { data: categories } = useQuery({ queryKey: ["admin-categories"], queryFn: getAdminCategories });

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      /* eslint-disable react-hooks/set-state-in-effect -- restoring browser-only state after mount */
      setLines(draft.lines);
      setExtrasState({ ...EMPTY_EXTRAS, ...draft.extras });
      setClientRef(draft.clientRef || newRef());
      setRestored(true);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, []);

  useEffect(() => {
    try {
      if (lines.length) sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ lines, extras, clientRef }));
      else sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // Private mode or storage full: the ticket just won't survive a reload.
    }
  }, [lines, extras, clientRef]);

  // Keep ticket lines pointing at fresh product data (stock changes as others sell).
  const fresh = (p: Product) => products?.find((x) => x.id === p.id) ?? p;

  const setExtras = (patch: Partial<TicketExtras>) => setExtrasState((prev) => ({ ...prev, ...patch }));

  const held = (productId: string) =>
    lines.filter((l) => l.product.id === productId).reduce((n, l) => n + l.quantity * l.stockUnits, 0);

  const fits = (product: Product, extra: number) => held(product.id) + extra <= fresh(product).stock_quantity + 1e-9;

  const pick = (product: Product) => {
    // No sizes or cuts to choose: add it straight away (or one more of it).
    if (!product.weight_options?.length && !product.parts?.length) {
      if (!fits(product, 1)) {
        toast.warning(`Only ${fresh(product).stock_quantity} ${stockUnit(product)} of ${product.name} in stock`);
        return;
      }
      const existing = lines.find((l) => l.product.id === product.id && l.amount === undefined && !l.weightOption && !l.part);
      if (existing) setLines(lines.map((l) => (l.key === existing.key ? { ...l, quantity: l.quantity + 1 } : l)));
      else setLines([...lines, { key: `${product.id}-${Date.now()}`, product, quantity: 1, unitPrice: product.price, stockUnits: 1 }]);
      return;
    }
    setPicking(product);
  };

  const changeQty = (line: TicketLine, delta: number) => {
    const next = line.quantity + delta;
    if (next < 1) return;
    if (delta > 0 && !fits(line.product, line.stockUnits)) {
      toast.warning(`Only ${fresh(line.product).stock_quantity} ${stockUnit(line.product)} of ${line.product.name} in stock`);
      return;
    }
    setLines(lines.map((l) => (l.key === line.key ? { ...l, quantity: next } : l)));
  };

  const clear = () => {
    if (lines.length && !window.confirm("Clear this sale? Everything on the ticket will be removed.")) return;
    setLines([]);
    setExtrasState(EMPTY_EXTRAS);
    setClientRef(newRef());
    setRestored(false);
  };

  const { total, discount } = totals(lines, extras);

  const sale = useMutation({
    mutationFn: () => {
      const tendered = parseMoney(extras.tenderedInput);
      return createSale({
        items: lines.map(toPayload),
        payment_method: extras.payment!,
        customer_name: extras.customerName.trim() || undefined,
        customer_phone: extras.customerPhone.trim() || undefined,
        discount_amount: discount || undefined,
        discount_note: extras.discountNote.trim() || undefined,
        cash_tendered: extras.payment === "cash" && Number.isFinite(tendered) ? tendered : undefined,
        client_ref: clientRef,
      });
    },
    onSuccess: (created) => {
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-sales"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      router.push(`/admin/sales/${created.id}?new=1`);
    },
    // The ticket and its key stay as they are, so trying again can't sell twice.
    onError: (err: Error) => toast.error(err.message || "Couldn't complete the sale. Try again."),
  });

  const itemCount = lines.reduce((n, l) => n + (l.amount !== undefined ? 1 : l.quantity), 0);

  return (
    <div className="space-y-5 pb-24 lg:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/sales" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4" /> Sales
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-gray-900">New sale</h1>
          <p className="mt-1 text-sm text-gray-500">Ring up a customer at the counter. Stock comes off when you complete the sale.</p>
        </div>
        {restored && lines.length > 0 && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Picked up where you left off. <button type="button" onClick={clear} className="font-semibold underline underline-offset-2">Start over</button>
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <ProductPicker
          products={products}
          categories={(categories ?? []).map((c) => ({ slug: c.slug, name: c.name }))}
          loading={isPending}
          held={held}
          onPick={pick}
        />
        <div ref={ticketRef} className="h-fit scroll-mt-20 lg:sticky lg:top-24">
          <TicketPanel
            lines={lines}
            extras={extras}
            setExtras={setExtras}
            onQty={changeQty}
            onRemove={(line) => setLines(lines.filter((x) => x.key !== line.key))}
            onClear={clear}
            onComplete={() => sale.mutate()}
            submitting={sale.isPending}
          />
        </div>
      </div>

      {/* Phones: the ticket is below the products, so keep the total in reach. */}
      {lines.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => ticketRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="flex h-12 w-full items-center justify-between rounded-xl bg-[#3f7a55] px-4 font-semibold text-white"
          >
            <span className="inline-flex items-center gap-2"><ShoppingBasket className="h-5 w-5" /> {itemCount} item{itemCount === 1 ? "" : "s"}</span>
            <span className="tabular-nums">Review · {naira(total)}</span>
          </button>
        </div>
      )}

      <AddLineDialog
        key={picking?.id ?? "none"}
        product={picking ? fresh(picking) : null}
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
