import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDeliveryZones } from "@/core/api/user/delivery";
import { getFaqs } from "@/core/api/user/faq";
import { FaqBrowser } from "./FaqBrowser";

export const metadata = {
  title: "FAQ | Everything Fresh",
  description: "Answers about ordering, delivery slots and fees, payment and your account.",
};

const safe = async <T,>(p: Promise<T>, fallback: T) => {
  try {
    return await p;
  } catch {
    return fallback;
  }
};

export default async function FaqPage() {
  const [faqs, zones] = await Promise.all([safe(getFaqs(), null), safe(getDeliveryZones(), [])]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="bg-[#FFF8F1] pb-10">
          <div className="container mx-auto px-4 pt-10 md:pt-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">Help</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">Frequently asked questions</h1>
            <p className="mt-2 max-w-xl text-gray-600">How ordering, delivery and payment work. Can&apos;t find your answer? <Link href="/contact" className="font-semibold text-[#3f7a55] hover:underline">Ask us</Link>.</p>
          </div>
        </section>

        <div>
          <div className="container mx-auto px-4 pb-16">
            {faqs && faqs.length > 0 ? (
              <FaqBrowser faqs={faqs} zones={zones} />
            ) : (
              <p className="mt-8 rounded-2xl bg-[#f4f7f5] p-6 text-gray-600">
                We couldn&apos;t load the questions just now. Please try again in a moment, or <Link href="/contact" className="font-semibold text-[#3f7a55] hover:underline">contact us</Link>.
              </p>
            )}
          </div>
        </div>

        <section className="bg-[#f4f7f5] py-12">
          <div className="container mx-auto flex flex-col items-start gap-5 px-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#3f7a55] shadow-sm"><MessageCircle className="h-6 w-6" /></span>
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#1a1a1a]">Still have a question?</h2>
                <p className="text-sm text-gray-600">Send us a message and we&apos;ll get back to you.</p>
              </div>
            </div>
            <Link href="/contact" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#3f7a55] px-5 font-semibold text-white hover:bg-[#2d583d]">
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
