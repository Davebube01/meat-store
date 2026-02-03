"use client";

import { Button } from "./ui/button";
import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-3xl p-8 md:p-16 text-center shadow-2xl">
          <h2 className="text-3xl font-bold font-serif tracking-tight text-white md:text-4xl mb-6">
            Get Special Offers & Updates
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive exclusive discounts, new
            product alerts, and delicious goat meat recipes delivered to your
            inbox.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl"
            >
              Subscribe
            </Button>
          </form>

          <p className="mt-6 text-sm text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
