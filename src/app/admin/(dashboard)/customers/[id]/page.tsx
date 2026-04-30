"use client";

import { useEffect, useState } from "react";
import { getCustomerById } from "@/core/api";
import { CustomerProfile } from "@/components/admin/customers/CustomerProfile";
import { useParams, notFound } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerPage() {
  const { id } = useParams() as { id: string };
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch (err: any) {
      if (err.message && err.message.includes("404")) {
        setCustomer(null);
      } else {
        setError(err.message || "Failed to load customer details");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading customer profile...</p>
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
          <Button variant="outline" size="sm" onClick={fetchCustomer} className="border-destructive/20 hover:bg-destructive/10">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <CustomerProfile customer={customer} orders={customer.recent_orders || []} />
    </div>
  );
}

