"use client";

import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-8 rounded-3xl bg-[#F0FFDF] p-8 md:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">
              Get offers and recipes in your inbox
            </h2>
            <p className="mt-3 text-gray-600">
              Exclusive discounts, new product alerts and goat meat recipes. Unsubscribe any time.
            </p>
          </div>
          {/* Not connected to a mailing list yet: submitting does nothing. */}
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-13 w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-[#3f7a55] focus:outline-none focus:ring-2 focus:ring-[#3f7a55]/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#3f7a55] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#2d583d]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
