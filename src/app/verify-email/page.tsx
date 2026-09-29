"use client";

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Mail, MailCheck, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { getUserMe, resendVerificationEmail, verifyEmailToken } from "@/core/api/user/auth";
import { resendVerificationByEmail } from "@/core/api/user/account";
import { useAuthStore } from "@/core/store/useAuthStore";
import { isValidEmail } from "@/lib/authValidation";

type Result = { status: "checking" } | { status: "done"; claimed: number } | { status: "failed"; message: string };

const primary = "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#3f7a55] px-6 font-semibold text-white hover:bg-[#2d583d] disabled:opacity-60";

/** Ask for a new link: one tap when signed in, by email when not. */
function ResendLink({ signedInEmail }: { signedInEmail?: string }) {
  const [email, setEmail] = useState("");
  const [tried, setTried] = useState(false);
  const send = useMutation({
    mutationFn: async (): Promise<void> => {
      if (signedInEmail) await resendVerificationEmail();
      else await resendVerificationByEmail(email.trim().toLowerCase());
    },
  });

  if (send.isSuccess) {
    return (
      <p className="flex items-start gap-2 rounded-xl bg-[#f4f7f5] px-4 py-3 text-sm text-gray-700">
        <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#3f7a55]" />
        {signedInEmail
          ? `New link sent to ${signedInEmail}. It's valid for 48 hours.`
          : "If that email has an account waiting to be confirmed, we've sent it a new link."}
      </p>
    );
  }

  const error = send.isError
    ? (send.error as { status?: number }).status === 429
      ? "You've asked for a lot of emails. Please try again later."
      : "Couldn't send the email. Please try again."
    : null;

  if (signedInEmail) {
    return (
      <div className="space-y-2">
        <button type="button" onClick={() => send.mutate()} disabled={send.isPending} className={primary}>
          {send.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Send a new link
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (isValidEmail(email) && !send.isPending) send.mutate();
      }}
    >
      <Label htmlFor="resend-email">Email you signed up with</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input id="resend-email" type="email" autoComplete="email" value={email} placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl pl-10" />
      </div>
      {tried && !isValidEmail(email) && <p className="text-xs text-red-600">Enter a valid email address</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={send.isPending} className={`${primary} w-full`}>
        {send.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Send a new link
      </button>
    </form>
  );
}

function VerifyEmail() {
  const token = useSearchParams().get("token");
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const ready = useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
  const [result, setResult] = useState<Result>({ status: "checking" });
  // React strict mode runs effects twice in dev; one request is enough.
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    verifyEmailToken(token)
      .then(async (r) => {
        // Whoever is signed in on this browser may not be the account the link
        // was for, so ask the server rather than assuming.
        if (useAuthStore.getState().isAuthenticated) {
          try {
            const me = await getUserMe();
            updateProfile({ email_verified: me.email_verified });
          } catch {
            // Not signed in after all: nothing to update.
          }
        }
        setResult({ status: "done", claimed: r.claimed_orders });
      })
      .catch((err: Error) => setResult({ status: "failed", message: err.message || "This link is invalid or has expired." }));
  }, [token, updateProfile]);

  const signedInEmail = ready && isAuthenticated && user && !user.email_verified ? user.email : undefined;

  // Opened without a link, e.g. from the banner or straight after signing up.
  if (!token) {
    if (!ready) return <AuthShell title="Confirm your email"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></AuthShell>;
    if (isAuthenticated && user?.email_verified) {
      return (
        <AuthShell title="Your email is confirmed" subtitle={`${user.email} is all set.`}>
          <Link href="/products" className={primary}>Start shopping</Link>
        </AuthShell>
      );
    }
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={signedInEmail ? <>We sent a confirmation link to <b className="text-gray-700">{signedInEmail}</b>. Open it to confirm your email.</> : "Open the confirmation link we emailed you. Lost it? We'll send another."}
      >
        <ResendLink signedInEmail={signedInEmail} />
        <p className="mt-6 text-sm text-gray-500">Nothing yet? Check spam or promotions. Confirming lets us send receipts and adds orders you placed as a guest to your account.</p>
      </AuthShell>
    );
  }

  if (result.status === "checking") {
    return (
      <AuthShell title="Confirming your email…">
        <Loader2 className="h-8 w-8 animate-spin text-[#3f7a55]" />
      </AuthShell>
    );
  }

  if (result.status === "done") {
    return (
      <AuthShell title="Email confirmed">
        <div className="rounded-2xl border border-gray-200 p-6">
          <CheckCircle2 className="h-12 w-12 text-[#22c55e]" />
          <p className="mt-4 text-gray-700">
            Thanks, your account is all set.
            {result.claimed > 0 && ` We also added ${result.claimed} order${result.claimed === 1 ? "" : "s"} you placed as a guest with this email.`}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {ready && isAuthenticated ? (
              <Link href={result.claimed > 0 ? "/orders" : "/products"} className={primary}>
                {result.claimed > 0 ? "View my orders" : "Start shopping"}
              </Link>
            ) : (
              <Link href={result.claimed > 0 ? "/login?redirect=%2Forders" : "/login"} className={primary}>Sign in</Link>
            )}
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="This link didn't work" subtitle={result.message}>
      <div className="mb-6 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
        Confirmation links expire after 48 hours. Get a fresh one below.
      </div>
      <ResendLink signedInEmail={signedInEmail} />
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>}>
      <VerifyEmail />
    </Suspense>
  );
}
