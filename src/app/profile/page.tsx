"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BadgeCheck, Loader2, MailWarning } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/core/store/useAuthStore";
import { updateMyProfile } from "@/core/api/user/account";
import { resendVerificationEmail } from "@/core/api/user/auth";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)!;
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [fullName, setFullName] = useState(user.full_name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [error, setError] = useState<string | null>(null);

  const dirty = fullName.trim() !== (user.full_name ?? "") || phone.trim() !== (user.phone ?? "");

  const save = useMutation({
    mutationFn: () => updateMyProfile({ full_name: fullName.trim(), phone: phone.trim() || null }),
    onMutate: () => setError(null),
    onSuccess: (saved) => {
      updateProfile({ full_name: saved.full_name ?? undefined, phone: saved.phone ?? undefined });
      setFullName(saved.full_name ?? "");
      setPhone(saved.phone ?? "");
      toast.success("Profile saved");
    },
    onError: (err: Error) => setError(err.message),
  });

  const resend = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (r) => toast.success(r?.already_verified ? "Your email is already verified." : "Verification email sent. Check your inbox."),
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <>
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a]">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Used on your orders and by the courier to reach you.</p>
      </div>

      {!user.email_verified && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <MailWarning className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="flex-1 text-sm text-amber-900">Please verify your email address so we can send receipts and order updates.</p>
          <button
            type="button"
            onClick={() => resend.mutate()}
            disabled={resend.isPending}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-60"
          >
            {resend.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Resend email
          </button>
        </div>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (dirty && fullName.trim().length >= 2 && !save.isPending) save.mutate();
        }}
        className="rounded-2xl border border-gray-200 bg-white"
      >
        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input id="full-name" autoComplete="name" value={fullName} maxLength={100} onChange={(e) => setFullName(e.target.value)} />
            {fullName.trim().length > 0 && fullName.trim().length < 2 && <p className="text-xs text-red-600">Enter your full name</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} placeholder="0803 000 0000" onChange={(e) => setPhone(e.target.value)} />
            <p className="text-xs text-gray-500">A Nigerian mobile number. We share it with your courier only.</p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
              <span id="email" className="truncate">{user.email}</span>
              {user.email_verified ? (
                <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#3f7a55]"><BadgeCheck className="h-3.5 w-3.5" /> Verified</span>
              ) : (
                <span className="ml-auto shrink-0 text-xs font-semibold text-amber-700">Not verified</span>
              )}
            </div>
            <p className="text-xs text-gray-500">Your email is your sign-in, so it can&apos;t be changed here.</p>
          </div>
        </div>
        {error && <p className="mx-5 mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 md:mx-6">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4 md:px-6">
          {dirty && (
            <button
              type="button"
              onClick={() => {
                setFullName(user.full_name ?? "");
                setPhone(user.phone ?? "");
                setError(null);
              }}
              className="h-10 rounded-lg px-4 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Discard
            </button>
          )}
          <button
            type="submit"
            disabled={!dirty || fullName.trim().length < 2 || save.isPending}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#3f7a55] px-5 text-sm font-semibold text-white hover:bg-[#2d583d] disabled:bg-gray-300"
          >
            {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </button>
        </div>
      </form>
    </>
  );
}
