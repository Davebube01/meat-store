"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  AlertCircle, ArrowLeft, Ban, Bike, Check, ChefHat, Clock, CreditCard, KeyRound, Loader2, Mail, MapPin, Package,
  PackageCheck, Phone, Store, Undo2, UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CancelOrderDialog } from "@/components/orders/CancelOrderDialog";
import { ConfirmDeliveryDialog, DispatchDialog } from "@/components/admin/orders/OrderActionDialogs";
import {
  cancelAdminOrder, confirmDelivery, dispatchOrder, getOrderById, updateAdminOrderStatus,
  type DispatchPayload, type Order,
} from "@/core/api";
import { ADMIN_CANCEL_REASONS, getStatusInfo, isFinished, shortOrderId } from "@/lib/orderStatus";
import { getThumbnailUrl } from "@/lib/imageUrl";

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });
const day = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Lagos" }) : null;

type Step = { label: string; at?: string | null; done: boolean; current?: boolean };

function timeline(o: Order): Step[] {
  const s = o.status;
  const pickup = o.delivery_method === "pickup";
  const rank = { pending: 0, awaiting_verification: 0, paid: 1, processing: 2, in_transit: 3, shipped: 3, delivered: 4, cancelled: -1 }[s] ?? 0;
  const cod = o.payment_method === "cod";
  return [
    { label: "Order placed", at: o.created_at, done: true },
    { label: cod ? "Cash on delivery (pays on arrival)" : "Payment received", at: o.paid_at, done: cod ? rank >= 0 : !!o.paid_at },
    { label: "Being prepared", done: rank >= 2, current: rank === 2 },
    { label: pickup ? "Ready for pickup" : "Out for delivery", done: rank >= 3, current: rank === 3 },
    { label: pickup ? "Collected" : "Delivered", done: rank >= 4 },
  ];
}

function Card({ title, icon: Icon, children, action }: { title: string; icon: React.ElementType; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Icon className="h-4 w-4 text-[#3f7a55]" /> {title}
        </h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right text-gray-900">{children}</span>
    </div>
  );
}

