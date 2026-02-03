"use client";

import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/api";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(product.slug);
      router.push("/admin/products");
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Link
          href="/admin/products"
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link
            href={`/admin/products/${product.slug}/edit`}
            className="flex-1 sm:flex-none"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex-1 sm:flex-none w-full sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 capitalize mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          <div className="prose text-gray-600">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p>{product.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
              Details
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-gray-500">Slug</dt>
              <dd className="font-mono text-gray-900">{product.slug}</dd>

              <dt className="text-gray-500">Weight Options</dt>
              <dd className="text-gray-900">
                {product.weightOptions.join(", ")}
              </dd>

              {product.parts && (
                <>
                  <dt className="text-gray-500">Parts</dt>
                  <dd className="text-gray-900">{product.parts.join(", ")}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
