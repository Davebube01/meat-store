"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/core/store/useAuthStore";
import { toast } from "react-toastify";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface SignInModalProps {
  children?: React.ReactNode;
}

export function SignInModal({ children }: SignInModalProps) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { authenticateUser, getUserMe } = await import("@/core/api/user/auth");
      
      const data = await authenticateUser(formData, true);
      
      // Store token FIRST so getAuthHeader() works for the next call
      setAuth(data.access_token, null);

      const user = await getUserMe();
      setAuth(data.access_token, user);
      
      toast.success(`Welcome back, ${user.full_name || user.email}!`);
      setOpen(false);
      setFormData({ email: "", password: "" });
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Sign In</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 h-12"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 h-12"
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
          <Button type="submit" disabled={loading} className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-bold">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-2">
            Don't have an account?{" "}
            <a href="/login?redirect=/checkout" className="text-green-700 font-bold hover:underline">
              Register here
            </a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
