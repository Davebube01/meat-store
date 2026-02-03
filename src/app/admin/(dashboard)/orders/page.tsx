import { orders } from "@/data/orders";
import { customers } from "@/data/customers";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { OrderStats } from "@/components/admin/orders/OrderStats";

export default function OrdersPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>

      <OrderStats orders={orders} />
      <OrdersTable orders={orders} customers={customers} />
    </div>
  );
}
