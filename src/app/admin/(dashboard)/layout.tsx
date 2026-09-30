"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminAuthStore } from "@/core/store/useAdminAuthStore";
import { restoreSession } from "@/core/api/client";
import { adminLandingPath, permissionForPath } from "@/core/constants/routes";
import { hasPermission } from "@/core/store/useAdminCan";

import { ToastContainer } from "react-toastify";
import { KeyRound, Loader2, ShieldAlert } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const permissions = useAdminAuthStore((state) => state.user?.permissions);
  const temporaryPassword = useAdminAuthStore((state) => !!state.user?.password_is_temporary);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // The API is what actually enforces admin access; this just keeps the
  // portal from rendering for someone who isn't signed in. After a page load
  // the in-memory token is gone, so it's restored from the admin refresh
  // cookie first — if that fails, the session is over.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Read the live store, not the `isAuthenticated` captured at render time:
      // on a hard load React's first pass sees the store's initial (signed-out)
      // snapshot even though the persisted state has already been applied.
      if (!useAdminAuthStore.getState().isAuthenticated) {
        router.replace("/admin/login");
        return;
      }
      const token = await restoreSession("admin");
      if (cancelled) return;
      if (token) setCheckingAuth(false);
      else router.replace("/admin/login");
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, router]);

  const needed = permissionForPath(pathname);
  const allowed = hasPermission(permissions, needed);
  const landing = adminLandingPath(permissions);

  // The dashboard is where sign-in sends everyone; staff without it go to
  // their own first section instead of seeing "not allowed".
  useEffect(() => {
    if (!checkingAuth && !allowed && pathname === "/admin/dashboard" && landing !== pathname) {
      router.replace(landing);
    }
  }, [checkingAuth, allowed, pathname, landing, router]);

  if (checkingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 uppercase tracking-widest text-sm font-medium text-gray-400">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span>Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar - Desktop (hidden on mobile, but AdminSidebar handles its own visibility) */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Unified Header with Mobile Menu Trigger */}
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {temporaryPassword && pathname !== "/admin/account" && (
              <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 sm:flex-row sm:items-center">
                <KeyRound className="h-5 w-5 shrink-0 text-amber-600" />
                <p className="flex-1">You&apos;re signed in with a password someone else set for you. Choose your own so only you know it.</p>
                <Link href="/admin/account" className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-amber-600 px-4 font-semibold text-white hover:bg-amber-700">
                  Change password
                </Link>
              </div>
            )}
            {allowed ? children : (
              <div className="mx-auto mt-16 max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" />
                <h1 className="mt-4 text-lg font-semibold text-gray-900">Your role can&apos;t open this page</h1>
                <p className="mt-1 text-sm text-gray-500">Ask the store owner if you need access.</p>
                <Link href={landing} className="mt-6 inline-block text-sm font-semibold text-[#3f7a55] hover:underline">
                  Go to your workspace
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}

