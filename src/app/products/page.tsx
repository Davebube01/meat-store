import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export const metadata = {
  title: "All Products - Goat Meat Store",
  description: "Browse our selection of premium fresh goat meat.",
};

export default async function ProductsPage() {
  const products = await getProducts();

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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
