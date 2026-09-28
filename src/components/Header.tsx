"use client";

import { ChefHat, LogOut, User } from "lucide-react";
import Link from "next/link";
import { CartSheet } from "./CartSheet";
import { useAuthStore } from "@/core/store/useAuthStore";
import { logout } from "@/core/auth/logout";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";
import { SignInModal } from "./SignInModal";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { useState } from "react";

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // One place for orders: your order history when signed in, the guest
  // lookup (order number + email) when not.
  const ordersLink = isAuthenticated
    ? { href: "/orders", label: "My orders" }
    : { href: "/order-tracking", label: "Track order" };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <EmailVerificationBanner />
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="font-serif font-semibold text-xl text-[#1a1a1a] text-left">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="text-lg font-medium hover:text-[#3f7a55] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-lg font-medium hover:text-[#3f7a55] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href={ordersLink.href}
                  className="text-lg font-medium hover:text-[#3f7a55] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {ordersLink.label}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-700 text-white">
              <ChefHat className="h-6 w-6" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-medium text-green-500">Everything</span>
              <span className="text-xl font-bold text-green-700">Fresh</span>
              
            </div>
          </Link>
        </div>

        {/* Navigation & Cart */}
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <Link
              href={ordersLink.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {ordersLink.label}
            </Link>
          </nav>

          <CartSheet />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full bg-green-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full  text-green-700 font-medium">
                    {user.full_name?.slice(0, 2).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.full_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="cursor-pointer w-full flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignInModal>
              <Button size="sm" className="bg-green-700 hover:bg-green-700/90">
                Sign In
              </Button>
            </SignInModal>
          )}
        </div>
      </div>
    </header>
  );
}
