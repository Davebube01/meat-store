"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminAuthStore } from "@/core/store/useAdminAuthStore";
import { restoreSession } from "@/core/api/client";

import { ToastContainer } from "react-toastify";
import { Loader2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
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
            {children}
          </div>
        </main>
      </div>
      
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}

