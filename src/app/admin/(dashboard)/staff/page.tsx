"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, Check, ChevronRight, KeyRound, Loader2, UserPlus } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_STYLES, initials, when } from "@/components/admin/staff/format";
import { PasswordNote, RolePicker } from "@/components/admin/staff/parts";
import { StaffSheet } from "@/components/admin/staff/StaffSheet";
import { addStaff, getStaff, suggestPassword, type StaffRole } from "@/core/api/admin/staff";
import { useAdminAuthStore } from "@/core/store/useAdminAuthStore";
import { cn } from "@/lib/utils";

const EMPTY = { full_name: "", email: "", phone: "", role: "cashier" as StaffRole, password: "" };

export default function StaffPage() {
  const queryClient = useQueryClient();
  const me = useAdminAuthStore((s) => s.user);
  const { data, isPending, isError, error, refetch } = useQuery({ queryKey: ["admin-staff"], queryFn: getStaff });

  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-staff"] });

  const add = useMutation({
    mutationFn: () => addStaff({ ...form, full_name: form.full_name.trim(), phone: form.phone.trim() || undefined }),
    onSuccess: (member) => {
      toast.success(`${member.full_name} can now sign in at /admin/login`);
      setAdding(false);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const staff = data?.staff ?? [];
  const active = staff.filter((s) => s.is_active);
  const byRole = (r: StaffRole) => active.filter((s) => s.role === r).length;
  const temporary = active.filter((s) => s.password_is_temporary).length;
  const open = staff.find((s) => s.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Team</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Staff</h1>
          <p className="mt-1 text-sm text-gray-500">Who can sign in to the admin, and what their role lets them do.</p>
        </div>
        <Button onClick={() => { setForm({ ...EMPTY, password: suggestPassword() }); setAdding(true); }} className="bg-[#3f7a55] hover:bg-[#2d583d]">
          <UserPlus className="mr-2 h-4 w-4" /> Add staff
        </Button>
      </div>

      {isPending ? (
        <div className="flex justify-center p-24"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="flex-1">{(error as Error)?.message}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <span><strong className="font-semibold text-gray-900">{active.length}</strong> active</span>
            <span>{byRole("owner")} owner{byRole("owner") === 1 ? "" : "s"}</span>
            <span>{byRole("manager")} manager{byRole("manager") === 1 ? "" : "s"}</span>
            <span>{byRole("cashier")} cashier{byRole("cashier") === 1 ? "" : "s"}</span>
            {temporary > 0 && (
              <span className="inline-flex items-center gap-1.5 text-amber-700">
                <KeyRound className="h-3.5 w-3.5" /> {temporary} still on a temporary password
              </span>
            )}
          </div>

          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {staff.map((s) => {
              const isMe = s.id === me?.id;
              const name = s.full_name ?? s.email;
              return (
                <li key={s.id}>
                  <button type="button" onClick={() => setOpenId(s.id)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50">
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold", s.is_active ? "bg-[#f4f7f5] text-[#2d583d]" : "bg-gray-100 text-gray-400")}>
                      {initials(name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate font-medium", s.is_active ? "text-gray-900" : "text-gray-400")}>
                        {name} {isMe && <span className="text-xs font-normal text-gray-400">(you)</span>}
                      </span>
                      <span className="block truncate text-xs text-gray-500">{s.email}{s.phone ? ` · ${s.phone}` : ""}</span>
                      <span className="mt-1.5 flex flex-wrap gap-1.5 sm:hidden">
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", ROLE_STYLES[s.role])}>{s.role}</span>
                        {!s.is_active && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">Deactivated</span>}
                      </span>
                    </span>
                    <span className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                      <span className="flex gap-1.5">
                        {s.is_active && s.password_is_temporary && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Temporary password</span>}
                        {!s.is_active && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">Deactivated</span>}
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", ROLE_STYLES[s.role])}>{s.role}</span>
                      </span>
                      <span className="text-xs text-gray-400">
                        {s.last_signed_in_at ? `Last in ${when(s.last_signed_in_at)}` : "Never signed in"}
                        {s.active_sessions > 0 && ` · on ${s.active_sessions} device${s.active_sessions === 1 ? "" : "s"}`}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
                  </button>
                </li>
              );
            })}
          </ul>

          <details className="group rounded-2xl border border-gray-200 bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
              What each role can do
              <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90" />
            </summary>
            <div className="overflow-x-auto border-t border-gray-100 px-5 pb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    <th className="py-2 pr-4">Permission</th>
                    {data!.roles.map((r) => <th key={r.key} className="px-3 py-2 text-center">{r.label}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(data!.permissions).map(([key, text]) => (
                    <tr key={key}>
                      <td className="py-2 pr-4 text-gray-700">{text}</td>
                      {data!.roles.map((r) => (
                        <td key={r.key} className="px-3 py-2 text-center">
                          {r.permissions.includes(key)
                            ? <Check className="mx-auto h-4 w-4 text-[#3f7a55]" aria-label="Yes" />
                            : <span className="text-gray-300" aria-label="No">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}

      <StaffSheet member={open} isMe={open?.id === me?.id} onClose={() => setOpenId(null)} onChanged={refresh} />

      {/* Add staff */}
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add staff</DialogTitle>
            <DialogDescription>They sign in at /admin/login with this email and password.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}>
            <div className="grid gap-1.5">
              <Label htmlFor="s_name">Full name</Label>
              <Input id="s_name" required minLength={2} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="s_email">Email</Label>
                <Input id="s_email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s_phone">Phone (optional)</Label>
                <Input id="s_phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Role</Label>
              <RolePicker value={form.role} onChange={(role) => setForm({ ...form, role })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="s_password">First password</Label>
              <div className="flex gap-2">
                <Input id="s_password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="font-mono" />
                <Button type="button" variant="outline" onClick={() => setForm({ ...form, password: suggestPassword() })}>New</Button>
              </div>
              {form.password.length >= 8 && <PasswordNote password={form.password} />}
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
              <Button type="submit" disabled={add.isPending} className="bg-[#3f7a55] hover:bg-[#2d583d]">
                {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add staff"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
