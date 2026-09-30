"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { KeyRound, Loader2, MonitorSmartphone, ShieldOff, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getActivity } from "@/core/api/admin/activity";
import {
  resetStaffPassword, signOutStaff, suggestPassword, updateStaff, type StaffMember, type StaffRole,
} from "@/core/api/admin/staff";
import { cn } from "@/lib/utils";
import { ROLE_STYLES, initials, when } from "./format";
import { PasswordNote, RolePicker } from "./parts";

interface Props {
  member: StaffMember | null;
  isMe: boolean;
  onClose: () => void;
  onChanged: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-gray-100 px-6 py-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</h3>
      {children}
    </section>
  );
}

function Body({ m, isMe, onChanged, onClose }: { m: StaffMember; isMe: boolean; onChanged: () => void; onClose: () => void }) {
  const name = m.full_name ?? m.email;
  const [details, setDetails] = useState({ full_name: m.full_name ?? "", phone: m.phone ?? "" });
  const [role, setRole] = useState<StaffRole>(m.role);
  const [resetPassword, setResetPassword] = useState<string | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const detailsDirty = details.full_name.trim() !== (m.full_name ?? "") || details.phone.trim() !== (m.phone ?? "");

  const update = useMutation({
    mutationFn: (data: Parameters<typeof updateStaff>[1]) => updateStaff(m.id, data),
    onSuccess: (_, data) => {
      onChanged();
      if (data.is_active === false) {
        toast.success(`${name} is deactivated and signed out`);
        setConfirmDeactivate(false);
      } else if (data.is_active) toast.success(`${name} can sign in again`);
      else if (data.role) toast.success(`${name} is now ${data.role === "owner" ? "an" : "a"} ${data.role}`);
      else toast.success("Details saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const reset = useMutation({
    mutationFn: (password: string) => resetStaffPassword(m.id, password),
    onSuccess: () => {
      toast.success(`Password reset. ${name} has been signed out everywhere.`);
      setResetPassword(null);
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const signOut = useMutation({
    mutationFn: () => signOutStaff(m.id),
    onSuccess: () => {
      toast.success(`${name} is signed out of every device`);
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const activity = useQuery({
    queryKey: ["admin-activity", "actor", m.id],
    queryFn: () => getActivity({ actor_id: m.id, limit: 8 }),
  });

  return (
    <>
      <SheetHeader className="px-6 pb-5 pt-6 text-left">
        <div className="flex items-center gap-3">
          <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold", m.is_active ? "bg-[#f4f7f5] text-[#2d583d]" : "bg-gray-100 text-gray-400")}>
            {initials(name)}
          </span>
          <div className="min-w-0">
            <SheetTitle className="truncate text-lg">{name}{isMe && <span className="ml-1.5 text-sm font-normal text-gray-400">(you)</span>}</SheetTitle>
            <SheetDescription className="truncate">{m.email}</SheetDescription>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", ROLE_STYLES[m.role])}>{m.role}</span>
          {!m.is_active && <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">Deactivated</span>}
          {m.is_active && m.password_is_temporary && <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Temporary password</span>}
        </div>
      </SheetHeader>

      <Section title="Details">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (detailsDirty && details.full_name.trim().length >= 2) update.mutate({ full_name: details.full_name.trim(), phone: details.phone.trim() });
          }}
        >
          <div className="grid gap-1.5">
            <Label htmlFor="d_name">Full name</Label>
            <Input id="d_name" value={details.full_name} maxLength={100} onChange={(e) => setDetails({ ...details, full_name: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="d_phone">Phone</Label>
            <Input id="d_phone" type="tel" value={details.phone} maxLength={30} onChange={(e) => setDetails({ ...details, phone: e.target.value })} />
          </div>
          <p className="text-xs text-gray-500">The email is their sign-in, so it can&apos;t be changed. Add a new account instead.</p>
          {detailsDirty && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setDetails({ full_name: m.full_name ?? "", phone: m.phone ?? "" })}>Discard</Button>
              <Button type="submit" size="sm" disabled={update.isPending || details.full_name.trim().length < 2} className="bg-[#3f7a55] hover:bg-[#2d583d]">Save details</Button>
            </div>
          )}
        </form>
      </Section>

      <Section title="Role">
        {isMe ? (
          <p className="text-sm text-gray-600">You can&apos;t change your own role. Another owner can.</p>
        ) : (
          <>
            <RolePicker value={role} onChange={setRole} disabled={!m.is_active} />
            {role !== m.role && (
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-gray-500">Takes effect on their next click.</p>
                <Button size="sm" disabled={update.isPending} onClick={() => update.mutate({ role })} className="bg-[#3f7a55] hover:bg-[#2d583d]">Save role</Button>
              </div>
            )}
          </>
        )}
      </Section>

      <Section title="Sign-in">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-gray-500">Last signed in</dt><dd className="text-gray-900">{when(m.last_signed_in_at)}</dd></div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Signed in on</dt>
            <dd className="text-gray-900">{m.active_sessions === 0 ? "No devices" : `${m.active_sessions} device${m.active_sessions === 1 ? "" : "s"}`}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Password</dt>
            <dd className={m.password_is_temporary ? "text-amber-700" : "text-gray-900"}>{m.password_is_temporary ? "Temporary, not changed yet" : "Their own"}</dd>
          </div>
        </dl>

        <div className="mt-4 space-y-2">
          {isMe ? (
            <Link href="/admin/account" className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left text-sm hover:bg-gray-50">
              <KeyRound className="h-4 w-4 shrink-0 text-gray-500" />
              <span><span className="block font-medium text-gray-900">Change your password</span><span className="text-xs text-gray-500">On your account page. You stay signed in here.</span></span>
            </Link>
          ) : resetPassword === null ? (
            <button type="button" onClick={() => setResetPassword(suggestPassword())} className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left text-sm hover:bg-gray-50">
              <KeyRound className="h-4 w-4 shrink-0 text-gray-500" />
              <span><span className="block font-medium text-gray-900">Reset password</span><span className="text-xs text-gray-500">For a forgotten password. Signs them out everywhere.</span></span>
            </button>
          ) : (
            <div className="space-y-3 rounded-xl border border-gray-200 p-3">
              <Label htmlFor="r_pw">New password for {name}</Label>
              <div className="flex gap-2">
                <Input id="r_pw" value={resetPassword} minLength={8} onChange={(e) => setResetPassword(e.target.value)} className="font-mono" />
                <Button type="button" variant="outline" onClick={() => setResetPassword(suggestPassword())}>New</Button>
              </div>
              {resetPassword.length >= 8 && <PasswordNote password={resetPassword} />}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setResetPassword(null)}>Cancel</Button>
                <Button size="sm" disabled={reset.isPending || resetPassword.length < 8} onClick={() => reset.mutate(resetPassword)} className="bg-[#3f7a55] hover:bg-[#2d583d]">
                  {reset.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />} Reset password
                </Button>
              </div>
            </div>
          )}
          {!isMe && m.active_sessions > 0 && (
            <button type="button" disabled={signOut.isPending} onClick={() => signOut.mutate()} className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left text-sm hover:bg-gray-50 disabled:opacity-60">
              {signOut.isPending ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-500" /> : <MonitorSmartphone className="h-4 w-4 shrink-0 text-gray-500" />}
              <span><span className="block font-medium text-gray-900">Sign out everywhere</span><span className="text-xs text-gray-500">Lost phone or shared computer. They can sign back in with their password.</span></span>
            </button>
          )}
        </div>
      </Section>

      {!isMe && (
        <Section title="Access">
          {m.is_active ? (
            confirmDeactivate ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-medium">Deactivate {name}?</p>
                <p className="mt-1 text-red-700">They&apos;re signed out straight away and can&apos;t sign in until you reactivate them. Their past work stays in the activity log.</p>
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDeactivate(false)}>Cancel</Button>
                  <Button size="sm" disabled={update.isPending} onClick={() => update.mutate({ is_active: false })} className="bg-red-600 hover:bg-red-700">Deactivate</Button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmDeactivate(true)} className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left text-sm hover:border-red-200 hover:bg-red-50">
                <ShieldOff className="h-4 w-4 shrink-0 text-red-500" />
                <span><span className="block font-medium text-red-600">Deactivate</span><span className="text-xs text-gray-500">When someone leaves. You can reactivate them later.</span></span>
              </button>
            )
          ) : (
            <button type="button" disabled={update.isPending} onClick={() => update.mutate({ is_active: true })} className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left text-sm hover:bg-gray-50 disabled:opacity-60">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#3f7a55]" />
              <span><span className="block font-medium text-gray-900">Reactivate</span><span className="text-xs text-gray-500">They can sign in again with their password.</span></span>
            </button>
          )}
        </Section>
      )}

      <Section title="Recent activity">
        {activity.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        ) : !activity.data?.items.length ? (
          <p className="text-sm text-gray-500">Nothing recorded yet.</p>
        ) : (
          <>
            <ul className="space-y-2.5">
              {activity.data.items.map((a) => (
                <li key={a.id} className="text-sm">
                  <p className="text-gray-800">{a.summary}</p>
                  <p className="text-xs text-gray-400">{when(a.created_at)}</p>
                </li>
              ))}
            </ul>
            {activity.data.total > activity.data.items.length && (
              <Link href={`/admin/activity?actor=${m.id}`} className="mt-3 inline-block text-sm font-semibold text-[#3f7a55] hover:underline">
                See all {activity.data.total}
              </Link>
            )}
          </>
        )}
      </Section>

      <div className="border-t border-gray-100 px-6 py-4">
        <Button variant="ghost" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </>
  );
}

/** Everything about one staff member, in a side panel. */
export function StaffSheet({ member, isMe, onClose, onChanged }: Props) {
  return (
    <Sheet open={!!member} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
        {member && (
          <Body
            key={`${member.id}-${member.role}-${member.is_active}-${member.full_name}-${member.phone}`}
            m={member}
            isMe={isMe}
            onChanged={onChanged}
            onClose={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
