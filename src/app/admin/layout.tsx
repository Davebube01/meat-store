import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="">{children}</main>
  );
}
