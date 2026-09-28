import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { HowItWorks } from "@/components/home/HowItWorks";
import { DeliveryZonesStrip } from "@/components/home/DeliveryZonesStrip";
import { getCategories, getProducts } from "@/core/api";
import { getDeliveryZones } from "@/core/api/user/delivery";

export default async function Home() {
  // Categories and zones are extras: the page still renders without them.
  const [products, categories, zones] = await Promise.all([
    getProducts(),
    getCategories().catch(() => []),
    getDeliveryZones().catch(() => []),
  ]);

  // Lead with what can actually be bought today.
  const featured = [...products]
    .sort((a, b) => Number(b.stock_quantity > 0) - Number(a.stock_quantity > 0))
    .slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-white text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoryTiles categories={categories} products={products} />
        <FeaturedProducts products={featured} />
        <HowItWorks />
        <WhyChooseUs />
        <DeliveryZonesStrip zones={zones} />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
