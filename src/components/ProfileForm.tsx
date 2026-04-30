"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/core/store/useAuthStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function ProfileForm() {
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");

    // Simulate API delay
    setTimeout(() => {
      updateProfile(formData);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    }, 800);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-green-100/50"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
            className="rounded-xl border-gray-200 focus:border-[#22c55e] focus:ring-[#22c55e]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            disabled
            className="bg-gray-50 rounded-xl border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+234..."
            className="rounded-xl border-gray-200 focus:border-[#22c55e] focus:ring-[#22c55e]"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Delivery Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Street Name, Area, City"
            className="rounded-xl border-gray-200 focus:border-[#22c55e] focus:ring-[#22c55e]"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Bio / Delivery Notes</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Any specific instructions for delivery..."
            className="min-h-[100px] rounded-xl border-gray-200 focus:border-[#22c55e] focus:ring-[#22c55e]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={status === "saving"}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-green-200/50 transition-all min-w-[140px]"
        >
          {status === "saving"
            ? "Saving..."
            : status === "success"
              ? "Saved!"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
