import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { getProducts } from "@/core/api";

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <WhyChooseUs />
        <FeaturedProducts products={featured} />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
