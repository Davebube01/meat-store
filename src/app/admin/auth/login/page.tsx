"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For now, allow any login and redirect to dashboard
    router.push("/admin/dashboard");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-serif text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500">
              Please enter your details to access the admin dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@meatstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#FF6B35] hover:bg-[#E85A2A] text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-500">
            <p>Protected area. Authorized personnel only.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block relative bg-[#FF6B35]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=2568&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B35] to-transparent opacity-90"></div>

        <div className="relative h-full flex flex-col justify-between p-24 text-white">
          <div className="space-y-2">
            <div className="h-8 w-8 bg-white rounded-full opacity-20 mb-4"></div>
            <h2 className="text-4xl font-serif font-bold">The Meat Store</h2>
            <p className="text-orange-100 text-lg max-w-md">
              Premium quality meat, delivered fresh to our customers. Manage
              your inventory and orders with ease.
            </p>
          </div>

          <div className="flex items-center gap-4 text-orange-100 text-sm">
            <span>© 2026 Meat Store</span>
            <div className="h-1 w-1 rounded-full bg-orange-200"></div>
            <span>Admin Panel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
