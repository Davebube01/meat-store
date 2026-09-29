import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/home/HowItWorks";
import { DeliveryZonesStrip } from "@/components/home/DeliveryZonesStrip";
import { getCategories, getProducts } from "@/core/api";
import { getDeliveryZones } from "@/core/api/user/delivery";
import { getStoreInfo, type StoreInfo } from "@/core/api/user/store";
import meat from "@/assets/meat1.jpg";

export const metadata = {
  title: "About us | Everything Fresh",
  description: "Who we are, how we prepare your order and where we deliver in Abuja.",
};

// Neutral wording until the store writes its own story in Admin → Settings.
// It only says what the shop actually does (see How it works below): no
// invented history, people or numbers.
const DEFAULT_HEADLINE = "Fresh goat meat, prepared with care and delivered across Abuja";
const DEFAULT_STORY =
  "We're a local shop focused on one thing: fresh goat meat and the market produce that goes with it.\n\n" +
  "You choose the cut and the portion, we prepare it on the day, and you pick a delivery slot that suits you, or collect it yourself for free.";

const VALUES = [
  { icon: Sparkles, title: "Fresh, not frozen", body: "Prepared for your order, in the cuts and portions you choose." },
  { icon: Truck, title: "On your schedule", body: "A 1-hour delivery slot you pick at checkout, or free pickup." },
  { icon: ShieldCheck, title: "Honest and secure", body: "Pay safely online with Paystack; the delivery fee goes to the courier in cash." },
];

const safe = async <T,>(p: Promise<T>, fallback: T) => {
  try {
    return await p;
  } catch {
    return fallback;
  }
};

function Contact({ store }: { store: StoreInfo | null }) {
  const lines = [
    store?.contact_phone && { icon: Phone, label: store.contact_phone, href: `tel:${store.contact_phone}` },
    store?.whatsapp_number && { icon: MessageCircle, label: `WhatsApp ${store.whatsapp_number}`, href: `https://wa.me/${store.whatsapp_number.replace(/\D/g, "").replace(/^0/, "234")}` },
    store?.contact_email && { icon: Mail, label: store.contact_email, href: `mailto:${store.contact_email}` },
    (store?.pickup_address || store?.address) && { icon: MapPin, label: store?.pickup_address || store?.address, href: null },
  ].filter(Boolean) as { icon: typeof Phone; label: string; href: string | null }[];

  if (lines.length === 0) return null;
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">Get in touch</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a]">We&apos;d love to hear from you</h2>
          <p className="mt-3 text-gray-600">Questions about a cut, a bulk order or a delivery? Reach us directly.</p>
          {store?.pickup_instructions && <p className="mt-3 whitespace-pre-line text-sm text-gray-500">{store.pickup_instructions}</p>}
        </div>
        <ul className="space-y-3">
          {lines.map((l) => (
            <li key={l.label}>
              {l.href ? (
                <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-gray-800 transition-colors hover:border-[#3f7a55]/40 hover:bg-[#f4f7f5]">
                  <l.icon className="h-5 w-5 shrink-0 text-[#3f7a55]" /> {l.label}
                </a>
              ) : (
                <p className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-gray-800">
                  <l.icon className="h-5 w-5 shrink-0 text-[#3f7a55]" /> {l.label}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default async function AboutPage() {
  const [store, categories, products, zones] = await Promise.all([
    safe(getStoreInfo(), null),
    safe(getCategories(), []),
    safe(getProducts(), []),
    safe(getDeliveryZones(), []),
  ]);

  const headline = store?.about_headline || DEFAULT_HEADLINE;
  const story = (store?.about_story || DEFAULT_STORY).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const shopCategories = categories
    .map((c) => ({ ...c, count: products.filter((p) => p.category === c.slug).length }))
    .filter((c) => c.count > 0);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Story */}
        <section className="bg-[#FFF8F1]">
          <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">About {store?.store_name ?? "Everything Fresh"}</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-[#1a1a1a] md:text-5xl">{headline}</h1>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-600">
                {story.map((p, i) => (
                  <p key={i} className="whitespace-pre-line">{p}</p>
                ))}
              </div>
              <Link href="/products" className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-[#22c55e] px-6 font-semibold text-white shadow-lg shadow-green-500/25 hover:bg-[#16a34a]">
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-2xl shadow-green-900/10">
              <Image src={meat} alt="Fresh goat meat cuts" fill placeholder="blur" sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
        </section>

        {/* What we stand for */}
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-2xl border border-gray-200 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4f7f5] text-[#3f7a55]"><v.icon className="h-5 w-5" /></span>
                  <h2 className="mt-5 text-lg font-semibold text-gray-900">{v.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* What we sell, from the live catalogue */}
        {shopCategories.length > 0 && (
          <section className="bg-white py-16 md:py-20">
            <div className="container mx-auto px-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">What we sell</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a]">From whole goats to market vegetables</h2>
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {shopCategories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/products?category=${encodeURIComponent(c.slug)}`} className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-5 py-4 transition-colors hover:border-[#3f7a55]/40 hover:bg-[#f4f7f5]">
                      <span>
                        <span className="block font-semibold text-gray-900">{c.name}</span>
                        {c.description && <span className="block text-sm text-gray-500">{c.description}</span>}
                      </span>
                      <span className="shrink-0 text-sm text-gray-400 group-hover:text-[#3f7a55]">{c.count} <ArrowRight className="inline h-4 w-4" /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <DeliveryZonesStrip zones={zones} />
        <Contact store={store} />
      </main>
      <Footer />
    </div>
  );
}
