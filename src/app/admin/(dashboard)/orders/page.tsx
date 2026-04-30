"use client";

import { useEffect, useState } from "react";
import { getOrders, getCustomers, Order, Customer } from "@/core/api";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { OrderStats } from "@/components/admin/orders/OrderStats";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersData, customersData] = await Promise.all([
        getOrders(),
        getCustomers(),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl">
          <AlertCircle className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-semibold">Error Loading Data</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} className="border-destructive/20 hover:bg-destructive/10">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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

