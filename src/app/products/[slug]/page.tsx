import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ChevronRight, Clock, CreditCard, Store, Truck } from "lucide-react";
import { getProductDetail, hasVaryingPrices } from "@/core/api";
import { getDeliveryZones } from "@/core/api/user/delivery";
import { getDisplayImageUrl } from "@/lib/imageUrl";
import { ProductInteraction } from "@/components/ProductInteraction";
import { ProductCard } from "@/components/ProductCard";
import { BackButton } from "@/components/product/BackButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const LOW_STOCK = 5;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const detail = await getProductDetail(slug);
  if (!detail) return { title: "Product not found" };
  return {
    title: `${detail.product.name} | Everything Fresh`,
    description: detail.product.description,
  };
}

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const [detail, zones] = await Promise.all([
    getProductDetail(slug),
    // Only used for the "from ₦…" delivery line; the page works without it.
    getDeliveryZones().catch(() => []),
  ]);

  if (!detail) notFound();
  const { product, category_name: categoryName, related } = detail;

  const stock = Math.floor(product.stock_quantity);
  const outOfStock = stock <= 0;
  const unit = product.category === "per-kg" ? "kg" : "unit";
  const cheapestZone = zones.length ? Math.min(...zones.map((z) => z.estimated_fee)) : null;
  const categoryHref = categoryName ? `/products?category=${encodeURIComponent(product.category)}` : "/products";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 pb-28 pt-6 md:pt-8 lg:pb-24">
          {/* Back + breadcrumb */}
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 md:mb-8">
            <BackButton />
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
              <Link href="/products" className="hover:text-gray-900">Shop</Link>
              {categoryName && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                  <Link href={categoryHref} className="hover:text-gray-900">{categoryName}</Link>
                </>
              )}
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
              <span className="truncate font-medium text-gray-900" aria-current="page">{product.name}</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Image */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100 lg:sticky lg:top-24">
                <Image
                  src={getDisplayImageUrl(product.image_url)}
                  alt={product.name}
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className={`object-cover ${outOfStock ? "opacity-60 grayscale" : ""}`}
                />
                <div className="absolute left-4 top-4 flex gap-2">
                  {outOfStock ? (
                    <span className="rounded-full bg-gray-900/85 px-3 py-1 text-xs font-semibold text-white">Sold out</span>
                  ) : stock <= LOW_STOCK ? (
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">Only {stock} left</span>
                  ) : (
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2d583d] shadow-sm backdrop-blur">Fresh today</span>
                  )}
                </div>
              </div>
            </div>

            {/* Buy box */}
            <div className="lg:col-span-5">
              {categoryName && (
                <Link
                  href={categoryHref}
                  className="inline-flex rounded-full bg-[#f4f7f5] px-3 py-1 text-xs font-semibold text-[#2d583d] hover:bg-[#dcebe1]"
                >
                  {categoryName}
                </Link>
              )}
              <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#1a1a1a] md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-2">
                {hasVaryingPrices(product) && <span className="text-base text-gray-500">from</span>}
                <span className="text-3xl font-bold tracking-tight text-gray-900 tabular-nums">
                  ₦{product.price.toLocaleString()}
                </span>
                {!product.weight_options?.length && <span className="text-base text-gray-500">per {unit}</span>}
              </div>

              <p className={`mt-2 flex items-center gap-2 text-sm font-medium ${outOfStock ? "text-red-600" : stock <= LOW_STOCK ? "text-amber-600" : "text-[#3f7a55]"}`}>
                <span className={`h-2 w-2 rounded-full ${outOfStock ? "bg-red-500" : stock <= LOW_STOCK ? "bg-amber-500" : "bg-[#22c55e]"}`} />
                {outOfStock ? "Out of stock right now" : stock <= LOW_STOCK ? `Low stock: ${stock} left` : "In stock"}
              </p>

              {product.description && (
                <p className="mt-5 text-base leading-relaxed text-gray-600">{product.description}</p>
              )}

              <div className="my-6 h-px bg-gray-100" />

              <ProductInteraction product={product} unit={unit} />

              {/* Delivery & payment */}
              <ul className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-200">
                <li className="flex gap-3 p-4">
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#3f7a55]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Delivery across Abuja</p>
                    <p className="text-sm text-gray-500">
                      Pick a date and a 1-hour slot at checkout.
                      {cheapestZone !== null && <> Fees from ₦{cheapestZone.toLocaleString()} depending on your area.</>}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 p-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#3f7a55]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Delivery fee is paid in cash</p>
                    <p className="text-sm text-gray-500">You pay the courier when your order arrives. Only your items are charged online.</p>
                  </div>
                </li>
                <li className="flex gap-3 p-4">
                  <Store className="mt-0.5 h-5 w-5 shrink-0 text-[#3f7a55]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Free pickup</p>
                    <p className="text-sm text-gray-500">Prefer to collect? Choose pickup at checkout.</p>
                  </div>
                </li>
                <li className="flex gap-3 p-4">
                  <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-[#3f7a55]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Secure payment</p>
                    <p className="text-sm text-gray-500">Card, transfer or USSD through Paystack.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-16 md:mt-24">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] md:text-3xl">
                  More {categoryName ? `from ${categoryName}` : "you might like"}
                </h2>
                <Link href={categoryHref} className="inline-flex shrink-0 items-center text-sm font-semibold text-[#3f7a55] hover:underline">
                  See all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
