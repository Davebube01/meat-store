"use client";

import { useSearchParams } from "next/navigation";
import { X, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

import { Suspense } from "react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "Payment Declined";

  const errorDetails = {
    transactionId: "#TXN-789456",
    code: "PAY-ERR-001",
    amount: "₦27,500",
  };

  return (
    <>
      {/* Failed Icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-400 text-white shadow-sm">
          <X className="h-8 w-8" strokeWidth={3} />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Payment Failed
      </h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        We're sorry, but your payment could not be processed at this time.
      </p>

      {/* Error Details Card */}
      <Card className="w-full max-w-md mb-8 border-red-100">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2 text-lg mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Transaction Details
          </h3>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Transaction ID</span>
            <span className="font-semibold text-gray-900">
              {errorDetails.transactionId}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Error Code</span>
            <span className="font-bold text-red-500">{errorDetails.code}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Reason</span>
            <span className="font-semibold text-gray-900">{reason}</span>
          </div>
          <div className="flex justify-between py-2 pt-4">
            <span className="text-gray-500 text-sm">Amount</span>
            <span className="font-bold text-green-600 text-lg">
              {errorDetails.amount}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Common Reasons */}
      <div className="bg-red-50 rounded-lg p-6 w-full max-w-md mb-8">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-red-500" />
          Common Reasons for Payment Failure
        </h4>
        <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
          <li>Insufficient funds in your account</li>
          <li>Incorrect card details (number, expiry date, or CVV)</li>
          <li>Card has expired or been cancelled</li>
          <li>Bank security restrictions or fraud protection</li>
          <li>Daily transaction limit exceeded</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button className="bg-amber-900 hover:bg-amber-800 px-8" asChild>
          <Link href="/checkout">Try Again</Link>
        </Button>
        <Button variant="outline" className="px-6 text-gray-600">
          Contact Support
        </Button>
      </div>
    </>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-red-50/10">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <Suspense fallback={<div>Loading details...</div>}>
          <PaymentFailedContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
