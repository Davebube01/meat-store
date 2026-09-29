"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthForm, AuthTab } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuthStore } from "@/core/store/useAuthStore";
import { safeRedirect } from "@/lib/authValidation";

function AuthPageContent({ defaultTab }: { defaultTab: AuthTab }) {
  const router = useRouter();
  const params = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const redirectTo = safeRedirect(params.get("redirect"));
  const email = params.get("email") ?? "";
  // Keep where they were going when they switch between sign in and register.
  const keep = params.get("redirect") ? `?redirect=${encodeURIComponent(params.get("redirect")!)}` : "";
  const register = defaultTab === "register";

  // Already signed in (e.g. followed a stale login link): nothing to do here.
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
    <AuthShell
      title={register ? "Create your account" : "Welcome back"}
      subtitle={
        register ? (
          <>Already have one? <Link href={`/login${keep}`} className="font-semibold text-[#3f7a55] hover:underline">Sign in</Link></>
        ) : (
          <>New here? <Link href={`/register${keep}`} className="font-semibold text-[#3f7a55] hover:underline">Create an account</Link></>
        )
      }
    >
      <AuthForm
        defaultTab={defaultTab}
        initialEmail={email}
        showTabs={false}
        onSwitch={(tab) => router.push(`/${tab === "register" ? "register" : "login"}${keep}`)}
        onSuccess={() => router.replace(redirectTo)}
      />
      <div className="mt-8 rounded-xl bg-[#f4f7f5] px-4 py-3 text-sm text-gray-600">
        Bought as a guest? <Link href="/order-tracking" className="font-semibold text-[#3f7a55] hover:underline">Track your order</Link> without an account.
        {register && " Orders you placed with this email are added to your account once you confirm it."}
      </div>
    </AuthShell>
  );
}

export function AuthPage({ defaultTab }: { defaultTab: AuthTab }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>}>
      <AuthPageContent defaultTab={defaultTab} />
    </Suspense>
  );
}
