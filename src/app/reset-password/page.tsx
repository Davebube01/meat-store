"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { resetPassword } from "@/core/api/user/account";
import { MIN_PASSWORD_LENGTH, getPasswordStrength } from "@/lib/authValidation";
import { cn } from "@/lib/utils";

const STRENGTH_COLORS = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-green-600"];

function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [tried, setTried] = useState(false);
  const strength = getPasswordStrength(password);

  const problem =
    password.length < MIN_PASSWORD_LENGTH ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : confirm !== password ? "The two passwords don't match." : null;

  const save = useMutation({ mutationFn: () => resetPassword(token, password) });

  if (!token) {
    return (
      <AuthShell title="This link isn't complete" subtitle="Open the link from your email again, or ask for a new one.">
        <Link href="/forgot-password" className="inline-flex h-12 items-center rounded-xl bg-[#3f7a55] px-6 font-semibold text-white hover:bg-[#2d583d]">Get a new link</Link>
      </AuthShell>
    );
  }

  if (save.isSuccess) {
    return (
      <AuthShell title="Password changed">
        <div className="rounded-2xl border border-gray-200 p-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#22c55e]" />
          <p className="mt-4 text-gray-700">You can sign in with your new password now. For your security, we signed you out on all your devices.</p>
          <Link href="/login" className="mt-6 inline-flex h-12 items-center rounded-xl bg-[#3f7a55] px-6 font-semibold text-white hover:bg-[#2d583d]">Sign in</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password" subtitle="Pick something you don't use anywhere else.">
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
          if (!problem && !save.isPending) save.mutate();
        }}
      >
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="new-password">New password</Label>
            <button type="button" onClick={() => setShow((s) => !s)} className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900">
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />} {show ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input id="new-password" type={show ? "text" : "password"} autoComplete="new-password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl pl-10" />
          </div>
          {password && (
            <div aria-live="polite">
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={cn("h-1.5 flex-1 rounded-full", strength.score >= i ? STRENGTH_COLORS[strength.score] : "bg-gray-200")} />
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500"><span className="font-medium">{strength.label}</span>{strength.tips[0] && <> · {strength.tips[0]}</>}</p>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input id="confirm-password" type={show ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-12 rounded-xl pl-10" />
          </div>
        </div>
        {tried && problem && <p className="text-xs text-red-600">{problem}</p>}
        {save.isError && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {(save.error as Error).message}{" "}
            <Link href="/forgot-password" className="font-semibold underline underline-offset-2">Get a new link</Link>
          </div>
        )}
        <button type="submit" disabled={save.isPending} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3f7a55] font-semibold text-white hover:bg-[#2d583d] disabled:opacity-60">
          {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save new password
        </button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>}>
      <ResetForm />
    </Suspense>
  );
}
