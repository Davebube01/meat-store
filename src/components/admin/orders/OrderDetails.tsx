"use client";

import { useState } from "react";
import { Order, OrderStatus, AdminOrderStatus, Customer } from "@/core/api";
import { useUpdateOrderStatus, useSimulateWebhook, useDispatchOrder, useConfirmDelivery, useCancelAdminOrder } from "@/core/hooks/usePayment";
import { CancelOrderDialog } from "@/components/orders/CancelOrderDialog";
import { ADMIN_CANCEL_REASONS, describeCancelledBy } from "@/lib/orderStatus";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  XCircle,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  User,
  ShoppingBag,
  Zap,
  Loader2,
  Store,
  Bike,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/core/api/client";

interface OrderDetailsProps {
  order: Order;
  customer?: Customer;
}

export function OrderDetails({
  order: initialOrder,
  customer,
}: OrderDetailsProps) {
  const [order, setOrder] = useState(initialOrder);
  const isDev = process.env.NODE_ENV === "development";

  const updateMutation = useUpdateOrderStatus(order.id);
  const simulateMutation = useSimulateWebhook(order.id);
  const dispatchMutation = useDispatchOrder(order.id);
  const confirmDeliveryMutation = useConfirmDelivery(order.id);
  const cancelMutation = useCancelAdminOrder(order.id);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");

  const isDeliveryOrder = (order as any).delivery_method !== "pickup";

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    confirmDeliveryMutation.mutate(pinInput, {
      onSuccess: (updated) => {
        setOrder(updated as any);
        setPinInput("");
      },
    });
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    updateMutation.mutate(newStatus, {
      onSuccess: (updated) => setOrder(updated as any),
    });
  };

  const [courierName, setCourierName] = useState(order.delivery?.courier_name || "");
  const [courierPhone, setCourierPhone] = useState(order.delivery?.courier_phone || "");
  const [courierService, setCourierService] = useState(order.delivery?.courier_service || "");
  const [courierReference, setCourierReference] = useState(order.delivery?.courier_reference || "");

  const handleDispatchSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchMutation.mutate(
      {
        courier_name: courierName,
        courier_phone: courierPhone,
        courier_service: courierService,
        courier_reference: courierReference || undefined,
      },
      { onSuccess: (updated) => setOrder(updated as any) },
    );
  };

  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-secondary text-secondary-foreground border-secondary";
      case "paid":
        return "bg-blue-500 text-white border-blue-500";
      case "processing":
        return "bg-green-500 text-white border-green-500";
      case "shipped":
        return "bg-purple-500 text-white border-purple-500";
      case "delivered":
        return "bg-green-600 text-white border-green-600";
      case "cancelled":
        return "bg-destructive text-destructive-foreground border-destructive";
      default:
        return "bg-secondary text-secondary-foreground border-secondary";
    }
  };

  const statusSteps: { status: AdminOrderStatus; label: string; icon: any }[] = [
    { status: "pending", label: "Pending", icon: Clock },
    { status: "processing", label: "Processing", icon: Package },
    { status: "in_transit", label: (order as any).delivery_method === 'pickup' ? "Ready for Pickup" : "Out for Delivery", icon: (order as any).delivery_method === 'pickup' ? Store : Truck },
    { status: "delivered", label: (order as any).delivery_method === 'pickup' ? "Picked Up" : "Delivered", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header Section with Status Banner */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div
          className={cn(
            "px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6",
            getStatusColor(order.status).replace("border-", "border-b-4 "),
          )}
        >
          <div className="flex items-center gap-4">
            <Link href="/admin/orders">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-inherit border-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-bold tracking-tight text-inherit flex items-center gap-2">
                  Booking #{order.id}
                </h2>
                <Badge
                  variant="outline"
                  className="bg-white/20 hover:bg-white/20 text-inherit border-white/40 uppercase tracking-wide"
                >
                  {order.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <p className="text-inherit/80 font-medium">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-background/10 p-1 rounded-lg backdrop-blur-sm">
            <Select
              disabled={
                updateMutation.isPending ||
                order.status === "cancelled" ||
                order.status === "delivered"
              }
              value={order.status}
              onValueChange={(value) =>
                // Cancelling needs a reason (shown to the customer), so it
                // goes through its own dialog instead of a plain status change.
                value === "cancelled" ? setCancelOpen(true) : handleStatusUpdate(value as OrderStatus)
              }
            >
              <SelectTrigger className="w-[200px] border-0 bg-transparent text-inherit focus:ring-0 font-medium h-10">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="animate-in zoom-in-95 duration-200"
              >
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="in_transit">{(order as any).delivery_method === 'pickup' ? "Ready for Pickup" : "Out for Delivery"}</SelectItem>
                {!isDeliveryOrder && (
                  <SelectItem value="delivered">Confirm Picked Up</SelectItem>
                )}
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {order.status === "cancelled" && (
        <div role="status" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">
            {describeCancelledBy((order as any).cancelled_by)}
            {(order as any).cancelled_at && (
              <span className="font-normal text-red-700"> · {new Date((order as any).cancelled_at).toLocaleString()}</span>
            )}
          </p>
          <p className="mt-1">Reason: {(order as any).cancellation_reason || "Reason not recorded"}</p>
          {(order as any).paid_at && (
            <p className="mt-2 font-semibold">
              A payment was received for this order (
              {new Date((order as any).paid_at).toLocaleString()}). It needs a refund.
            </p>
          )}
        </div>
      )}

      <CancelOrderDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        reasons={ADMIN_CANCEL_REASONS}
        title="Cancel this order?"
        description="The customer will see this reason, and the reserved stock goes back on sale."
        onConfirm={async (reason) => {
          const updated = await cancelMutation.mutateAsync(reason);
          setOrder(updated as any);
        }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Order Items & Status Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Booking Items
                </CardTitle>
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "Item" : "Items"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-muted/50 p-1 group-hover:border-primary/50 transition-colors">
                      <div className="relative h-full w-full overflow-hidden rounded-md">
                        <Image
                          src={getFullImageUrl(item.product?.image_url)}
                          alt={item.product?.name || "Product"}
                          fill
                          unoptimized
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-lg leading-none group-hover:text-primary transition-colors">
                        {item.product?.name || "Deleted Product"}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
                          {item.selected_option || "Standard"}
                        </span>
                        <span>x {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ₦{(item.price_at_time * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₦{item.price_at_time.toLocaleString()} / unit
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground font-medium">
                    Order Total
                  </span>
                  <span className="text-xl font-bold">
                    ₦{order.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-blue-500 shadow-sm">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Truck className="w-5 h-5 text-blue-500" />
                Booking Progress
              </CardTitle>
              <CardDescription>Target: Customer Receipt</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-2 bottom-8 w-0.5 bg-muted-foreground/20 -z-10" />

                <div className="space-y-8">
                  {statusSteps.map((step, index) => {
                    const isCompleted =
                      statusSteps.findIndex((s) => s.status === order.status) >=
                      index;
                    const isCurrent = order.status === step.status;

                    return (
                      <div
                        key={step.status}
                        className="flex items-start gap-4 relative"
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 bg-background z-10",
                            isCompleted || isCurrent
                              ? "border-primary text-primary shadow-sm scale-110"
                              : "border-muted text-muted-foreground",
                          )}
                        >
                          <step.icon className="h-5 w-5" />
                        </div>
                        <div
                          className={cn(
                            "flex-1 pt-2 transition-all duration-300",
                            isCurrent ? "translate-x-1" : "",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <h4
                              className={cn(
                                "font-semibold text-lg leading-none",
                                isCompleted || isCurrent
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              {step.label}
                            </h4>
                            {isCurrent && (
                              <Badge className="bg-primary hover:bg-primary/90">
                                Current Status
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {isCompleted ? "Completed" : "Pending"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer & Payment Info */}
        <div className="space-y-6">
          <Card className="border-t-4 border-t-purple-500 shadow-sm h-fit">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="w-5 h-5 text-purple-500" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {customer ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-purple-100 p-2 rounded-full text-purple-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Name
                      </p>
                      <p className="font-semibold text-foreground text-lg">
                        {customer.full_name || customer.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-purple-100 p-2 rounded-full text-purple-600">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="font-medium text-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-purple-100 p-2 rounded-full text-purple-600">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Phone
                      </p>
                      <p className="font-medium text-foreground">
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                </>
              ) : order.guest_info ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-orange-100 p-2 rounded-full text-orange-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Guest Name
                      </p>
                      <p className="font-semibold text-foreground text-lg">
                        {order.guest_info.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-orange-100 p-2 rounded-full text-orange-600">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="font-medium text-foreground">
                        {order.guest_info.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-orange-100 p-2 rounded-full text-orange-600">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Phone
                      </p>
                      <p className="font-medium text-foreground">
                        {order.guest_info.phone}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg">
                  <User className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p>Customer information not available</p>
                </div>
              )}

              <Separator />

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-blue-100 p-2 rounded-full text-blue-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Shipping Address
                  </p>
                  <p className="font-medium text-foreground leading-relaxed">
                    {order.delivery?.address || "Address not specified"}
                  </p>
                  {order.delivery?.city && (
                    <p className="text-sm text-muted-foreground">
                      {order.delivery.city}, {order.delivery.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 mt-4">
                <div className="mt-1 bg-green-100 p-2 rounded-full text-green-600">
                  {(order as any).delivery_method === 'pickup' ? <Store className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Delivery Method
                  </p>
                  <p className="font-medium text-foreground leading-relaxed">
                    {(order as any).delivery_method === 'pickup' ? "Store Pickup" : "Instant Delivery"}
                  </p>
                </div>
              </div>
            </CardContent>
            {customer && (
              <CardFooter className="bg-muted/10 border-t pt-4">
                <Link
                  href={`/admin/customers/${customer.id}`}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all font-medium"
                  >
                    View Full Profile
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>

          {(order as any).delivery_method !== "pickup" && (
            <Card className="border-t-4 border-t-amber-500 shadow-sm">
              <CardHeader className="border-b bg-muted/30 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bike className="w-5 h-5 text-amber-500" />
                  Courier / Dispatch
                </CardTitle>
                <CardDescription>
                  Who's carrying this order — shown to the customer so they know who to expect and pay.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleDispatchSave} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="courierName">Courier Name</Label>
                    <Input
                      id="courierName"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. Ahmed Bello"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="courierPhone">Courier Phone</Label>
                    <Input
                      id="courierPhone"
                      value={courierPhone}
                      onChange={(e) => setCourierPhone(e.target.value)}
                      placeholder="e.g. +234 803 555 1234"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="courierService">Service</Label>
                    <Input
                      id="courierService"
                      value={courierService}
                      onChange={(e) => setCourierService(e.target.value)}
                      placeholder="e.g. Bolt, Personal Rider, In-house"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="courierReference">
                      Trip Reference <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="courierReference"
                      value={courierReference}
                      onChange={(e) => setCourierReference(e.target.value)}
                      placeholder="e.g. Bolt trip ID or receipt number"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={dispatchMutation.isPending}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    {dispatchMutation.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</>
                    ) : order.delivery?.courier_name ? (
                      "Update Courier"
                    ) : (
                      "Assign Courier"
                    )}
                  </Button>
                </form>

                {order.delivery?.delivery_pin && order.status !== "delivered" && order.status !== "cancelled" && (
                  <>
                    <Separator className="my-6" />
                    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Delivery PIN</p>
                        <p className="text-2xl font-bold tracking-widest text-amber-700">
                          {order.delivery.delivery_pin}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Given to the customer. Ask the courier for it to confirm delivery.
                        </p>
                      </div>
                      <form onSubmit={handleConfirmDelivery} className="flex items-end gap-2">
                        <div className="grid gap-2 flex-1">
                          <Label htmlFor="confirmPin">Enter PIN to confirm delivery</Label>
                          <Input
                            id="confirmPin"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            placeholder="e.g. 7022"
                            maxLength={4}
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={confirmDeliveryMutation.isPending || pinInput.length !== 4}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {confirmDeliveryMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      </form>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="border-t-4 border-t-green-500 shadow-sm">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="w-5 h-5 text-green-500" />
                Payment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50/50 border border-green-100">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                  <span className="font-bold text-lg">₦</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Amount
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    ₦{order.total_amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-dashed">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">{order.payment_method?.replace(/_/g, " ") || "Not Specified"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      order.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"
                    )}
                  >
                    {order.status === "pending" ? "Pending" : "Paid"}
                  </Badge>
                </div>
                {(order as any).payment_reference && (
                  <div className="flex justify-between items-center py-2 border-b border-dashed">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {(order as any).payment_reference}
                    </span>
                  </div>
                )}
                {(order as any).paid_at && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Paid at</span>
                    <span className="text-sm font-medium">
                      {new Date((order as any).paid_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Dev-only simulate webhook button */}
              {isDev && (order as any).payment_reference && (
                <div className="mt-4 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Dev Tool</span>
                  </div>
                  <p className="text-xs text-amber-600 mb-2">
                    Simulate a Paystack webhook to mark this order as Processing.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-400 text-amber-800 hover:bg-amber-100 text-xs h-7"
                    disabled={simulateMutation.isPending}
                    onClick={() => simulateMutation.mutate((order as any).payment_reference)}
                  >
                    {simulateMutation.isPending ? (
                      <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Simulating…</>
                    ) : (
                      <><Zap className="h-3 w-3 mr-1" /> Simulate Webhook</>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
