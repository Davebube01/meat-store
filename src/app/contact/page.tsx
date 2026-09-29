import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getFaqs } from "@/core/api/user/faq";
import { getStoreInfo } from "@/core/api/user/store";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact us | Everything Fresh",
  description: "Questions about an order, delivery or a bulk order? Get in touch.",
};

const safe = async <T,>(p: Promise<T>, fallback: T) => {
  try {
    return await p;
  } catch {
    return fallback;
  }
};

export default async function ContactPage() {
  const [store, allFaqs] = await Promise.all([safe(getStoreInfo(), null), safe(getFaqs(), null)]);

  const channels = [
    store?.contact_phone && { icon: Phone, title: "Call us", value: store.contact_phone, href: `tel:${store.contact_phone}` },
    store?.whatsapp_number && {
      icon: MessageCircle,
      title: "WhatsApp",
      value: store.whatsapp_number,
      href: `https://wa.me/${store.whatsapp_number.replace(/\D/g, "").replace(/^0/, "234")}`,
    },
    store?.contact_email && { icon: Mail, title: "Email", value: store.contact_email, href: `mailto:${store.contact_email}` },
  ].filter(Boolean) as { icon: typeof Phone; title: string; value: string; href: string }[];
  const place = store?.pickup_address || store?.address;

  // The first few from the FAQ page, most asked first (delivery, then ordering).
  const faqs = [...(allFaqs ?? [])]
    .sort((a, b) => Number(b.section === "delivery") - Number(a.section === "delivery"))
    .slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="border-b border-[#f0e6da] bg-[#FFF8F1]">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">Contact</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">How can we help?</h1>
            <p className="mt-2 max-w-xl text-gray-600">
              Questions about an order, a delivery or a bulk order for an event? Send us a message
              {channels.length ? " or reach us directly." : "."} Checking on an order?{" "}
              <Link href="/order-tracking" className="font-semibold text-[#3f7a55] hover:underline">Track it here</Link>.
            </p>
          </div>
        </section>

        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <ContactForm />

          <aside className="space-y-4">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#3f7a55]/40 hover:bg-[#f4f7f5]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f4f7f5] text-[#3f7a55]"><c.icon className="h-5 w-5" /></span>
                <span className="min-w-0">
                  <span className="block text-sm text-gray-500">{c.title}</span>
                  <span className="block truncate font-semibold text-gray-900">{c.value}</span>
                </span>
              </a>
            ))}
            {place && (
              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f4f7f5] text-[#3f7a55]"><MapPin className="h-5 w-5" /></span>
                <span>
                  <span className="block text-sm text-gray-500">Visit or collect</span>
                  <span className="block font-semibold text-gray-900">{place}</span>
                  {store?.pickup_instructions && <span className="mt-1 block whitespace-pre-line text-sm text-gray-500">{store.pickup_instructions}</span>}
                </span>
              </div>
            )}
            {!channels.length && !place && (
              <p className="rounded-2xl bg-[#f4f7f5] p-4 text-sm text-gray-600">Send us a message and we&apos;ll reply by email.</p>
            )}
          </aside>
        </div>

        {faqs.length > 0 && (
        <section className="bg-[#f7f8f7] py-12 md:py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] md:text-3xl">Common questions</h2>
              <Link href="/faq" className="shrink-0 text-sm font-semibold text-[#3f7a55] hover:underline">See all questions</Link>
            </div>
            <div className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
              {faqs.map((f) => (
                <details key={f.question} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900">
                    {f.question}
                    <span className="text-xl leading-none text-gray-400 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
