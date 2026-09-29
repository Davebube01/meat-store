"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2, LogOut, MonitorSmartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeMyPassword, signOutOtherSessions } from "@/core/api/user/account";
import { logout } from "@/core/auth/logout";
import { DeleteAccountSection } from "@/components/profile/DeleteAccountSection";

const MIN = 8;

export default function SecurityPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const problems =
    next && next.length < MIN ? `Use at least ${MIN} characters.` : confirm && confirm !== next ? "The two new passwords don't match." : null;
  const canSave = current && next.length >= MIN && next === confirm;

  const change = useMutation({
    mutationFn: () => changeMyPassword(current, next),
    onMutate: () => setError(null),
    onSuccess: (r) => {
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success(
        r.other_sessions_ended
          ? `Password changed. Signed out of ${r.other_sessions_ended} other device${r.other_sessions_ended === 1 ? "" : "s"}.`
          : "Password changed.",
      );
    },
    onError: (err: Error) => setError(err.message),
  });

  const others = useMutation({
    mutationFn: signOutOtherSessions,
    onSuccess: (r) =>
      toast.success(r.other_sessions_ended ? `Signed out of ${r.other_sessions_ended} other device${r.other_sessions_ended === 1 ? "" : "s"}.` : "You weren't signed in anywhere else."),
    onError: (err: Error) => toast.error(err.message),
  });

  const field = (id: string, label: string, value: string, set: (v: string) => void, autoComplete: string) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={show ? "text" : "password"} autoComplete={autoComplete} value={value} onChange={(e) => set(e.target.value)} />
    </div>
  );

  return (
    <>
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a]">Sign-in &amp; security</h1>
        <p className="mt-1 text-sm text-gray-500">Change your password and manage where you&apos;re signed in.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSave && !change.isPending) change.mutate();
        }}
        className="rounded-2xl border border-gray-200 bg-white"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 md:px-6">
          <h2 className="font-semibold text-gray-900">Change password</h2>
          <button type="button" onClick={() => setShow((s) => !s)} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900">
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />} {show ? "Hide" : "Show"}
          </button>
        </div>
        <div className="grid gap-4 p-5 md:max-w-md md:p-6">
          {field("current-password", "Current password", current, setCurrent, "current-password")}
          {field("new-password", "New password", next, setNext, "new-password")}
          {field("confirm-password", "Confirm new password", confirm, setConfirm, "new-password")}
          {problems ? <p className="text-xs text-red-600">{problems}</p> : <p className="text-xs text-gray-500">At least {MIN} characters. You&apos;ll stay signed in here; other devices will be signed out.</p>}
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>
        <div className="flex justify-end border-t border-gray-100 px-5 py-4 md:px-6">
          <button type="submit" disabled={!canSave || change.isPending} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#3f7a55] px-5 text-sm font-semibold text-white hover:bg-[#2d583d] disabled:bg-gray-300">
            {change.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Change password
          </button>
        </div>
      </form>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <h2 className="font-semibold text-gray-900">Where you&apos;re signed in</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <MonitorSmartphone className="h-5 w-5 shrink-0 text-[#3f7a55]" />
          <p className="flex-1 text-sm text-gray-600">Lost a phone or used a shared computer? Sign out everywhere except here.</p>
          <button
            type="button"
            onClick={() => others.mutate()}
            disabled={others.isPending}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {others.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Sign out other devices
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
          <LogOut className="h-5 w-5 shrink-0 text-red-500" />
          <p className="flex-1 text-sm text-gray-600">Sign out of this device.</p>
          <button type="button" onClick={() => logout()} className="inline-flex h-10 shrink-0 items-center rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50">
            Sign out
          </button>
        </div>
      </section>

      <DeleteAccountSection />
    </>
  );
}
