"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { signOut } = useAuthStore();

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1a1a1a] mb-2">
          Settings
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#FF6B35]">
            Home
          </Link>
          <span>/</span>
          <Link href="/profile" className="hover:text-[#FF6B35]">
            Profile
          </Link>
          <span>/</span>
          <span className="text-gray-900">Settings</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Notifications */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100/50 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Order Updates</Label>
                <p className="text-sm text-gray-500">
                  Receive emails about your order status
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Promotions & Offers
                </Label>
                <p className="text-sm text-gray-500">
                  Receive emails about new products and sales
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Account Actions */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100/50 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Account</h2>

          <div className="space-y-4">
            <Button
              className="w-full justify-start text-gray-600 hover:text-gray-900 h-10 px-0"
              variant="link"
            >
              Change Password
            </Button>

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                className="w-full sm:w-auto gap-2"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
