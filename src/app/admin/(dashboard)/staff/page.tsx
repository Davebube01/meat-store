"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, Check, KeyRound, Loader2, UserPlus } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addStaff, getStaff, resetStaffPassword, suggestPassword, updateStaff, type StaffMember, type StaffRole,
} from "@/core/api/admin/staff";
import { useAdminAuthStore } from "@/core/store/useAdminAuthStore";
import { cn } from "@/lib/utils";

const ROLE_HINT: Record<StaffRole, string> = {
  owner: "Everything, including staff and settings.",
  manager: "Runs the shop: products, stock, orders, sales, voids, customers, reports. Not staff or settings.",
  cashier: "Rings up counter sales and moves orders along. No voids, cost prices, money reports or stock edits.",
};

const since = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" }) : "Never";

function RolePicker({ value, onChange, disabled }: { value: StaffRole; onChange: (r: StaffRole) => void; disabled?: boolean }) {
  return (
    <div className="grid gap-2">
      {(["cashier", "manager", "owner"] as StaffRole[]).map((r) => (
        <button
          key={r}
          type="button"
          disabled={disabled}
          aria-pressed={value === r}
          onClick={() => onChange(r)}
          className={cn(
            "rounded-xl border p-3 text-left transition-colors disabled:opacity-50",
            value === r ? "border-[#3f7a55] bg-[#f4f7f5] ring-1 ring-[#3f7a55]" : "border-gray-200 hover:border-gray-300",
          )}
        >
          <p className="flex items-center gap-1.5 text-sm font-semibold capitalize text-gray-900">
            {value === r && <Check className="h-3.5 w-3.5 text-[#3f7a55]" />}
            {r}
          </p>
          <p className="text-xs text-gray-500">{ROLE_HINT[r]}</p>
        </button>
      ))}
    </div>
  );
}

function PasswordNote({ password }: { password: string }) {
  return (
    <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p>Give them this password. They can change it from their account page after signing in.</p>
      <p className="mt-1 font-mono text-base font-semibold">{password}</p>
    </div>
  );
}

export default function StaffPage() {
  const queryClient = useQueryClient();
  const me = useAdminAuthStore((s) => s.user);
  const { data, isPending, isError, error, refetch } = useQuery({ queryKey: ["admin-staff"], queryFn: getStaff });

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", role: "cashier" as StaffRole, password: "" });
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [editRole, setEditRole] = useState<StaffRole>("cashier");
  const [resetting, setResetting] = useState<StaffMember | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-staff"] });

  const add = useMutation({
    mutationFn: () => addStaff({ ...form, phone: form.phone || undefined }),
    onSuccess: (member) => {
      toast.success(`${member.full_name} can now sign in at /admin/login`);
      setAdding(false);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateStaff>[1] }) => updateStaff(id, data),
    onSuccess: () => {
      setEditing(null);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reset = useMutation({
    mutationFn: () => resetStaffPassword(resetting!.id, newPassword),
    onSuccess: () => {
      toast.success(`Password reset. ${resetting?.full_name ?? "They"} will need to sign in again.`);
      setResetting(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openAdd = () => {
    setForm({ full_name: "", email: "", phone: "", role: "cashier", password: suggestPassword() });
    setAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Team</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Staff</h1>
          <p className="mt-1 text-sm text-gray-500">Who can sign in to the admin, and what their role lets them do.</p>
        </div>
        <Button onClick={openAdd} className="bg-[#3f7a55] hover:bg-[#2d583d]">
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
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="hidden px-5 py-3 md:table-cell">Last signed in</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data!.staff.map((s) => {
                  const isMe = s.id === me?.id;
                  return (
                    <tr key={s.id} className={s.is_active ? "" : "text-gray-400"}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">
                          {s.full_name ?? s.email} {isMe && <span className="text-xs font-normal text-gray-400">(you)</span>}
                        </p>
                        <p className="text-xs text-gray-500">{s.email}{s.phone ? ` · ${s.phone}` : ""}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-gray-700">{s.role}</span>
                        {!s.is_active && <span className="ml-2 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">Deactivated</span>}
                      </td>
                      <td className="hidden px-5 py-3 text-gray-500 md:table-cell">{since(s.last_signed_in_at)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          {!isMe && (
                            <Button variant="outline" size="sm" onClick={() => { setEditing(s); setEditRole(s.role); }}>
                              Change role
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => { setResetting(s); setNewPassword(suggestPassword()); }}
                            aria-label={`Reset password for ${s.full_name ?? s.email}`}>
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          {!isMe && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={update.isPending}
                              className={s.is_active ? "text-red-600 hover:text-red-700" : ""}
                              onClick={() => update.mutate({ id: s.id, data: { is_active: !s.is_active } })}
                            >
                              {s.is_active ? "Deactivate" : "Reactivate"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900">What each role can do</h2>
            <div className="mt-3 overflow-x-auto">
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
          </section>
        </>
      )}

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
            <div className="grid grid-cols-2 gap-3">
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

      {/* Change role */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change {editing?.full_name ?? editing?.email}&apos;s role</DialogTitle>
            <DialogDescription>Takes effect on their next click; no need to sign them out.</DialogDescription>
          </DialogHeader>
          <RolePicker value={editRole} onChange={setEditRole} />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              className="bg-[#3f7a55] hover:bg-[#2d583d]"
              disabled={update.isPending || editRole === editing?.role}
              onClick={() => update.mutate({ id: editing!.id, data: { role: editRole } })}
            >
              Save role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset password */}
      <Dialog open={!!resetting} onOpenChange={(o) => !o && setResetting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              Sets a new password for {resetting?.full_name ?? resetting?.email} and signs them out everywhere.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input aria-label="New password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="font-mono" />
              <Button type="button" variant="outline" onClick={() => setNewPassword(suggestPassword())}>New</Button>
            </div>
            {newPassword.length >= 8 && <PasswordNote password={newPassword} />}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResetting(null)}>Cancel</Button>
            <Button className="bg-[#3f7a55] hover:bg-[#2d583d]" disabled={reset.isPending || newPassword.length < 8} onClick={() => reset.mutate()}>
              Reset password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
