"use client";

import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = mounted ? getCartTotal() : 0;
  const deliveryFee = 2000;
  const finalTotal = total + deliveryFee;

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header />
      <main className="flex-1 py-12 bg-[#FFF8F1]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold font-serif text-[#1a1a1a] mb-8">
            Your Cart
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-8">
                Looks like you haven't added anything yet.
              </p>
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-[#FF6B35] hover:bg-[#E85D2A] text-white"
                >
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.cartId || item.id}
                    className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm items-center"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      {item.selectedOption && (
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Option: {item.selectedOption}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mb-2">
                        ₦{item.price.toLocaleString()} /{" "}
                        {item.category === "kg" ? "kg" : "unit"}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                          <button
                            className="p-1 hover:bg-white rounded-md transition-colors disabled:opacity-50"
                            onClick={() =>
                              updateQuantity(
                                item.cartId || item.id,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <button
                            className="p-1 hover:bg-white rounded-md transition-colors"
                            onClick={() =>
                              updateQuantity(
                                item.cartId || item.id,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.cartId || item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right font-bold text-lg">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="mt-4 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₦{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee (Abuja)</span>
                      <span>₦{deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span>₦{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button className="w-full h-12 text-lg bg-[#FF6B35] hover:bg-[#E85D2A] text-white mb-4">
                    Proceed to Checkout
                  </Button>

                  <Link
                    href="/products"
                    className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" /> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
