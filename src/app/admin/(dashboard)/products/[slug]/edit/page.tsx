import { ProductForm } from "@/components/admin/products/ProductForm";
import { getProductBySlug } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: {
    slug: string;
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
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
