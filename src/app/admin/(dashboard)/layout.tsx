"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAuthStore } from "../../../core/store/useAuthStore";

import { ToastContainer } from "react-toastify";
import { Loader2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Small timeout to allow hydration of the auth store
    const check = () => {
      if (!isAuthenticated || !isAdmin) {
        router.push("/admin/login");
      } else {
        setCheckingAuth(false);
      }
    };
    
    // Check immediately, but also wait a bit for persist hydration
    const timeout = setTimeout(check, 100);
    return () => clearTimeout(timeout);
  }, [isAuthenticated, isAdmin, router]);

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

