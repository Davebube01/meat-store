"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthForm, AuthTab } from "@/components/auth/AuthForm";
import { useAuthStore } from "@/core/store/useAuthStore";
import { safeRedirect } from "@/lib/authValidation";

function AuthPageContent({ defaultTab }: { defaultTab: AuthTab }) {
  const router = useRouter();
  const params = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const redirectTo = safeRedirect(params.get("redirect"));
  const email = params.get("email") ?? "";

  // Already signed in (e.g. followed a stale login link) — nothing to do here.
  useEffect(() => {
    if (isAuthenticated) router.replace(redirectTo);
  }, [isAuthenticated, redirectTo, router]);

  if (isAuthenticated) {
    return (
      <div className="flex justify-center py-16 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {defaultTab === "register" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Order faster, save your details, and track every delivery.
        </p>
      </div>
      <AuthForm
        defaultTab={defaultTab}
        initialEmail={email}
        onSuccess={() => router.replace(redirectTo)}
      />
    </div>
  );
}

export function AuthPage({ defaultTab }: { defaultTab: AuthTab }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-10">
        <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-gray-400" />}>
          <AuthPageContent defaultTab={defaultTab} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
