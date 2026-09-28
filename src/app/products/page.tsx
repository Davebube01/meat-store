import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductList } from "./ProductList";
import { getCategories, getProducts } from "@/core/api";

export const metadata = {
  title: "All Products - Goat Meat Store",
  description: "Browse our selection of premium fresh goat meat.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [products, categories, params] = await Promise.all([getProducts(), getCategories(), searchParams]);
  // ?category=<slug> preselects the filter (links from product pages use it).
  const requested = typeof params.category === "string" ? params.category : undefined;
  const initialCategory = categories.some((c) => c.slug === requested) ? requested : "all";

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header />
      <main className="flex-1 py-8 md:py-12 lg:py-24 bg-[#FFF8F1]">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-bold font-serif text-[#1a1a1a] mb-4">
              Our Products
            </h1>
            <p className="text-lg text-gray-600">
              Fresh from the farm to your table
            </p>
          </div>

          <ProductList initialProducts={products} categories={categories} initialCategory={initialCategory} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
