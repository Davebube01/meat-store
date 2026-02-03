"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/store/useCart";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductInteractionProps {
  product: Product;
}

export function ProductInteraction({ product }: ProductInteractionProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    product.weightOptions?.[0],
  );
  const { addItem, items } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const cartId = selectedOption
    ? `${product.id}-${selectedOption}`
    : product.id;

  const currentItem = items.find((item) => item.cartId === cartId);
  const currentQuantity = currentItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(product, selectedOption);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {product.weightOptions && product.weightOptions.length > 0 && (
        <div className="border-t border-b py-6 space-y-4">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Available Options:
            </span>
            <div className="flex flex-wrap gap-2">
              {product.weightOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedOption(opt)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-sm font-medium transition-colors border",
                    selectedOption === opt
                      ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                      : "bg-gray-100 text-gray-800 border-transparent hover:bg-gray-200",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 flex items-center gap-4">
        <Button
          size="lg"
          className="w-full md:w-auto h-14 px-8 text-base font-semibold bg-[#FF6B35] hover:bg-[#E85D2A] text-white shadow-lg shadow-orange-200/50 rounded-xl gap-2 transition-all"
          onClick={handleAddToCart}
        >
          {isAdded ? "Added to Cart!" : "Add to Cart"}{" "}
          <ShoppingCart className="h-5 w-5" />
        </Button>

        {currentQuantity > 0 && (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-green-600">
              {currentQuantity} in cart
            </span>
            <span className="text-xs text-muted-foreground">
              Total: ₦{(product.price * currentQuantity).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
