"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

import { getUserOrders, UserOrder } from "@/core/api/user/orders";
import { API_BASE_URL } from "@/core/api/client";
import { useAuthStore } from "@/core/store/useAuthStore";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { SignInModal } from "@/components/SignInModal";

export default function OrderHistoryPage() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getUserOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "delivered": return { label: "Delivered", variant: "delivered" };
      case "in_transit": return { label: "In Transit", variant: "in_transit" };
      case "processing": return { label: "Processing", variant: "processing" };
      case "paid": return { label: "Paid", variant: "paid" };
      case "awaiting_verification": return { label: "Awaiting Payment", variant: "awaiting" };
      case "cancelled": return { label: "Cancelled", variant: "cancelled" };
      case "pending": default: return { label: "Pending", variant: "pending" };
    }
  };

  const getBadgeClass = (variant: string) => {
    switch (variant) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "in_transit": return "bg-purple-100 text-purple-700 border-purple-200";
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "paid": return "bg-teal-100 text-teal-700 border-teal-200";
      case "awaiting": return "bg-orange-100 text-orange-700 border-orange-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (isMounted && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 lg:py-12 max-w-5xl flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Please Sign In</h1>
            <p className="text-gray-500">
              You need to be signed in to view your orders.
            </p>
            <SignInModal>
              <Button className="bg-green-700 hover:bg-green-700/90">
              Sign In
            </Button>
            </SignInModal>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">
            Order History
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#22c55e]">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">Orders</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-12 text-center text-gray-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-gray-500 my-2">You haven't placed any orders yet.</div>
            ) : orders.map((order) => (
              <div
                key={order.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-green-50/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{order.id}</span>
                    <Badge
                      className={cn(
                        "shadow-none border text-xs",
                        getBadgeClass(getStatusDisplay(order.status).variant)
                      )}
                    >
                      {getStatusDisplay(order.status).label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.created_at).toLocaleDateString()} •{" "}
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    items
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900 text-lg">
                    ₦{order.total_amount.toLocaleString()}
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-xl bg-green-700 hover:bg-green-800"
                      asChild
                    >
                      <Link href={`/order-tracking?id=${order.id}`}>
                        Track Order
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Dialog
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">
                Order Details
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-bold text-gray-900">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 text-right">Date</p>
                    <p className="font-bold text-gray-900">
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Items</h3>
                  <div className="divide-y divide-gray-100 border rounded-xl overflow-hidden">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 flex items-center gap-4 bg-white"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <Image
                            src={getFullImageUrl(item.product?.image_url)}
                            alt={item.product?.name || "Product"}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.product?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.selected_option && (
                              <span className="mr-2">{item.selected_option}</span>
                            )}
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ₦{(item.price_at_time * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₦{item.price_at_time.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-lg font-bold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold font-serif text-[#22c55e]">
                    ₦{selectedOrder.total_amount.toLocaleString()}
                  </span>
                </div>

                {/* Payment reference & paid_at */}
                {(selectedOrder.payment_reference || selectedOrder.paid_at) && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Info</p>
                    {selectedOrder.payment_reference && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Reference</span>
                        <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {selectedOrder.payment_reference}
                        </span>
                      </div>
                    )}
                    {selectedOrder.paid_at && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Paid at</span>
                        <span className="text-sm text-gray-700 font-medium">
                          {new Date(selectedOrder.paid_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
