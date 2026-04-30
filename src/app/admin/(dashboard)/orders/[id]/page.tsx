"use client";

import { useEffect, useState, use } from "react";
import { getOrderById, getCustomerById, Order, Customer } from "@/core/api";
import { OrderDetails } from "@/components/admin/orders/OrderDetails";
import { notFound } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderPage({ params }: PageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderData = await getOrderById(id);
      if (!orderData) {
        setError("Order not found");
        return;
      }
      setOrder(orderData);

      if (orderData.user_id) {
        try {
          const customerData = await getCustomerById(orderData.user_id);
          setCustomer(customerData);
        } catch (err) {
          console.error("Failed to fetch customer profile:", err);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl">
          <AlertCircle className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-semibold">Order Error</p>
            <p className="text-sm opacity-90">{error || "Order not found"}</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} className="border-destructive/20 hover:bg-destructive/10">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <OrderDetails order={order} customer={customer || undefined} />
    </div>
  );
}

