"use client";

import { useMemo, useState } from "react";
import { Product, deleteAdminProduct } from "@/core/api";
import { API_BASE_URL } from "@/core/api/client";
import { Edit, Trash2, Search, Eye } from "lucide-react";
import Link from "next/link";
import { useAdminCan } from "@/core/store/useAdminCan";
import Image from "next/image";
import { DropdownSelect } from "@/components/ui/dropdown-select";

// Fallback only if the API didn't send one; the store default lives in Settings.
const DEFAULT_LOW_STOCK_THRESHOLD = 5;
const isLow = (p: Product) => p.stock_quantity <= (p.effective_low_stock_threshold ?? DEFAULT_LOW_STOCK_THRESHOLD);

type StatusFilter = "all" | "active" | "low_stock" | "draft";

interface ProductListProps {
  products: Product[];
  onRefresh?: () => void;
}

export function ProductList({ products, onRefresh }: ProductListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const can = useAdminCan();

  // Search and Category above are still decorative — not part of this pass,
  // which is scoped to the stock column and the Low Stock filter.
  const filteredProducts = useMemo(() => {
    switch (statusFilter) {
      case "active":
        return products.filter((p) => p.is_active);
      case "draft":
        return products.filter((p) => !p.is_active);
      case "low_stock":
        return products.filter(isLow);
      default:
        return products;
    }
  }, [products, statusFilter]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteAdminProduct(id);
      onRefresh?.();
    }
  };

  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };


  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f7a55]/20 focus:border-[#3f7a55] transition-all text-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 sm:gap-4">
          <DropdownSelect
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            className="w-full sm:w-48"
            options={[
              { value: "all", label: "All Categories" },
              { value: "full-goat", label: "Full Goat" },
              { value: "parts", label: "Parts" },
              { value: "per-kg", label: "Per Kg" },
            ]}
          />

          <DropdownSelect
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            className="w-full sm:w-40"
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "low_stock", label: "Low Stock" },
              { value: "draft", label: "Draft" },
            ]}
          />

          <button className="w-full sm:w-auto bg-[#3f7a55] hover:bg-[#2d583d] text-white px-8 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap">
            Filter
          </button>
        </div>
      </div>

      {/* Empty state, shared by both layouts */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] px-6 py-8 text-center text-gray-500">
          {products.length === 0
            ? "No products found. Add your first product to get started!"
            : "No products match this filter."}
        </div>
      )}

      {/* Cards — phones and small tablets (below md), where a 6-column table won't fit */}
      {filteredProducts.length > 0 && (
        <ul className="space-y-3 md:hidden">
          {filteredProducts.map((product) => (
            <li key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] p-4">
              <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                  <Image src={getFullImageUrl(product.image_url)} alt={product.name} fill unoptimized className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-gray-700 text-sm">{product.name}</span>
                    <span className="shrink-0 font-bold text-gray-700 text-sm">₦{product.price.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{product.description || "Fresh selection"}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-gray-500 capitalize">{product.category}</span>
                    <span className="text-gray-300">&middot;</span>
                    <span className={isLow(product) ? "text-xs font-semibold text-red-600" : "text-xs text-gray-600"}>
                      {product.stock_quantity} in stock
                    </span>
                    {isLow(product) && (
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600 bg-red-50">
                        Low
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${product.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-4 border-t border-gray-100 pt-3">
                {can("products.edit") && (
                  <Link href={`/admin/products/${product.slug}/edit`} className="flex items-center gap-1.5 text-sm font-medium text-[#3f7a55]" title="Edit Product">
                    <Edit className="h-4 w-4" strokeWidth={2.5} /> Edit
                  </Link>
                )}
                <Link href={`/admin/products/${product.slug}`} className="flex items-center gap-1.5 text-sm font-medium text-[#3f7a55]" title="View Product">
                  <Eye className="h-4 w-4" strokeWidth={2.5} /> View
                </Link>
                {can("products.edit") && (
                  <button onClick={() => handleDelete(product.id)} className="flex items-center gap-1.5 text-sm font-medium text-red-500" title="Delete Product">
                    <Trash2 className="h-4 w-4" strokeWidth={2.5} /> Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Table — md and up */}
      {filteredProducts.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#f4f7f5] text-[#2d4d3a] text-xs uppercase font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 rounded-tl-xl w-[300px]">Product</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Stock</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-center rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                          <Image
                            src={getFullImageUrl(product.image_url)}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700 text-sm whitespace-nowrap">
                            {product.name}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                            {product.description || "Fresh selection"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      ₦{product.price.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={isLow(product) ? "font-semibold text-red-600" : "text-gray-600"}>
                        {product.stock_quantity}
                      </span>
                      {isLow(product) && (
                        <span className="ml-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600 bg-red-50">
                          Low
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${product.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {can("products.edit") && <Link
                          href={`/admin/products/${product.slug}/edit`}
                          className="text-[#3f7a55] hover:text-[#2d583d] transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" strokeWidth={2.5} />
                        </Link>}
                        <Link
                          href={`/admin/products/${product.slug}`}
                          className="text-[#3f7a55] hover:text-[#2d583d] transition-colors"
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" strokeWidth={2.5} />
                        </Link>
                        {can("products.edit") && <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                        </button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
