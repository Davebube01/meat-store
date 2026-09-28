import { ArrowRight, Clock, CreditCard, Sparkles, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import meat from "@/assets/meat1.jpg";

const trust = [
  { icon: Truck, title: "Delivered across Abuja", sub: "Pick a 1-hour slot" },
  { icon: Sparkles, title: "Prepared fresh daily", sub: "Cut to your choice" },
  { icon: CreditCard, title: "Pay securely", sub: "Card, transfer or USSD" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F0FFDF]">
      <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-4 py-12 md:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <div className="lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#2d583d] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            Fresh goat meat &amp; market produce in Abuja
          </p>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-[#1a1a1a] sm:text-5xl lg:text-6xl">
            Fresh goat meat, <span className="italic text-[#3f7a55]">cut to order</span> and brought to your door
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            Choose your cuts and portions, pick a delivery slot that suits you, and track your order until it arrives.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex h-13 items-center gap-2 rounded-xl bg-[#22c55e] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-green-500/25 transition-colors hover:bg-[#16a34a]"
            >
              Shop now <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition-colors hover:border-gray-300"
            >
              <Clock className="h-5 w-5 text-[#3f7a55]" /> How delivery works
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {trust.map((t) => (
              <li key={t.title} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#3f7a55] shadow-sm">
                  <t.icon className="h-5 w-5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-gray-900">{t.title}</span>
                  <span className="text-xs text-gray-500">{t.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-2xl shadow-green-900/10 lg:aspect-[5/4]">
            <Image src={meat} alt="Fresh goat meat cuts" fill priority placeholder="blur" sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:left-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcfce7] text-[#16a34a]">
              <Clock className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs text-gray-500">Delivery slots</span>
              <span className="text-sm font-semibold text-gray-900">Mon–Sat 8am–7pm · Sun 10am–4pm</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
