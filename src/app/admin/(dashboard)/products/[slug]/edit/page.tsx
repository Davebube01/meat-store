"use client";

import { ProductForm } from "@/components/admin/products/ProductForm";
import { getAdminProductBySlug, Product } from "@/core/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getAdminProductBySlug(slug)
      .then((p) => {
        if (!p) setError(true);
        else setProduct(p);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/admin/products/${slug}`}
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Product Details
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Edit Product</h1>
        <p className="text-muted-foreground">
          Update the details for{" "}
          <span className="font-semibold text-gray-900">{product.name}</span>.
        </p>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}
