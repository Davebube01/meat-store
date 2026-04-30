"use client";

import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Package,
  Truck,
  ChefHat,
  ShoppingBag,
  ChevronRight,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { getUserOrderById, getUserOrders, getPublicOrderTrack, UserOrder, UserOrderItem } from "@/core/api/user/orders";
import { API_BASE_URL } from "@/core/api/client";
import { useAuthStore } from "@/core/store/useAuthStore";

export default function OrderTrackingPage() {
  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [order, setOrder] = useState<UserOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const { isAuthenticated } = useAuthStore();
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [recentGuestTrackings, setRecentGuestTrackings] = useState<{id: string, email?: string}[]>([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    const emailParam = urlParams.get("email");
    
    if (idParam && !initialLoadDone) {
      setSearchId(idParam);
      if (emailParam) {
        setSearchEmail(emailParam);
      }
      // For initial generic URL tracks, try to fetch if authenticated or it will gracefully fail demanding email
      fetchTracking(idParam, emailParam || undefined);
      setInitialLoadDone(true);
    }

    try {
      const cached = localStorage.getItem("tracked_orders");
      if (cached) {
        const parsed = JSON.parse(cached);
        const normalized = parsed.map((item: any) => 
          typeof item === "string" ? { id: item, email: "" } : item
        );
        setRecentGuestTrackings(normalized);
      }
    } catch(e) {}

    if (isAuthenticated) {
      getUserOrders().then((data) => {
        setUserOrders(data);
        if (!idParam && !order && data.length > 0) {
           const mostRecentActive = data.find(o => !["delivered", "cancelled"].includes(o.status)) || data[0];
           setSearchId(mostRecentActive.id);
           fetchTracking(mostRecentActive.id);
        }
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const fetchTracking = async (id: string, email?: string) => {
    if (!id) return;
    
    if (!isAuthenticated && !email && searchEmail === "") {
        setErrorText("Email Address is required to track an order as a guest.");
        setOrder(null);
        return;
    }

    setIsLoading(true);
    setErrorText("");
    try {
      const fetchedOrder = isAuthenticated 
          ? await getUserOrderById(id)
          : await getPublicOrderTrack(id, email || searchEmail);
          
      setOrder(fetchedOrder);

      try {
        const cached = localStorage.getItem("tracked_orders");
        let trackings: any[] = cached ? JSON.parse(cached) : [];
        const normalized = trackings.map((item: any) => 
          typeof item === "string" ? { id: item, email: "" } : item
        );
        
        // Remove if already exists
        const filtered = normalized.filter((t: any) => t.id !== id);
        
        // Add to front
        const newTrackings = [{ id, email: email || searchEmail }, ...filtered].slice(0, 5); 
        localStorage.setItem("tracked_orders", JSON.stringify(newTrackings));
        setRecentGuestTrackings(newTrackings);
      } catch(e) {}

    } catch (err: any) {
      // The err object here will be an instance of ApiError (e.g., NotFoundError)
      // due to the handleApiResponseError in fetchClient.
      const { ApiError, NotFoundError } = await import("@/core/errors/apiErrors");
      
      if (err instanceof NotFoundError) {
        setErrorText("We couldn't find an order with that ID and Email combination. Please double-check your details.");
      } else if (err instanceof ApiError) {
        setErrorText(err.message);
      } else {
        setErrorText("An unexpected error occurred. Please try again later.");
      }
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(searchId, searchEmail);
  };

  const generateTimeline = (status: string) => {
    const isCancelled = status === "cancelled";

    if (isCancelled) {
      return [
        {
          title: "Order placed",
          date: order?.created_at ? new Date(order.created_at).toLocaleDateString() : "",
          description: "Your order was received.",
          status: "completed",
          icon: CheckCircle2,
        },
        {
          title: "Cancelled",
          date: "",
          description: "Order has been cancelled.",
          status: "cancelled",
          icon: Circle,
        }
      ];
    }

    // Maps each backend status to which timeline step should be "current"
    // Backend statuses: pending | awaiting_verification | paid | processing | in_transit | delivered
    const statusToStep: Record<string, number> = {
      pending:                0,  // Order placed (waiting for payment)
      awaiting_verification:  0,  // Still at order-placed step
      paid:                   0,  // Payment received, not yet processing
      processing:             1,  // Kitchen prepping
      in_transit:             2,  // Out for delivery
      delivered:              3,  // Delivered
    };

    const currentStepIndex = statusToStep[status] ?? 0;

    const timelineTemplate = [
      {
        id: "pending",
        title: "Order placed",
        description: "Payment confirmed and ticket generated.",
        icon: CheckCircle2,
      },
      {
        id: "processing",
        title: "Order currently being prepared.",
        description: "Our team is working on your order.",
        icon: ShoppingBag,
      },
      {
        id: "in_transit",
        title: order?.delivery_method === "pickup" ? "Ready for Pickup" : "Out for delivery",
        description: order?.delivery_method === "pickup" ? "Your order is ready for pickup at our store." : "Rider is bringing it to you.",
        icon: order?.delivery_method === "pickup" ? Store : Truck,
      },
      {
        id: "delivered",
        title: order?.delivery_method === "pickup" ? "Picked Up" : "Delivered",
        description: order?.delivery_method === "pickup" ? "Your order has been picked up." : "Your order has been delivered.",
        icon: Package,
      },
    ];

    return timelineTemplate.map((step, index) => {
      let stepStatus: string;
      if (index < currentStepIndex) {
        stepStatus = "completed";
      } else if (index === currentStepIndex) {
        stepStatus = "current";
      } else {
        stepStatus = "pending";
      }

      return {
        ...step,
        date: stepStatus === "completed" || stepStatus === "current"
          ? new Date(order?.created_at || "").toLocaleDateString()
          : "Pending",
        status: stepStatus,
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />

      {/* Hero / Header Section */}
      <div className="bg-white border-b py-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live order tracking
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Track your TerraEats delivery in real time
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Enter your order ID and email to view the latest status, estimated
          arrival window, and delivery contact details.
        </p>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Search Form */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 self-start">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  FIND YOUR ORDER
                </span>
                <CardTitle className="text-xl">Enter your details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTrackOrder} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="orderId">Order ID *</Label>
                    <Input
                      id="orderId"
                      placeholder="e.g. #ORD-12345"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address {!isAuthenticated && <span className="text-red-500">*</span>}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@terraeats.com"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      required={!isAuthenticated}
                    />
                    {!isAuthenticated && <p className="text-xs text-gray-500">Required for guest tracking authentication.</p>}
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-800 hover:bg-green-900 text-white"
                  >
                    {isLoading ? "Searching..." : "Track order"}
                    <Search className="w-4 h-4 ml-2" />
                  </Button>
                  
                  {errorText && <p className="text-red-500 text-sm mt-2">{errorText}</p>}
                </form>

                <div className="mt-8 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <h4 className="font-semibold mb-1">Need help?</h4>
                  <p>
                    Chat with support 24/7 or email{" "}
                    <strong>support@terraeats.com</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders List */}
            {(isAuthenticated && userOrders.length > 0) || (!isAuthenticated && recentGuestTrackings.length > 0) ? (
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {isAuthenticated ? "YOUR RECENT ORDERS" : "RECENTLY TRACKED"}
                  </span>
                  <CardTitle className="text-xl">Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isAuthenticated ? (
                    userOrders.slice(0, 2).map(uOrder => (
                      <div key={uOrder.id} className={cn("flex items-center justify-between p-3 border rounded-lg transition cursor-pointer", order?.id === uOrder.id ? "border-green-500 bg-green-50" : "hover:border-green-300 hover:bg-green-50")} onClick={() => { setSearchId(uOrder.id); fetchTracking(uOrder.id); }}>
                        <div>
                          <p className="font-bold text-gray-900">{uOrder.id}</p>
                          <p className="text-xs text-gray-500">{new Date(uOrder.created_at).toLocaleDateString()} • ₦{uOrder.total_amount.toLocaleString()}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))
                  ) : (
                    recentGuestTrackings.map(t => (
                      <div key={t.id} className={cn("flex items-center justify-between p-3 border rounded-lg transition cursor-pointer", order?.id === t.id ? "border-green-500 bg-green-50" : "hover:border-green-300 hover:bg-green-50")} onClick={() => { setSearchId(t.id); if (t.email) setSearchEmail(t.email); fetchTracking(t.id, t.email); }}>
                        <div className="flex items-center gap-2">
                           <ShoppingBag className="w-4 h-4 text-gray-500" />
                           <p className="font-bold text-gray-900">{t.id}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))
                  )}
                  {isAuthenticated && userOrders.length > 5 && (
                    <div className="pt-2 border-t mt-2">
                        <Button variant="link" asChild className="w-full text-green-700 h-8">
                            <Link href="/orders">
                            View all past orders
                            </Link>
                        </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}

          </div>

          {/* Right Column: Order Details */}
          {order && (
            <div className="lg:col-span-8 space-y-8">
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="p-6 lg:p-8">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-8 border-b">
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                        ACTIVE ORDER
                      </span>
                      <h2 className="text-3xl font-bold text-gray-900 mb-1">
                        {order.id}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Placed {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-green-700">
                        ₦{order.total_amount.toLocaleString()}
                      </p>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {order.payment_method || "ONLINE"}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-6 mb-12">
                    <h3 className="font-semibold text-lg">
                      Order items{" "}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} meals
                      </span>
                    </h3>
                    {order.items.map((item: UserOrderItem) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={getFullImageUrl(item.product?.image_url)}
                            alt={item.product?.name || "Product image"}
                            fill
                            unoptimized
                            className="object-cover"
                          />

                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.product?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.selected_option && <span className="mr-2">{item.selected_option}</span>}
                            Qty {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-green-700">
                          ₦{(item.price_at_time * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-lg">Order status</h3>
                      <span className={cn(
                          "text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1",
                          order.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", order.status === "cancelled" ? "bg-red-500" : "bg-green-500")} />
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="relative space-y-8 pl-2">
                      {generateTimeline(order.status).map((event: any, index: number) => {
                        const Icon = event.icon;
                        const timelineLength = order.status === "cancelled" ? 2 : 4;
                        const isLast = index === timelineLength - 1;
                        const isCompleted = event.status === "completed";
                        const isCurrent = event.status === "current";
                        const isCancelledStep = event.status === "cancelled";

                        return (
                          <div key={index} className="relative flex gap-6 z-10">
                            {/* Vertical Line */}
                            {!isLast && (
                              <div
                                className={cn(
                                  "absolute left-[15px] top-10 bottom-[-32px] w-0.5",
                                  isCompleted ? "bg-green-600" : isCancelledStep ? "bg-red-600" : "bg-gray-200",
                                )}
                              />
                            )}

                            {/* Icon */}
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 bg-white",
                                isCompleted
                                  ? "border-green-600 text-green-600"
                                  : isCurrent
                                    ? "border-green-600 text-green-600 ring-4 ring-green-100"
                                    : isCancelledStep 
                                      ? "border-red-600 text-red-600 ring-4 ring-red-100"
                                      : "border-gray-200 text-gray-300",
                              )}
                            >
                              {isCompleted || isCurrent || isCancelledStep ? (
                                <Icon className="w-4 h-4" />
                              ) : (
                                <Circle className="w-4 h-4 fill-current" />
                              )}
                            </div>

                            {/* Content */}
                            <div
                              className={cn(
                                "flex-1 pt-1",
                                !isCompleted && !isCurrent && !isCancelledStep && "opacity-50",
                              )}
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                <h4 className="font-bold text-gray-900">
                                  {event.title}
                                </h4>
                                <span className="text-xs text-gray-500 font-medium">
                                  {event.date}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>

              {!isAuthenticated && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Want to see all your orders easily next time?</h4>
                    <p className="text-sm text-gray-600">Create a free account to automatically track order history and checkout faster.</p>
                  </div>
                  <Button asChild className="bg-green-700 hover:bg-green-800 whitespace-nowrap">
                    <Link href={`/login?email=${encodeURIComponent(searchEmail)}`}>Create free account</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