export default function AdminOrderPage() {
  const { id } = useParams() as { id: string };
  const queryClient = useQueryClient();
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [dispatchKey, setDispatchKey] = useState(0);
  const [pinOpen, setPinOpen] = useState(false);
  const [pinKey, setPinKey] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const { data: o, isPending, isError, error, refetch } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => getOrderById(id),
    retry: (count, err) => (err as { status?: number }).status !== 404 && count < 2,
  });

  // Action responses don't carry the customer/row extras, so re-read the order.
  const afterChange = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    queryClient.invalidateQueries({ queryKey: ["admin-orders-summary"] });
    queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    toast.success(message);
  };

  const move = useMutation({
    mutationFn: (status: string) => updateAdminOrderStatus(id, status),
    onSuccess: (_r, status) =>
      afterChange(
        {
          processing: "Order is being prepared",
          in_transit: "Marked ready for pickup",
          delivered: "Marked as collected",
        }[status] ?? "Order updated",
      ),
    onError: (err: Error) => toast.error(err.message),
  });

  const dispatch = useMutation({
    mutationFn: (p: DispatchPayload) => dispatchOrder(id, p),
    onMutate: () => setDialogError(null),
    onSuccess: () => {
      setDispatchOpen(false);
      afterChange("Dispatched. The customer can now see the courier and their PIN.");
    },
    onError: (err: Error) => setDialogError(err.message),
  });

  const confirm = useMutation({
    mutationFn: (pin: string) => confirmDelivery(id, pin),
    onMutate: () => setDialogError(null),
    onSuccess: () => {
      setPinOpen(false);
      afterChange("Delivery confirmed");
    },
    onError: (err: Error) => setDialogError(err.message),
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-gray-400">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-green-600" />
        <p>Loading order…</p>
      </div>
    );
  }
  if (isError) {
    const notFound = (error as { status?: number }).status === 404;
    return (
      <div className="space-y-4">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Orders
        </Link>
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="flex-1 text-sm">{notFound ? "This order doesn't exist." : (error as Error).message}</p>
          {!notFound && <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>}
        </div>
      </div>
    );
  }

  const st = getStatusInfo(o);
  const pickup = o.delivery_method === "pickup";
  const d = o.delivery;
  const moves = new Set(o.allowed_moves ?? []);
  const canDispatch = !pickup && !!d && (o.status === "paid" || o.status === "processing");
  const canConfirm = !pickup && o.status === "in_transit";
  const canCancel = !isFinished(o.status) && o.status !== "in_transit";
  const unpaidOnline = (o.status === "pending" || o.status === "awaiting_verification") && o.payment_method !== "cod";
  const busy = move.isPending || dispatch.isPending || confirm.isPending;

  // The one thing to do next, as the primary button.
  let primary: { label: string; icon: React.ElementType; run: () => void } | null = null;
  if (moves.has("processing") && o.status !== "in_transit")
    primary = { label: o.payment_method === "cod" && o.status === "pending" ? "Accept & start preparing" : "Start preparing", icon: ChefHat, run: () => move.mutate("processing") };
  else if (canDispatch)
    primary = { label: "Dispatch", icon: Bike, run: () => { setDialogError(null); setDispatchKey((k) => k + 1); setDispatchOpen(true); } };
  else if (pickup && moves.has("in_transit"))
    primary = { label: "Mark ready for pickup", icon: Store, run: () => move.mutate("in_transit") };
  else if (canConfirm)
    primary = { label: "Confirm delivery", icon: KeyRound, run: () => { setDialogError(null); setPinKey((k) => k + 1); setPinOpen(true); } };
  else if (pickup && moves.has("delivered"))
    primary = { label: "Mark collected", icon: PackageCheck, run: () => move.mutate("delivered") };

  const itemsTotal = o.items.reduce((n: number, i: { quantity: number; price_at_time: number }) => n + i.quantity * i.price_at_time, 0);

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold text-gray-900">{shortOrderId(o.id)}</h1>
            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${st.className}`}>{st.label}</span>
            {o.overdue && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                <Clock className="h-3.5 w-3.5" /> Past delivery slot
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Placed {when(o.created_at)} · {pickup ? "Pickup" : "Delivery"} · {o.payment_method === "cod" ? "Cash on delivery" : "Paid online"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canCancel && (
            <Button variant="outline" onClick={() => setCancelOpen(true)} disabled={busy} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
              <Ban className="mr-2 h-4 w-4" /> Cancel order
            </Button>
          )}
          {o.status === "in_transit" && (
            <Button variant="outline" onClick={() => move.mutate("processing")} disabled={busy}>
              <Undo2 className="mr-2 h-4 w-4" /> Back to preparing
            </Button>
          )}
          {canConfirm && d?.courier_name && (
            <Button variant="outline" onClick={() => { setDialogError(null); setDispatchKey((k) => k + 1); setDispatchOpen(true); }} disabled={busy}>
              <Bike className="mr-2 h-4 w-4" /> Edit courier
            </Button>
          )}
          {primary && (
            <Button onClick={primary.run} disabled={busy} className="bg-[#3f7a55] hover:bg-[#2d583d]">
              {move.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <primary.icon className="mr-2 h-4 w-4" />}
              {primary.label}
            </Button>
          )}
        </div>
      </div>

      {unpaidOnline && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Waiting for the customer to pay online. Paystack confirms it automatically.
            {o.payment_expires_at && <> If unpaid by {when(o.payment_expires_at)}, it&apos;s cancelled and its stock released.</>}
          </p>
        </div>
      )}
      {o.status === "cancelled" && (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <Ban className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Cancelled{o.cancelled_by ? ` by ${o.cancelled_by === "admin" ? "the store" : o.cancelled_by}` : ""}
            {o.cancelled_at && <> on {when(o.cancelled_at)}</>}. Reason: <b>{o.cancellation_reason ?? "not given"}</b>
            {o.paid_at && o.payment_method !== "cod" && <> · It was paid online. Refund it from your Paystack dashboard.</>}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title={`Items (${o.items.length})`} icon={Package}>
            <ul className="-my-3 divide-y divide-gray-100">
              {o.items.map((i: { id: string; quantity: number; price_at_time: number; selected_option?: string; product?: { name: string; slug: string; image_url?: string } }) => (
                <li key={i.id} className="flex items-center gap-4 py-3">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image src={getThumbnailUrl(i.product?.image_url, 96)} alt="" fill unoptimized className="object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    {i.product?.slug ? (
                      <Link href={`/admin/products/${i.product.slug}`} className="font-medium text-gray-900 hover:text-[#3f7a55]">{i.product.name}</Link>
                    ) : (
                      <p className="font-medium text-gray-900">{i.product?.name ?? "Removed product"}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {i.selected_option ? `${i.selected_option} · ` : ""}
                      {naira(i.price_at_time)} each
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">×{i.quantity}</span>
                  <span className="w-24 text-right font-semibold tabular-nums text-gray-900">{naira(i.quantity * i.price_at_time)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-gray-100 pt-3">
              <Row label="Items">{naira(itemsTotal)}</Row>
              {!pickup && <Row label="Delivery fee (cash to courier)">{naira(o.delivery_fee)}</Row>}
              <div className="flex justify-between pt-2 text-base font-semibold">
                <span>{o.payment_method === "cod" ? "To collect in cash" : "Charged online"}</span>
                <span className="tabular-nums">{naira(o.total_amount)}</span>
              </div>
            </div>
          </Card>

          <Card title="Progress" icon={Clock}>
            <ol className="space-y-4">
              {(o.status === "cancelled" ? timeline(o).slice(0, 2) : timeline(o)).map((s) => (
                <li key={s.label} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      s.done ? "bg-[#3f7a55] text-white" : s.current ? "bg-[#22c55e] text-white ring-4 ring-green-100" : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className={`text-sm ${s.done || s.current ? "font-medium text-gray-900" : "text-gray-400"}`}>{s.label}</p>
                    {s.at && <p className="text-xs text-gray-400">{when(s.at)}</p>}
                  </div>
                </li>
              ))}
              {o.status === "cancelled" && (
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                    <Ban className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cancelled</p>
                    {o.cancelled_at && <p className="text-xs text-gray-400">{when(o.cancelled_at)}</p>}
                  </div>
                </li>
              )}
            </ol>
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            title="Customer"
            icon={UserRound}
            action={o.user_id ? <Link href={`/admin/customers/${o.user_id}`} className="text-xs font-semibold text-[#3f7a55] hover:underline">View profile</Link> : undefined}
          >
            <p className="font-medium text-gray-900">
              {o.customer_name}
              {o.is_guest && <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-500">Guest</span>}
            </p>
            <div className="mt-2 space-y-1.5 text-sm">
              {o.customer_email && (
                <a href={`mailto:${o.customer_email}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900"><Mail className="h-4 w-4" /> {o.customer_email}</a>
              )}
              {o.customer_phone && (
                <a href={`tel:${o.customer_phone}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900"><Phone className="h-4 w-4" /> {o.customer_phone}</a>
              )}
            </div>
          </Card>

          {pickup ? (
            <Card title="Pickup" icon={Store}>
              <p className="text-sm text-gray-600">The customer collects this order from the shop.</p>
            </Card>
          ) : d ? (
            <Card title="Delivery" icon={MapPin}>
              <p className="text-sm font-medium text-gray-900">{o.delivery_zone_name ?? d.delivery_zone}</p>
              <p className="mt-1 text-sm text-gray-600">
                {d.address}
                {d.apartment && `, ${d.apartment}`}
                {d.city && `, ${d.city}`}
              </p>
              {d.landmark && <p className="mt-1 text-xs text-gray-500">Landmark: {d.landmark}</p>}
              {d.instructions && <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">“{d.instructions}”</p>}
              {(d.delivery_date || d.time_slot) && (
                <p className={`mt-3 flex items-center gap-2 text-sm ${o.overdue ? "font-semibold text-red-600" : "text-gray-700"}`}>
                  <Clock className="h-4 w-4" /> {day(d.delivery_date)}{d.time_slot && ` · ${d.time_slot}`}
                </p>
              )}
            </Card>
          ) : null}

          {!pickup && d && (
            <Card title="Courier" icon={Bike}>
              {d.courier_name ? (
                <>
                  <Row label="Name">{d.courier_name}</Row>
                  <Row label="Phone"><a href={`tel:${d.courier_phone}`} className="hover:underline">{d.courier_phone}</a></Row>
                  <Row label="Service">{d.courier_service}</Row>
                  {d.courier_reference && <Row label="Reference">{d.courier_reference}</Row>}
                  {d.delivery_pin && o.status === "in_transit" && (
                    <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                      The customer has the delivery PIN. Ask the courier for it to confirm delivery.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">Not dispatched yet.</p>
              )}
            </Card>
          )}

          <Card title="Payment" icon={CreditCard}>
            <Row label="Method">{o.payment_method === "cod" ? "Cash on delivery" : "Paystack"}</Row>
            {o.payment_reference && <Row label="Reference"><span className="font-mono text-xs">{o.payment_reference}</span></Row>}
            <Row label="Paid">{o.paid_at ? when(o.paid_at) : o.payment_method === "cod" ? (o.status === "delivered" ? "On delivery" : "On delivery (pending)") : "Not yet"}</Row>
          </Card>
        </div>
      </div>

      <DispatchDialog
        key={`dispatch-${dispatchKey}`}
        open={dispatchOpen}
        onOpenChange={setDispatchOpen}
        delivery={d}
        saving={dispatch.isPending}
        error={dialogError}
        onSubmit={(p) => dispatch.mutate(p)}
      />
      <ConfirmDeliveryDialog
        key={`pin-${pinKey}`}
        open={pinOpen}
        onOpenChange={setPinOpen}
        saving={confirm.isPending}
        error={dialogError}
        onSubmit={(pin) => confirm.mutate(pin)}
      />
      <CancelOrderDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        reasons={ADMIN_CANCEL_REASONS}
        title={`Cancel ${shortOrderId(o.id)}?`}
        description={`The customer sees your reason. Stock goes back to inventory.${o.paid_at && o.payment_method !== "cod" ? " It was paid online, so refund it from Paystack afterwards." : ""}`}
        onConfirm={async (reason) => {
          await cancelAdminOrder(id, reason);
          await afterChange("Order cancelled");
        }}
      />
    </div>
  );
}
