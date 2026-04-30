"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/core/store/useAuthStore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { authenticateUser, getUserMe } = await import("@/core/api/user/auth");
      
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, full_name: formData.full_name };

      const data = await authenticateUser(payload, isLogin);

      if (!isLogin) {
        toast.success("Account created! Please login.");
        setIsLogin(true);
        return;
      }

      // Fetch user details
      const user = await getUserMe();
      setAuth(data.access_token, user);
      
      toast.success(`Welcome back, ${user.full_name || user.email}!`);
      router.push(redirect);
    } catch (err: any) {
      // The err object here will be an instance of ApiError (e.g., UnauthorizedError)
      // The message is already handled by the global fetchClient throw.
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50/50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to MeatStore" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin 
              ? "Access your orders and profile" 
              : "Quality meat, delivered fresh to your door"}
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              isLogin ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              !isLogin ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="full_name"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="pl-10 border-gray-200 focus-visible:ring-green-500/30 focus-visible:border-green-500"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 border-gray-200 focus-visible:ring-green-500/30 focus-visible:border-green-500"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 border-gray-200 focus-visible:ring-green-500/30 focus-visible:border-green-500"
                  placeholder="password"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3f7a55] hover:bg-[#2d583d] text-white py-6 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-green-500/20"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {isLogin ? "Sign In" : "Register Account"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          By continuing, you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
