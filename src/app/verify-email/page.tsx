"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { verifyEmailToken } from "@/core/api/user/auth";
import { useAuthStore } from "@/core/store/useAuthStore";

type State =
  | { status: "checking" }
  | { status: "done"; claimed: number }
  | { status: "failed"; message: string };

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [state, setState] = useState<State>({ status: "checking" });
  // React strict mode runs effects twice in dev; the link is idempotent but
  // there's no reason to spend two requests on it.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!token) {
      setState({ status: "failed", message: "This verification link is incomplete." });
      return;
    }

    verifyEmailToken(token)
      .then((result) => {
        // If the same person is signed in here, clear their banner right away.
        updateProfile({ email_verified: true });
        setState({ status: "done", claimed: result.claimed_orders });
      })
      .catch((err: any) =>
        setState({
          status: "failed",
          message: err?.message || "This verification link is invalid or has expired.",
        })
      );
  }, [token, updateProfile]);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
      {state.status === "checking" && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-green-700 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Confirming your email…</h1>
        </>
      )}

      {state.status === "done" && (
        <>
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Email confirmed</h1>
          <p className="text-gray-500 mt-2">
            Thanks — your account is all set.
            {state.claimed > 0 &&
              ` We also linked ${state.claimed} earlier order${state.claimed === 1 ? "" : "s"} to your account.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button asChild className="bg-green-700 hover:bg-green-800">
              <Link href={state.claimed > 0 ? "/orders" : "/products"}>
                {state.claimed > 0 ? "View my orders" : "Start shopping"}
              </Link>
            </Button>
          </div>
        </>
      )}

      {state.status === "failed" && (
        <>
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">We couldn't confirm your email</h1>
          <p className="text-gray-500 mt-2">{state.message}</p>
          <p className="text-gray-500 mt-1 text-sm">
            Sign in and use "Resend email" in the banner at the top to get a fresh link.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/">Back to home</Link>
          </Button>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-10">
        <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-gray-400" />}>
          <VerifyEmailContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
