import Image from "next/image";
import Link from "next/link";
import { ChefHat, Clock, Package, ShieldCheck } from "lucide-react";
import meat from "@/assets/meat2.jpg";

const PERKS = [
  { icon: Clock, text: "Check out faster with your details and addresses saved" },
  { icon: Package, text: "Track every order and buy again in one tap" },
  { icon: ShieldCheck, text: "Pay securely with Paystack, or cash on delivery" },
];

/** Split-screen frame for sign in, register and password pages. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Brand panel (large screens) */}
      <aside className="relative hidden overflow-hidden bg-[#1f3a2a] lg:block">
        <Image src={meat} alt="" fill priority placeholder="blur" sizes="50vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f3a2a] via-[#1f3a2a]/70 to-[#1f3a2a]/30" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22c55e]"><ChefHat className="h-5 w-5" /></span>
            <span className="leading-none">
              <span className="block text-[11px] font-semibold text-[#86efac]">Everything</span>
              <span className="font-serif text-xl font-semibold">Fresh</span>
            </span>
          </Link>
          <div>
            <p className="max-w-md font-serif text-4xl font-semibold leading-tight">Fresh goat meat, cut to order and brought to your door.</p>
            <ul className="mt-8 space-y-4">
              {PERKS.map((p) => (
                <li key={p.text} className="flex items-center gap-3 text-[#dcebe1]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10"><p.icon className="h-4 w-4" /></span>
                  {p.text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-[#a9bfb1]">Delivering across Abuja.</p>
        </div>
      </aside>

      {/* Form */}
      <main className="flex flex-col px-4 py-8 sm:px-8">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3f7a55] text-white"><ChefHat className="h-5 w-5" /></span>
          <span className="leading-none">
            <span className="block text-[11px] font-semibold text-[#22c55e]">Everything</span>
            <span className="font-serif text-lg font-semibold text-[#2d583d]">Fresh</span>
          </span>
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a]">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
        <p className="mx-auto mt-10 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-700">Back to the shop</Link>
        </p>
      </main>
    </div>
  );
}
