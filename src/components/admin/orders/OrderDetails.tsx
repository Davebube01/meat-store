"use client";

import { useState } from "react";
import { Order, OrderStatus } from "@/data/orders";
import { Customer } from "@/data/customers";
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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OrderDetailsProps {
  order: Order;
  customer?: Customer;
}

export function OrderDetails({
  order: initialOrder,
  customer,
}: OrderDetailsProps) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrder({ ...order, status: newStatus });
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return "bg-secondary text-secondary-foreground border-secondary";
      case "confirmed":
        return "bg-blue-500 text-white border-blue-500";
      case "prepping":
        return "bg-orange-500 text-white border-orange-500";
      case "quality_check":
        return "bg-yellow-500 text-white border-yellow-500";
      case "out_for_delivery":
        return "bg-purple-500 text-white border-purple-500";
      case "delivered":
        return "bg-green-600 text-white border-green-600";
      case "cancelled":
        return "bg-destructive text-destructive-foreground border-destructive";
      default:
        return "bg-secondary text-secondary-foreground border-secondary";
    }
  };

  const statusSteps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: "placed", label: "Placed", icon: Clock },
    { status: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { status: "prepping", label: "Prepping", icon: Package },
    { status: "out_for_delivery", label: "Out for Delivery", icon: Truck },
    { status: "delivered", label: "Delivered", icon: CheckCircle2 },
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
                {new Date(order.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {new Date(order.date).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-background/10 p-1 rounded-lg backdrop-blur-sm">
            <Select
              disabled={
                loading ||
                order.status === "cancelled" ||
                order.status === "delivered"
              }
              value={order.status}
              onValueChange={(value) =>
                handleStatusUpdate(value as OrderStatus)
              }
            >
              <SelectTrigger className="w-[200px] border-0 bg-transparent text-inherit focus:ring-0 font-medium h-10">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="animate-in zoom-in-95 duration-200"
              >
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="prepping">Prepping</SelectItem>
                <SelectItem value="quality_check">Quality Check</SelectItem>
                <SelectItem value="out_for_delivery">
                  Out for Delivery
                </SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

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
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-lg leading-none group-hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
                          {item.selectedOption}
                        </span>
                        <span>x {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₦{item.price.toLocaleString()} / unit
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground font-medium">
                    Subtotal
                  </span>
                  <span className="text-xl font-bold">
                    ₦{order.total.toLocaleString()}
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
                        {customer.name}
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

                  <Separator />

                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-purple-100 p-2 rounded-full text-purple-600">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Shipping Address
                      </p>
                      <p className="font-medium text-foreground leading-relaxed">
                        {order.shippingAddress}
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
                    ₦{order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-dashed">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Paid
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
