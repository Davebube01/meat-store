"use client";

import { ProductDetails } from "@/components/admin/products/ProductDetails";
import { getAdminProductBySlug, Product } from "@/core/api";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProductDetailsPage() {
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
      <ProductDetails product={product} />
    </div>
  );
}
