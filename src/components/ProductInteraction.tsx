"use client";

import { useState } from "react";
import { Product } from "@/core/api";
import { useCart } from "@/core/store/useCart";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductInteractionProps {
  product: Product;
}

export function ProductInteraction({ product }: ProductInteractionProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    product.weight_options?.[0],
  );
  const { addItem, items } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const outOfStock = product.stock_quantity <= 0;

  const cartId = selectedOption
    ? `${product.id}-${selectedOption}`
    : product.id;

  const currentItem = items.find((item) => item.cartId === cartId);
  const currentQuantity = currentItem?.quantity || 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(product, selectedOption);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {product.weight_options && product.weight_options.length > 0 && (
        <div className="border-t border-b py-6 space-y-4">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Available Options:
            </span>
            <div className="flex flex-wrap gap-2">
              {product.weight_options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedOption(opt)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-sm font-medium transition-colors border",
                    selectedOption === opt
                      ? "bg-[#22c55e] text-white border-[#22c55e]"
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
          disabled={outOfStock}
          className="w-full md:w-auto h-14 px-8 text-base font-semibold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg shadow-green-200/50 rounded-xl gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#22c55e]"
          onClick={handleAddToCart}
        >
          {outOfStock ? "Out of Stock" : isAdded ? "Added to Cart!" : "Add to Cart"}{" "}
          {!outOfStock && <ShoppingCart className="h-5 w-5" />}
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
