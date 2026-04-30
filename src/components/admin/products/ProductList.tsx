"use client";

import { Product, deleteAdminProduct } from "@/core/api";
import { API_BASE_URL } from "@/core/api/client";
import { Edit, Trash2, Search, ChevronDown, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


interface ProductListProps {
  products: Product[];
  onRefresh?: () => void;
}

export function ProductList({ products, onRefresh }: ProductListProps) {
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
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-48">
            <select className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f7a55]/20 focus:border-[#3f7a55] transition-all text-sm bg-white text-gray-700 cursor-pointer">
              <option>All Categories</option>
              <option>Full Goat</option>
              <option>Parts</option>
              <option>Per Kg</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative w-full md:w-40">
            <select className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f7a55]/20 focus:border-[#3f7a55] transition-all text-sm bg-white text-gray-700 cursor-pointer">
              <option>All Status</option>
              <option>Active</option>
              <option>Low Stock</option>
              <option>Draft</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <button className="bg-[#3f7a55] hover:bg-[#2d583d] text-white px-8 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap">
            Filter
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden">
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
              {products.map((product) => (
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

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {Math.floor(Math.random() * 50) + 1} {/* Mock stock for UI display */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${product.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        href={`/admin/products/${product.slug}/edit`}
                        className="text-[#3f7a55] hover:text-[#2d583d] transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" strokeWidth={2.5} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="text-[#3f7a55] hover:text-[#2d583d] transition-colors"
                        title="View Product"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.5} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No products found. Add your first product to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
