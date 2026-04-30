"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockCards = [
  {
    id: "card_1",
    last4: "4242",
    brand: "Mastercard",
    exp: "12/28",
    default: true,
  },
  {
    id: "card_2",
    last4: "9876",
    brand: "Visa",
    exp: "05/27",
    default: false,
  },
];

export default function PaymentMethodsPage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1a1a1a] mb-2">
          Payment Methods
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#22c55e]">
            Home
          </Link>
          <span>/</span>
          <Link href="/profile" className="hover:text-[#22c55e]">
            Profile
          </Link>
          <span>/</span>
          <span className="text-gray-900">Payment</span>
        </div>
      </div>

      <div className="grid gap-6">
        {mockCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-green-100/50 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold text-xs shrink-0">
                {card.brand.toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">
                    â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ {card.last4}
                  </span>
                  {card.default && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-[#22c55e] border-green-200"
                    >
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">Expires {card.exp}</p>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button className="h-12 border-dashed border-gray-300 bg-transparent text-gray-500 hover:bg-gray-50 hover:text-[#22c55e] shadow-none border-2 text-base font-medium rounded-2xl w-full">
          <Plus className="h-5 w-5 mr-2" />
          Add New Card
        </Button>
      </div>
    </>
  );
}
