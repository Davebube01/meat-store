"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { MailWarning, X } from "lucide-react";
import { useAuthStore } from "@/core/store/useAuthStore";
import { resendVerificationEmail } from "@/core/api/user/auth";

const DISMISSED_KEY = "meat-store-verify-banner-dismissed";

// A nudge, not a wall: unverified customers can still browse and order.
export function EmailVerificationBanner() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [dismissed, setDismissed] = useState(true); // hidden until we've read sessionStorage
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISSED_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!isAuthenticated || !user || user.email_verified !== false || dismissed) return null;
  // The verification page itself is where they're headed; don't nag there.
  if (pathname.startsWith("/verify-email")) return null;

  const resend = async () => {
    setSending(true);
    try {
      await resendVerificationEmail();
      setSent(true);
      toast.success(`Confirmation link sent to ${user.email}.`);
    } catch (err) {
      toast.error((err as { status?: number })?.status === 429 ? "You've requested a lot of emails. Please try again later." : "Couldn't send the email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // storage blocked: it just shows again next visit
    }
  };

  return (
    <div role="status" className="bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="container mx-auto flex items-center gap-3 px-4 py-2 text-sm">
        <MailWarning className="h-4 w-4 shrink-0" />
        <p className="flex-1">
          Please confirm your email address <span className="font-semibold">{user.email}</span>.
          {sent ? " Check your inbox for the link." : " We've sent you a link."}
        </p>
        <button
          type="button"
          onClick={resend}
          disabled={sending || sent}
          className="font-semibold underline underline-offset-2 disabled:no-underline disabled:opacity-60"
        >
          {sent ? "Sent" : sending ? "Sending…" : "Resend email"}
        </button>
        <button type="button" onClick={dismiss} aria-label="Dismiss" className="p-1 hover:bg-amber-100 rounded">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
