"use client";

import { ProfileForm } from "@/components/ProfileForm";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1a1a1a] mb-2">
          My Account
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#22c55e]">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">Profile</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Profile Information
          </h2>
        </div>

        <ProfileForm />
      </div>
    </>
  );
}
