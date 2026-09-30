"use client";

import { Check } from "lucide-react";
import type { StaffRole } from "@/core/api/admin/staff";
import { cn } from "@/lib/utils";

const ROLE_HINT: Record<StaffRole, string> = {
  owner: "Everything, including staff and settings.",
  manager: "Runs the shop: products, stock, orders, sales, voids, customers, reports. Not staff or settings.",
  cashier: "Rings up counter sales and moves orders along. No voids, cost prices, money reports or stock edits.",
};


export function RolePicker({ value, onChange, disabled }: { value: StaffRole; onChange: (r: StaffRole) => void; disabled?: boolean }) {
  return (
    <div className="grid gap-2" role="radiogroup">
      {(["cashier", "manager", "owner"] as StaffRole[]).map((r) => (
        <button
          key={r}
          type="button"
          role="radio"
          disabled={disabled}
          aria-checked={value === r}
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

export function PasswordNote({ password }: { password: string }) {
  return (
    <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p>Give them this password in person or by phone. They&apos;ll be asked to choose their own after signing in.</p>
      <p className="mt-1 select-all font-mono text-base font-semibold">{password}</p>
    </div>
  );
}
