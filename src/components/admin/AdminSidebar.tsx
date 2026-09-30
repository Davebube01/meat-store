"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  X,
  Store,
  LogOut
} from "lucide-react";
import { logout } from "@/core/auth/logout";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminMessages } from "@/core/api/admin/messages";
import { ADMIN_ROUTES } from "@/core/constants/routes";
import { useAdminCan } from "@/core/store/useAdminCan";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const can = useAdminCan();
  const pathname = usePathname();
  // Unread Contact-page messages, for the badge on Messages.
  const newMessages = useQuery({
    queryKey: ["admin-messages-new"],
    queryFn: () => getAdminMessages({ status: "new", limit: 1 }),
    enabled: can("messages"),
    refetchInterval: 60_000,
    select: (d) => d.new_count,
  }).data ?? 0;

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Header/Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">Everything Fresh</h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          {ADMIN_ROUTES.filter((route) => can(route.permission)).map((route) => {
            const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
            
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-green-50 text-green-700 shadow-sm shadow-green-100" 
                    : "text-gray-500 hover:text-green-600 hover:bg-green-50/50"
                }`}
              >
                <route.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-green-700" : "group-hover:text-green-600"}`} />
                {route.label}
                {route.href === "/admin/messages" && newMessages > 0 && (
                  <span className="ml-auto rounded-full bg-[#22c55e] px-2 py-0.5 text-xs font-semibold tabular-nums text-white" aria-label={`${newMessages} new`}>
                    {newMessages > 99 ? "99+" : newMessages}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer/Logout */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => logout("admin")}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
