"use client";

import { Customer, Order } from "@/core/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CustomerProfileProps {
  customer: Customer;
  orders: Order[];
}

export function CustomerProfile({ customer, orders }: CustomerProfileProps) {
  const getStatusColor = (status: Order["status"]) => {
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

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return Clock;
      case "paid":
        return CheckCircle2;
      case "processing":
        return Package;
      case "shipped":
        return Truck;
      case "delivered":
        return CheckCircle2;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  const averageOrderValue = customer.totalSpent / customer.ordersCount || 0;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header Banner */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Link href="/admin/customers">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border-0 shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2 border-white/50 shadow-lg shrink-0">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback className="text-xl md:text-2xl bg-white/10 text-white">
                    {customer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white truncate">
                    {customer.name}
                  </h2>
                  <p className="text-white/80 font-medium flex flex-wrap items-center gap-2 text-sm md:text-base">
                    <span className="opacity-75">ID:</span>
                    <span className="font-mono bg-white/10 px-2 rounded">
                      {customer.id}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto justify-evenly md:justify-start">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center flex-1 md:flex-none min-w-[100px]">
                <p className="text-xs uppercase tracking-wider opacity-70 mb-1">
                  Total Spent
                </p>
                <p className="text-lg md:text-xl font-bold">
                  ₦{customer.totalSpent.toLocaleString()}
                </p>

              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center flex-1 md:flex-none min-w-[100px]">
                <p className="text-xs uppercase tracking-wider opacity-70 mb-1">
                  Orders
                </p>
                <p className="text-lg md:text-xl font-bold">
                  {customer.ordersCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Info Card */}
        <Card className="md:col-span-1 border-t-4 border-t-green-700 shadow-sm h-fit">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="h-8 w-8 rounded-full p-0 flex items-center justify-center border-green-200 bg-green-50 text-green-600"
              >
                <MapPin className="h-4 w-4" />
              </Badge>
              Contact Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="mt-1">
                  <Mail className="h-5 w-5 text-muted-foreground group-hover:text-green-700 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="mt-1">
                  <Phone className="h-5 w-5 text-muted-foreground group-hover:text-green-700 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="mt-1">
                  <MapPin className="h-5 w-5 text-muted-foreground group-hover:text-green-700 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Address
                  </p>
                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="mt-1">
                  <Calendar className="h-5 w-5 text-muted-foreground group-hover:text-green-700 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </p>
                  <p className="font-medium">
                    {new Date(customer.joinDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-900">Insights</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-green-600/80">
                    Avg. Booking Value
                  </p>
                  <p className="font-bold text-green-900">
                    ₦{averageOrderValue.toLocaleString()}
                  </p>

                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="md:col-span-2 border-t-4 border-t-primary shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="h-8 w-8 rounded-full p-0 flex items-center justify-center border-primary/20 bg-primary/10 text-primary"
                >
                  <ShoppingBag className="h-4 w-4" />
                </Badge>
                Booking History
              </CardTitle>
              <Badge variant="secondary" className="px-3">
                {orders.length} Bookings
              </Badge>
            </div>
            <CardDescription>
              Recent transactions from this customer
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="bg-muted/50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-10 w-10 opacity-20" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No Orders Yet</h3>
                <p>This customer hasn&#39;t placed any orders.</p>
              </div>
            ) : (
              <div className="divide-y">
                {orders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg group-hover:text-primary transition-colors">
                            {order.id}
                          </span>
                          <Badge
                            className={cn(
                              "px-2.5 py-0.5 rounded-full font-medium border",
                              getStatusColor(order.status),
                            )}
                          >
                            {order.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                          <span>â€¢</span>
                          <span className="flex items-center gap-1">
                            <Package className="h-3.5 w-3.5" />
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 min-w-[200px]">
                        <div className="text-right">
                          <p className="font-bold text-base">
                            ₦{order.total_amount.toLocaleString()}
                          </p>

                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 group-hover:border-primary group-hover:text-primary transition-colors"
                          >
                            View Details
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
