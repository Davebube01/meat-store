"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuthStore();
  const pathname = usePathname();

  const sidebarItems = [
    {
      icon: User,
      label: "Profile Information",
      href: "/profile",
      active: pathname === "/profile",
    },
    {
      icon: ShoppingBag,
      label: "Order History",
      href: "/profile/orders",
      active: pathname === "/profile/orders",
    },
    {
      icon: MapPin,
      label: "Saved Addresses",
      href: "/profile/addresses",
      active: pathname === "/profile/addresses",
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      href: "/profile/payment",
      active: pathname === "/profile/payment",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/profile/settings",
      active: pathname === "/profile/settings",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF8F1] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Please Sign In</h1>
            <p className="text-gray-500">
              You need to be signed in to view your profile.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-80 space-y-6">
              {/* User Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100/50 flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center text-3xl font-bold text-amber-900 mb-4">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="bg-white rounded-3xl p-4 shadow-sm border border-orange-100/50 space-y-1">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm",
                      item.active
                        ? "bg-orange-50 text-[#FF6B35]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}

                <div className="pt-2 mt-2 border-t border-gray-100">
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </button>
                </div>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
