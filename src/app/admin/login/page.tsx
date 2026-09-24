"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/core/store/useAdminAuthStore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2, Lock, Eye, EyeOff } from "lucide-react";

import { API_BASE_URL } from "@/core/api/client";

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

      toast.success("Welcome back, Admin!");
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl border border-gray-200 shadow-xl">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/30 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Access the MeatStore Management Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="admin@meatstore.com"
                className="border-gray-200 focus-visible:ring-green-500/30 focus-visible:border-green-500 h-12"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="password"
                  className="border-gray-200 focus-visible:ring-green-500/30 focus-visible:border-green-500  h-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-2 border-none cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4 text-gray-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3f7a55] hover:bg-[#2d583d] text-white py-6 text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/20"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign in to Dashboard"
            )}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-sm text-gray-400">
        Secure Area. Authorized access only.
      </p>
    </div>
  );
}
