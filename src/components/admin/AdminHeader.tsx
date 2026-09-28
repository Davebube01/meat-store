"use client";

import { useAdminAuthStore } from "../../core/store/useAdminAuthStore";
import { Menu, User, Search } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user } = useAdminAuthStore();
  const pathname = usePathname();
  
  // Simple breadcrumb logic
  const pathParts = pathname.split('/').filter(Boolean).slice(1); // skip 'admin'
  const currentPath = pathParts[pathParts.length - 1] || 'Dashboard';
  const capitalizedPath = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  return (
    <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Page Title / Breadcrumbs */}
        <div className="hidden sm:block">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            {capitalizedPath}
          </h2>
          <p className="text-xs text-gray-400 font-medium">MeatStore / Admin / {capitalizedPath}</p>
        </div>
      </div>

      <div className="flex items-center gap-x-3 lg:gap-x-6">
        {/* Search - Desktop */}
        <div className="hidden md:flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="bg-transparent border-none text-sm focus:ring-0 placeholder:text-gray-400 w-48 lg:w-64"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-x-2">
          <NotificationBell />
          
          <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />

          {/* User Profile */}
          <div className="flex items-center gap-x-3 pl-2">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                {user?.full_name || user?.email || "Admin User"}
              </p>
              <p className="text-[10px] uppercase font-bold text-green-600 tracking-wider">{user?.role ?? "owner"}</p>
            </div>
            <Link href="/admin/account" aria-label="Your account" className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 hover:border-green-300">
              <User className="w-5 h-5 text-gray-500" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
