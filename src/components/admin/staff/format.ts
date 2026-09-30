import type { StaffRole } from "@/core/api/admin/staff";

export const ROLE_STYLES: Record<StaffRole, string> = {
  owner: "bg-[#3f7a55] text-white",
  manager: "bg-blue-50 text-blue-700",
  cashier: "bg-gray-100 text-gray-700",
};

export const initials = (name: string) =>
  name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

export const when = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" })
    : "Never";
