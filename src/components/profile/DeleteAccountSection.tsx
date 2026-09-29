"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMyAccount } from "@/core/api/user/account";
import { getOrderSummary } from "@/core/api/user/orders";
import { useAuthStore } from "@/core/store/useAuthStore";
import { useCheckoutStore } from "@/core/store/useCheckoutStore";
import { useOrderStore } from "@/core/store/useOrderStore";

const WHAT_HAPPENS = [
  "Your name, email, phone number and saved addresses are removed straight away.",
  "You're signed out on every device.",
  "We keep a record of past orders, without your details, because the law requires sales records.",
  "This can't be undone. You can still order as a guest or sign up again later.",
];

export function DeleteAccountSection() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Warn up front instead of after they've typed their password.
  const summary = useQuery({ queryKey: ["order-summary"], queryFn: getOrderSummary, enabled: open });
  const ongoing = summary.data?.ongoing ?? 0;

  const close = (next: boolean) => {
    if (busy) return;
    setOpen(next);
    if (!next) {
      setPassword("");
      setConfirmed(false);
      setError(null);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmed || busy) return;
    setBusy(true);
    setError(null);
    try {
      await deleteMyAccount(password);
      // Their details are also saved in this browser: clear those too.
      useAuthStore.getState().signOut();
      useCheckoutStore.getState().clearCheckout();
      useOrderStore.getState().clearOrders();
      toast.success("Your account has been deleted.");
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete your account. Please try again.");
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-red-200 bg-white p-5 md:p-6">
      <h2 className="font-semibold text-gray-900">Delete account</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Trash2 className="h-5 w-5 shrink-0 text-red-500" />
        <p className="flex-1 text-sm text-gray-600">
          Permanently delete your account and personal details. See what we keep in our{" "}
          <Link href="/privacy" className="font-medium text-[#3f7a55] hover:underline">privacy policy</Link>.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 shrink-0 items-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
        >
          Delete account
        </button>
      </div>

      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>Here&apos;s what happens:</DialogDescription>
            </DialogHeader>

            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {WHAT_HAPPENS.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {line}
                </li>
              ))}
            </ul>

            {ongoing > 0 ? (
              <div className="mt-5 flex gap-2.5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  You have {ongoing === 1 ? "an order" : `${ongoing} orders`} in progress. You can delete your account once{" "}
                  {ongoing === 1 ? "it's" : "they've been"} delivered or cancelled.{" "}
                  <Link href="/orders" className="font-semibold underline underline-offset-2">See my orders</Link>
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="delete-password">Enter your password to confirm</Label>
                  <div className="relative">
                    <Input
                      id="delete-password"
                      type={show ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      aria-label={show ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Forgotten it? <Link href="/forgot-password" className="font-medium text-[#3f7a55] hover:underline">Reset your password</Link> first.
                  </p>
                </div>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 accent-red-600"
                  />
                  I understand this can&apos;t be undone.
                </label>
                {error && (
                  <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                  </p>
                )}
              </div>
            )}

            <DialogFooter className="mt-6 gap-2">
              <button
                type="button"
                onClick={() => close(false)}
                disabled={busy}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Keep my account
              </button>
              {ongoing === 0 && (
                <button
                  type="submit"
                  disabled={!password || !confirmed || busy || summary.isPending}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />} Delete my account
                </button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
