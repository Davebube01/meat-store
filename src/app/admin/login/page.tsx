"use client";

import { adminLandingPath } from "@/core/constants/routes";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/core/store/useAdminAuthStore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2, Eye, EyeOff, PackageSearch, BellRing, Users } from "lucide-react";

const FEATURES = [
  { icon: PackageSearch, text: "Track every order from checkout to delivery" },
  { icon: BellRing, text: "Get notified the moment stock runs low" },
  { icon: Users, text: "Give staff exactly the access they need" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAdminAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { authenticateAdmin, getAdminMe } =
        await import("@/core/api/admin");

      const data = await authenticateAdmin(formData);

      // Token first, so the /me call below is authenticated.
      setAuth(data.access_token, null);

      // Now fetch user details (token is available in the store)
      const user = await getAdminMe();
      setAuth(data.access_token, user);

      toast.success(`Welcome back${user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}!`);
      router.push(adminLandingPath(user?.permissions));
    } catch (err: any) {
      toast.error(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Brand panel — desktop only */}
      <div className="relative hidden overflow-hidden bg-linear-to-br from-[#3f7a55] to-[#1c3f28] lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-[#22c55e]/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
            <Store className="h-6 w-6 text-white" />
          </div>
          <span className="font-serif text-xl font-semibold text-white">Everything Fresh</span>
        </div>

        <div className="relative">
          <h2 className="font-serif text-4xl font-semibold leading-tight text-white">
            Run your store
            <br />
            from anywhere.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-green-50/80">
            Orders, stock and staff — all in one place, with alerts the moment something needs you.
          </p>

          <ul className="mt-10 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Icon className="h-4 w-4 text-white" />
                </span>
                <span className="text-sm text-green-50/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-green-50/50">&copy; {new Date().getFullYear()} Everything Fresh</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          {/* Mobile-only brand mark */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-green-500 to-green-700 shadow-lg shadow-green-500/30">
              <Store className="h-7 w-7 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-gray-900">Everything Fresh</h1>
            <p className="text-sm text-gray-500">Admin Portal</p>
          </div>

          <div className="mb-8 hidden lg:block">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-500">Sign in to manage orders, stock and sales.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="admin@yourstore.com"
                className="h-12 border-gray-200 focus-visible:border-green-500 focus-visible:ring-green-500/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Password"
                  className="h-12 border-gray-200 pr-11 focus-visible:border-green-500 focus-visible:ring-green-500/30"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#3f7a55] text-base font-semibold shadow-lg shadow-green-900/10 transition-all hover:bg-[#2d583d] hover:shadow-green-900/20"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in to Dashboard"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">Secure area. Authorized access only.</p>
        </div>
      </div>
    </div>
  );
}
