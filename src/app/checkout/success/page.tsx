"use client";

import Link from "next/link";
import { Check, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PaymentSuccessPage() {
  // Mock Data - In a real app, retrieve from URL query or store
  const orderDetails = {
    id: "#ORD-12345",
    method: "Credit Card",
    amount: "₦27,500",
    date: new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {/* Success Icon */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
            <Check className="h-8 w-8" strokeWidth={3} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Payment Successful!
        </h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Thank you for your order. Your payment has been processed
          successfully.
        </p>

        {/* Order Details Card */}
        <Card className="w-full max-w-md mb-8">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-center text-lg mb-4">
              Order Details
            </h3>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Order ID</span>
              <span className="font-semibold text-gray-900">
                {orderDetails.id}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Payment Method</span>
              <span className="font-semibold text-gray-900">
                {orderDetails.method}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Amount Paid</span>
              <span className="font-bold text-green-600 text-lg">
                {orderDetails.amount}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 text-sm">Transaction Date</span>
              <span className="font-semibold text-gray-900 text-sm">
                {orderDetails.date}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 mb-12">
          <Button className="bg-green-700 hover:bg-green-800 px-6" asChild>
            <Link href="/order-tracking?id=ORD-12345">Track Your Order</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="px-6 border-green-700 text-green-700 hover:bg-green-50"
          >
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-100 rounded-lg p-4 w-full max-w-xl flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-green-600" />
            <span>
              A confirmation email has been sent to your registered email
              address.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span>
              Your order will be processed and shipped within 1-2 business days.
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
