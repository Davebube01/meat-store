import Link from "next/link";
import { ChefHat } from "lucide-react";

const shop = [
  { label: "All products", href: "/products" },
  { label: "Goat Meat", href: "/products?category=goat-meat" },
  { label: "Goat Parts", href: "/products?category=goat-parts" },
  { label: "Bundles", href: "/products?category=bundles" },
  { label: "Vegetables", href: "/products?category=vegetables" },
];

const help = [
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Track an order", href: "/order-tracking" },
  { label: "My orders", href: "/orders" },
  { label: "How delivery works", href: "/#how-it-works" },
  { label: "Delivery zones & fees", href: "/#delivery" },
];

export function Footer() {
  return (
    <footer className="bg-[#1f3a2a] text-[#c9d8ce]">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22c55e] text-white">
                <ChefHat className="h-5 w-5" />
              </span>
              <span className="leading-none">
                <span className="block text-[11px] font-semibold text-[#86efac]">Everything</span>
                <span className="font-serif text-xl font-semibold text-white">Fresh</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#a9bfb1]">
              Fresh goat meat and market produce, prepared daily and delivered across Abuja.
            </p>
          </div>
          <nav aria-label="Shop">
            <h2 className="mb-4 text-sm font-semibold text-white">Shop</h2>
            <ul className="space-y-2.5 text-sm">
              {shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Help">
            <h2 className="mb-4 text-sm font-semibold text-white">Help</h2>
            <ul className="space-y-2.5 text-sm">
              {help.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#8aa595] sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Everything Fresh. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <span>Payments secured by Paystack</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
