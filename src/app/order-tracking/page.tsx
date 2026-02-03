"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Package,
  Truck,
  ChefHat,
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
import { useOrderStore } from "@/store/useOrderStore";

export default function OrderTrackingPage() {
  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const { currentOrder } = useOrderStore();
  const [orderFound, setOrderFound] = useState(!!currentOrder);

  // Fallback / Initial State (if no real order)
  const defaultOrder = {
    id: "#ORD-12345",
    date: "December 21, 2023 at 10:06 AM",
    total: "$24.00",
    status: "paid_online",
    items: [],
    timeline: [],
  };

  const displayOrder = currentOrder
    ? {
        id: currentOrder.id,
        date: currentOrder.date,
        total: `₦${currentOrder.total.toLocaleString()}`,
        status: "paid_online",
        items: currentOrder.items.map((item) => ({
          id: item.id,
          name: item.name,
          details: `Quantity ${item.quantity}`,
          price: `₦${item.price.toLocaleString()}`,
          image: item.imageUrl,
        })),
        timeline: [
          {
            title: "Order placed",
            date: currentOrder.date,
            description: "Payment confirmed and ticket generated.",
            status: "current", // Just set as current for now since it's new
            icon: CheckCircle2,
          },
          // ... kept simple for prototype
          {
            title: "Kitchen prepping",
            date: "Pending",
            description: "Chefs will prepare your meals.",
            status: "pending",
            icon: ChefHat,
          },
          {
            title: "Out for delivery",
            date: "Pending",
            description: "Rider to be assigned.",
            status: "pending",
            icon: Truck,
          },
        ],
      }
    : defaultOrder; // Or handle empty state better

  const order = displayOrder;

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, logic to fetch order would go here
    setOrderFound(true);
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
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Search Form */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-sm lg:sticky lg:top-24">
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
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@terraeats.com"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-800 hover:bg-green-900 text-white"
                  >
                    Track order
                    <Search className="w-4 h-4 ml-2" />
                  </Button>
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
          </div>

          {/* Right Column: Order Details */}
          {orderFound && (
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
                        Placed {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total</p>
                      <p className="text-2xl font-bold text-green-700">
                        {order.total}
                      </p>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        PAID ONLINE
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-6 mb-12">
                    <h3 className="font-semibold text-lg">
                      Order items{" "}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        {order.items.length} meals
                      </span>
                    </h3>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.details}
                          </p>
                        </div>
                        <p className="font-semibold text-green-700">
                          {item.price}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-lg">Order status</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Out for delivery
                      </span>
                    </div>

                    <div className="relative space-y-8 pl-2">
                      {order.timeline.map((event, index) => {
                        const Icon = event.icon;
                        const isLast = index === order.timeline.length - 1;
                        const isCompleted = event.status === "completed";
                        const isCurrent = event.status === "current";

                        return (
                          <div key={index} className="relative flex gap-6 z-10">
                            {/* Vertical Line */}
                            {!isLast && (
                              <div
                                className={cn(
                                  "absolute left-[15px] top-10 bottom-[-32px] w-0.5",
                                  isCompleted ? "bg-green-600" : "bg-gray-200",
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
                                    : "border-gray-200 text-gray-300",
                              )}
                            >
                              {isCompleted || isCurrent ? (
                                <Icon className="w-4 h-4" />
                              ) : (
                                <Circle className="w-4 h-4 fill-current" />
                              )}
                            </div>

                            {/* Content */}
                            <div
                              className={cn(
                                "flex-1 pt-1",
                                !isCompleted && !isCurrent && "opacity-50",
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
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
