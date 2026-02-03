import { customers } from "@/data/customers";
import { CustomersTable } from "@/components/admin/customers/CustomersTable";

export default function CustomersPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
      </div>

      <CustomersTable customers={customers} />
    </div>
  );
}
