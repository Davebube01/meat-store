"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/core/api";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredProducts = initialProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col space-y-8">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-2  p-4 rounded-3xl items-center">
        <div className="relative flex-1 w-full flex items-center">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-12 h-14 w-full rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-green-500/20 text-base shadow-inner transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <select
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-4 pr-10 py-2 text-base text-gray-800 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none transition-colors cursor-pointer shadow-inner font-medium"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="full">Full Goats</option>
            <option value="kg">By Kilogram</option>
            <option value="part">Goat Parts</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
             <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 max-w-md">We couldn't find any products matching your search or category. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
