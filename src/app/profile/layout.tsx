"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck, Loader2, LogOut, MapPin, Package, ShieldCheck, UserRound } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SignInModal } from "@/components/SignInModal";
import { useAuthStore } from "@/core/store/useAuthStore";
import { logout } from "@/core/auth/logout";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/orders", label: "My orders", icon: Package },
  { href: "/profile/addresses", label: "Addresses", icon: MapPin },
  { href: "/profile/settings", label: "Sign-in & security", icon: ShieldCheck },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // The session is read from storage on load; don't flash "sign in" before that.
  const ready = useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f7]">
      <Header />
      <main className="flex-1">
        {!ready ? (
          <div className="flex justify-center p-24 text-gray-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : !isAuthenticated || !user ? (
          <div className="container mx-auto max-w-md px-4 py-20 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f7f5] text-[#3f7a55]"><UserRound className="h-7 w-7" /></span>
            <h1 className="mt-4 font-serif text-2xl font-semibold text-gray-900">Sign in to your account</h1>
            <p className="mt-2 text-gray-500">Manage your details, saved addresses and orders.</p>
            <SignInModal>
              <button type="button" className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#3f7a55] px-6 font-semibold text-white hover:bg-[#2d583d]">Sign in</button>
            </SignInModal>
            <p className="mt-4 text-sm text-gray-500">
              Ordered as a guest? <Link href="/order-tracking" className="font-semibold text-[#3f7a55] hover:underline">Track your order</Link>
            </p>
          </div>
        ) : (
          <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:py-10">
            <aside className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dcebe1] text-base font-semibold text-[#2d583d]">
                  {(user.full_name || user.email).split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">{user.full_name || "Your account"}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-gray-500">
                    {user.email}
                    {user.email_verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#3f7a55]" aria-label="Email verified" />}
                  </p>
                </div>
              </div>

              <nav aria-label="Account" className="flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 lg:flex-col">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active ? "bg-[#f4f7f5] text-[#2d583d]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      )}
                    >
                      <item.icon className="h-4 w-4" /> {item.label}
                    </Link>
                  );
                })}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 lg:mt-1 lg:border-t lg:border-gray-100 lg:pt-3"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </nav>
            </aside>

            <div className="min-w-0 space-y-6">{children}</div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
