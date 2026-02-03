import { getProductBySlug } from "@/lib/api";
import { ProductInteraction } from "@/components/ProductInteraction";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} - Goat Meat Store`,
    description: product.description,
  };
}

export default async function ProductDetail(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header />
      <main className="flex-1 py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div className="relative aspect-square md:aspect-4/3 rounded-3xl overflow-hidden bg-gray-100">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold font-serif text-[#1a1a1a]">
                {product.name}
              </h1>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[#FF6B35]">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="text-gray-500 mb-1 font-medium text-lg">
                  / {product.category === "kg" ? "kg" : "unit"}
                </span>
              </div>

              <div className="pt-2">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>
                <div className="border-t pt-6">
                  <ProductInteraction product={product} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
