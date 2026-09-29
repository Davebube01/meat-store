"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Mail, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { requestPasswordReset } from "@/core/api/user/account";
import { isValidEmail } from "@/lib/authValidation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [tried, setTried] = useState(false);
  const valid = isValidEmail(email);

  const send = useMutation({ mutationFn: () => requestPasswordReset(email.trim().toLowerCase()) });

  if (send.isSuccess) {
    return (
      <AuthShell title="Check your email">
        <div className="rounded-2xl border border-gray-200 p-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f7f5] text-[#3f7a55]"><MailCheck className="h-7 w-7" /></span>
          <p className="mt-4 text-gray-700">
            If <b>{email.trim()}</b> has an account with us, we&apos;ve sent it a link to choose a new password. It works once and expires in an hour.
          </p>
          <p className="mt-3 text-sm text-gray-500">Nothing arrived? Check spam, or try again in a few minutes.</p>
          <button type="button" onClick={() => send.reset()} className="mt-5 text-sm font-semibold text-[#3f7a55] hover:underline">
            Use a different email
          </button>
        </div>
        <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Forgot your password?" subtitle="Enter the email you signed up with and we'll send you a link to reset it.">
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
          if (valid && !send.isPending) send.mutate();
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input id="forgot-email" type="email" autoComplete="email" autoFocus value={email} placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} aria-invalid={tried && !valid} className="h-12 rounded-xl pl-10" />
          </div>
          {tried && !valid && <p className="text-xs text-red-600">Enter a valid email address</p>}
        </div>
        {send.isError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {(send.error as { status?: number }).status === 429 ? "Too many requests. Please wait a while and try again." : "Something went wrong. Please try again."}
          </p>
        )}
        <button type="submit" disabled={send.isPending} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3f7a55] font-semibold text-white hover:bg-[#2d583d] disabled:opacity-60">
          {send.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link
        </button>
      </form>
      <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </AuthShell>
  );
}
