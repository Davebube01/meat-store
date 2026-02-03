import { ProductDetails } from "@/components/admin/products/ProductDetails";
import { getProductBySlug } from "@/lib/api";
import { notFound } from "next/navigation";

interface ProductDetailsPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <ProductDetails product={product} />
    </div>
  );
}
