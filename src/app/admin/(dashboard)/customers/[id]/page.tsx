import { customers } from "@/data/customers";
import { orders } from "@/data/orders";
import { CustomerProfile } from "@/components/admin/customers/CustomerProfile";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CustomerPage({ params }: PageProps) {
  const { id } = await params;
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    notFound();
  }

  const customerOrders = orders.filter((o) => o.customerId === customer.id);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <CustomerProfile customer={customer} orders={customerOrders} />
    </div>
  );
}
