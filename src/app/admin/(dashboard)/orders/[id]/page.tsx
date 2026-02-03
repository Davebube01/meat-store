import { orders } from "@/data/orders";
import { customers } from "@/data/customers";
import { OrderDetails } from "@/components/admin/orders/OrderDetails";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  const customer = customers.find((c) => c.id === order.customerId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <OrderDetails order={order} customer={customer} />
    </div>
  );
}
