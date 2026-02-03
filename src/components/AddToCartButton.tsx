"use client";

import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/useCart";
import { Product } from "@/data/products";
import { useState } from "react";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      size="lg"
      className="w-full md:w-auto h-14 px-8 text-base font-semibold bg-[#FF6B35] hover:bg-[#E85D2A] text-white shadow-lg shadow-orange-200/50 rounded-xl gap-2 transition-all"
      onClick={handleAddToCart}
    >
      {isAdded ? "Added to Cart!" : "Add to Cart"}{" "}
      <ShoppingCart className="h-5 w-5" />
    </Button>
  );
}
