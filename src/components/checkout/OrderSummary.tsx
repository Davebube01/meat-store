"use client";

import { useCart } from "@/store/useCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function OrderSummary() {
  const { items, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const deliveryFee: number = 0; // To be calculated based on zone
  const total = subtotal + deliveryFee;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div className="flex gap-2">
                <span className="text-muted-foreground">{item.quantity}x</span>
                <span className="line-clamp-1 max-w-[150px]">{item.name}</span>
              </div>
              <span>₦{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>
              {deliveryFee === 0
                ? "Calculated at next step"
                : `₦${deliveryFee.toLocaleString()}`}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
