import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import meat from "@/assets/meat1.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F0FFDF]">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
          {/* Text Content */}
          <div className="flex flex-col space-y-6 lg:space-y-8">
            <p className="flex items-center gap-2 text-sm font-semibold text-green-500">
              <Sparkles className="h-4 w-4 fill-current" /> Fresh Daily Delivery
              in Abuja
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#1a1a1a] md:text-5xl lg:text-6xl font-serif">
              Everything Fresh, Straight to Your Door
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Order fresh vegetables, quality meats, and daily essentials with ease. Flexible portions, reliable delivery, and unbeatable freshness.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/products">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-semibold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg shadow-green-200/50 rounded-xl gap-2 transition-all hover:shadow-xl hover:shadow-green-200/60"
                >
                  Browse Products <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-semibold border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-sm rounded-xl gap-2 transition-all"
                >
                  View All Products <ShoppingBag className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image - Proper Grid Column */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={meat}
              alt="Premium Fresh Goat Meat"
              fill
              className="object-cover"
              priority
            />
            {/* Optional: Subtle overlay for depth */}
            <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
