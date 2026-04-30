"use client";

import { ProductList } from "@/components/admin/products/ProductList";
import { Button } from "@/components/ui/button";
import { getAdminProducts, Product } from "@/core/api";
import { Plus, Loader2, AlertCircle } from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminProducts()
      .then(setProducts)
      .catch(() => setError("Could not connect to the backend. Is the server running?"))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    setError(null);
    getAdminProducts()
      .then(setProducts)
      .catch(() => setError("Could not connect to the backend. Is the server running?"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your product inventory.
          </p>
        </div>
        <Link href="/admin/products/create">
          <Button className="bg-[#3f7a55] hover:bg-[#2d583d] text-white font-medium px-4 py-2 rounded-md transition-colors w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading products...</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Backend unavailable</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
          <Button size="sm" variant="outline" onClick={refresh} className="border-red-200 text-red-600">
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && (
        <ProductList products={products} onRefresh={refresh} />
      )}
    </div>
  );
}
