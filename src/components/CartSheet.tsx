"use client";

import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

export function CartSheet() {
  
  const { items, removeItem, updateQuantity, getCartTotal } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative text-amber-900 hover:text-amber-700 hover:bg-amber-50"
      >
        <ShoppingCart className="h-6 w-6" />
      </Button>
    );
  }

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-amber-900 hover:text-amber-700 hover:bg-amber-50"
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="h-20 w-20 bg-orange-50 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-orange-200" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-semibold text-gray-900">
                  Your cart is empty
                </p>
                <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                  Looks like you haven't added any goat meat to your cart yet.
                </p>
              </div>
              <Link href={"/products"}>
                <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="mt-4"
              >
                Start Shopping
              </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.cartId || item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-gray-50">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="grid gap-1">
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {item.name}
                      </h3>
                      {item.selectedOption && (
                        <p className="text-xs text-muted-foreground">
                          Option: {item.selectedOption}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-none"
                          onClick={() =>
                            updateQuantity(
                              item.cartId || item.id,
                              item.quantity - 1,
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-4 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-none"
                          onClick={() =>
                            updateQuantity(
                              item.cartId || item.id,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.cartId || item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t pt-6">
            <div className="w-full space-y-4">
              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>₦{getCartTotal().toLocaleString()}</span>
              </div>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 font-bold"
                size="lg"
                asChild
              >
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  Proceed to Checkout
                </Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
