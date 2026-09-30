"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeOwnPassword } from "@/core/api/admin/staff";
import { useAdminAuthStore } from "@/core/store/useAdminAuthStore";
import { useAdminPush } from "@/core/hooks/admin/usePush";

export default function AccountPage() {
  const user = useAdminAuthStore((s) => s.user);
  const push = useAdminPush();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const problem =
    next && next.length < 8 ? "At least 8 characters"
      : confirm && confirm !== next ? "The two new passwords don't match"
        : null;

  const change = useMutation({
    mutationFn: () => changeOwnPassword(current, next),
    onSuccess: () => {
      toast.success("Password changed");
      const { token, user: me, setAuth } = useAdminAuthStore.getState();
      if (token && me) setAuth(token, { ...me, password_is_temporary: false });
      setCurrent("");
      setNext("");
      setConfirm("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <p className="text-sm text-gray-500">Your account</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">{user?.full_name ?? user?.email}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {user?.email} · <span className="capitalize">{user?.role ?? "owner"}</span>
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
        <p className="mt-1 text-sm text-gray-500">
          {push.subscribed
            ? "You'll get push notifications on this device for new orders, cancellations and stock alerts."
            : "Get push notifications on this device for new orders, cancellations and stock alerts."}
        </p>
        {!push.supported && push.ready ? (
          <p className="mt-3 text-sm text-gray-500">
            Not supported in this browser. Install MeatStore Admin to your home screen first, or use Chrome/Edge.
          </p>
        ) : (
          <Button
            type="button"
            variant={push.subscribed ? "outline" : "default"}
            className={push.subscribed ? "mt-3" : "mt-3 bg-[#3f7a55] hover:bg-[#2d583d]"}
            disabled={!push.ready || push.enable.isPending || push.disable.isPending}
            onClick={() => (push.subscribed ? push.disable.mutate() : push.enable.mutate())}
          >
            {push.enable.isPending || push.disable.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : push.subscribed ? (
              <>
                <BellOff className="h-4 w-4" /> Turn off notifications
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" /> Enable notifications
              </>
            )}
          </Button>
        )}
      </div>

      <form
        className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!problem) change.mutate();
        }}
      >
        <h2 className="text-sm font-semibold text-gray-900">Change password</h2>
        <div className="grid gap-1.5">
          <Label htmlFor="current">Current password</Label>
          <Input id="current" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="new">New password</Label>
          <Input id="new" type="password" autoComplete="new-password" required minLength={8} value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="confirm">New password again</Label>
          <Input id="confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {problem && <p className="text-sm text-red-600">{problem}</p>}
        <Button type="submit" disabled={change.isPending || !!problem || !current || !next || !confirm} className="bg-[#3f7a55] hover:bg-[#2d583d]">
          {change.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change password"}
        </Button>
      </form>
    </div>
  );
}
