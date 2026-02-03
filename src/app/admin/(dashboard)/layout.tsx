import { AdminSidebar, MobileSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminSidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <div className="sticky top-0 z-40 bg-white/50 backdrop-blur-md border-b lg:border-none px-6 py-4 flex items-center justify-between lg:hidden">
          <MobileSidebar />
          <span className="font-serif font-bold text-lg text-[#FF6B35]">
            MeatStore
          </span>
          <div className="w-10" />{" "}
          {/* Spacer for centering if needed, or user profile */}
        </div>
        <div className="hidden lg:block">
          <AdminHeader />
        </div>

        <main className="flex-1 lg:p-6 pt-6">{children}</main>
      </div>
    </div>
  );
}
