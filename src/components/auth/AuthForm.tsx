"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/core/store/useAuthStore";
import { logout } from "@/core/auth/logout";
import { getUserMe, loginWithEmail, registerAccount } from "@/core/api/user/auth";
import {
  MIN_PASSWORD_LENGTH,
  getPasswordStrength,
  isValidEmail,
  isValidNgPhone,
} from "@/lib/authValidation";

export type AuthTab = "login" | "register";

interface AuthFormProps {
  defaultTab?: AuthTab;
  initialEmail?: string;
  onSuccess: () => void;
  /** Sign in / Create account switch. Full pages link between routes instead. */
  showTabs?: boolean;
  /** Called with the other tab when the form wants to switch (e.g. "Sign in instead"). */
  onSwitch?: (tab: AuthTab) => void;
}

type Fields = { fullName: string; email: string; phone: string; password: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

const STRENGTH_COLORS = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-green-600"];

function describeError(err: unknown): string {
  const e = err as { status?: number; message?: string } | null;
  const status = e?.status ?? 0;
  if (status === 401) return "Incorrect email or password.";
  if (status === 409) return "An account with this email already exists.";
  if (status === 429) return "Too many attempts. Please wait a few minutes and try again.";
  if (status === 400 && /inactive/i.test(e?.message ?? "")) {
    return "This account has been deactivated. Please contact support.";
  }
  if (status >= 500) return "Something went wrong on our side. Please try again in a moment.";
  if (err instanceof TypeError) return "Can't reach the server. Check your connection and try again.";
  return e?.message || "Something went wrong. Please try again.";
}

export function AuthForm({ defaultTab = "login", initialEmail = "", onSuccess, showTabs = true, onSwitch }: AuthFormProps) {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const [fields, setFields] = useState<Fields>({ fullName: "", email: initialEmail, phone: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<{ message: string; emailTaken?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = tab === "register";
  const strength = getPasswordStrength(fields.password);

  const setField = (key: keyof Fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (formError) setFormError(null);
  };

  const switchTab = (next: AuthTab) => {
    if (onSwitch) return onSwitch(next);
    setTab(next);
    setErrors({});
    setFormError(null);
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};

    if (isRegister && fields.fullName.trim().length < 2) next.fullName = "Enter your full name";
    if (!isValidEmail(fields.email)) next.email = "Enter a valid email address";
    if (isRegister && !isValidNgPhone(fields.phone)) next.phone = "Enter a valid Nigerian number, e.g. 0803 123 4567";
    if (!fields.password) next.password = "Enter your password";
    else if (isRegister && fields.password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !validate()) return;

    setLoading(true);
    setFormError(null);

    try {
      const email = fields.email.trim().toLowerCase();

      if (isRegister) {
        const result = await registerAccount({
          full_name: fields.fullName.trim(),
          email,
          phone: fields.phone.trim(),
          password: fields.password,
        });
        setAuth(result.access_token, result.user, true);
        toast.success(`Welcome, ${result.user.full_name || result.user.email}!`);
        toast.info(`We sent a confirmation link to ${result.user.email}.`);
      } else {
        const result = await loginWithEmail({ email, password: fields.password, remember_me: remember });
        // Token first, so the /me call below is authenticated.
        setAuth(result.access_token, null, remember);
        try {
          const user = await getUserMe();
          setAuth(result.access_token, user);
          toast.success(`Welcome back, ${user.full_name || user.email}!`);
        } catch (err) {
          void logout();
          throw err;
        }
      }

      onSuccess();
    } catch (err) {
      setFormError({ message: describeError(err), emailTaken: (err as { status?: number })?.status === 409 });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (key: keyof Fields) =>
    cn("pl-10 h-12 rounded-xl", errors[key] && "border-red-500 focus-visible:ring-red-500/30");

  return (
    <div>
      {showTabs && (
      <div role="tablist" aria-label="Account" className="grid grid-cols-2 bg-gray-100 rounded-lg p-1 mb-6">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => switchTab(t)}
            className={cn(
              "py-2 rounded-md text-sm font-semibold transition-all",
              tab === t ? "bg-white shadow-sm text-[#2d583d]" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t === "login" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {isRegister && (
          <div className="grid gap-1.5">
            <Label htmlFor="auth-name">Full name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="auth-name"
                autoComplete="name"
                placeholder="e.g. Amina Yusuf"
                value={fields.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                aria-invalid={!!errors.fullName}
                className={inputClass("fullName")}
              />
            </div>
            {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
          </div>
        )}

        <div className="grid gap-1.5">
          <Label htmlFor="auth-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={fields.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={!!errors.email}
              className={inputClass("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        {isRegister && (
          <div className="grid gap-1.5">
            <Label htmlFor="auth-phone">Phone number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="auth-phone"
                type="tel"
                autoComplete="tel"
                placeholder="0803 123 4567"
                value={fields.phone}
                onChange={(e) => setField("phone", e.target.value)}
                aria-invalid={!!errors.phone}
                className={inputClass("phone")}
              />
            </div>
            {errors.phone ? (
              <p className="text-xs text-red-600">{errors.phone}</p>
            ) : (
              <p className="text-xs text-gray-400">Our rider will use this to reach you on delivery.</p>
            )}
          </div>
        )}

        <div className="grid gap-1.5">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="auth-password">Password</Label>
            {!isRegister && (
              <Link href="/forgot-password" className="text-xs font-semibold text-[#3f7a55] hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={fields.password}
              onChange={(e) => setField("password", e.target.value)}
              aria-invalid={!!errors.password}
              className={cn(inputClass("password"), "pr-12")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}

          {isRegister && fields.password && (
            <div aria-live="polite">
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      strength.score >= i ? STRENGTH_COLORS[strength.score] : "bg-gray-200"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">{strength.label}</span>
                {strength.tips.length > 0 && <> — {strength.tips[0]}</>}
              </p>
            </div>
          )}
        </div>

        {!isRegister && (
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#3f7a55]"
            />
            Keep me signed in
          </label>
        )}

        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              {formError.message}
              {formError.emailTaken && (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className="font-semibold underline underline-offset-2"
                  >
                    Sign in instead
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {isRegister && (
          <p className="text-xs text-gray-500">
            By creating an account you agree to our terms and privacy policy. We&apos;ll send a link to confirm your email.
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#3f7a55] text-base font-semibold text-white hover:bg-[#2d583d]"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isRegister ? "Create account" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
