"use client";

import { useState } from "react";
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

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image: string;
  weight?: string;
};

type Order = {
  id: string;
  date: string;
  total: number;
  status: "Delivered" | "Processing" | "Cancelled";
  items: OrderItem[];
};

const mockOrders: Order[] = [
  {
    id: "ORD-2026-001",
    date: "Feb 2, 2026",
    total: 48500,
    status: "Delivered",
    items: [
      {
        name: "Full Goat (Live)",
        quantity: 1,
        price: 45000,
        image:
          "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80",
        weight: "Full",
      },
      {
        name: "Goat Meat (Per Kg)",
        quantity: 1,
        price: 3500,
        image:
          "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80",
        weight: "1kg",
      },
    ],
  },
  {
    id: "ORD-2026-002",
    date: "Jan 28, 2026",
    total: 3500,
    status: "Processing",
    items: [
      {
        name: "Goat Meat (Per Kg)",
        quantity: 1,
        price: 3500,
        image:
          "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80",
        weight: "1kg",
      },
    ],
  },
  {
    id: "ORD-2026-003",
    date: "Jan 15, 2026",
    total: 12000,
    status: "Cancelled",
    items: [
      {
        name: "Goat Leg (Rear)",
        quantity: 2,
        price: 5000,
        image:
          "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80",
        weight: "1 leg",
      },
      {
        name: "Goat Liver & Kidney",
        quantity: 1,
        price: 2000,
        image:
          "https://images.unsplash.com/photo-1574484284008-032fce5a3b2e?auto=format&fit=crop&q=80",
        weight: "1kg",
      },
    ],
  },
];

export default function OrderHistoryPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">
          Order History
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#FF6B35]">
            Home
          </Link>
          <span>/</span>
          <Link href="/profile" className="hover:text-[#FF6B35]">
            Profile
          </Link>
          <span>/</span>
          <span className="text-gray-900">Orders</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-orange-100/50 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-orange-50/30 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">{order.id}</span>
                  <Badge
                    variant={
                      order.status === "Delivered"
                        ? "default"
                        : order.status === "Processing"
                          ? "secondary"
                          : "destructive"
                    }
                    className={
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700 hover:bg-green-100 shadow-none border-green-200"
                        : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none border-blue-200"
                          : "bg-red-100 text-red-700 hover:bg-red-100 shadow-none border-red-200"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Placed on {order.date} •{" "}
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                  items
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900 text-lg">
                  ₦{order.total.toLocaleString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </Button>
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
                    {selectedOrder.date}
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
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.weight && (
                            <span className="mr-2">{item.weight}</span>
                          )}
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₦{item.price.toLocaleString()} each
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
                <span className="text-2xl font-bold font-serif text-[#FF6B35]">
                  ₦{selectedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
