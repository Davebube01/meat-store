import { ProductCard } from "./ProductCard";
import { Product } from "@/data/products";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="bg-[#FFF8F1] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold font-serif tracking-tight text-[#1a1a1a] md:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover our most popular goat meat selections, carefully prepared
            and ready for delivery
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
