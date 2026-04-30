"use client";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/core/store/useCart";
import { Product } from "@/core/api";
import { API_BASE_URL } from "@/core/api/client";

export function ProductCard(product: Product) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group flex h-full flex-col overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100">
        {/* Image Container with Checkered Pattern Border */}
        <div className="relative aspect-square overflow-hidden bg-linear-to-b from-gray-50 to-white p-4">
          {/* Decorative top border with checkered pattern effect */}
          {/* <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-500 via-white to-red-500 opacity-20"></div> */}

          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner">
            <Image
              src={getFullImageUrl(product.image_url)}
              alt={product.name}
              fill
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 md:p-6 pt-4 md:pt-5 bg-linear-to-b from-white to-gray-50">
          <h3
            className="text-xl font-bold text-green-700 tracking-tight mb-2"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 tracking-tight mb-0.5">
                ₦{product.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 font-medium tracking-wider">
                per {product.category === "kg" ? "kilogram" : "unit"}
              </p>
            </div>

            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
