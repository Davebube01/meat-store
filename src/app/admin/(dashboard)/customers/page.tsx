"use client";

import { useEffect, useState } from "react";
import { getCustomers, Customer } from "@/core/api";
import { CustomersTable } from "@/components/admin/customers/CustomersTable";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load customers");
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
        <p>Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl">
          <AlertCircle className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-semibold">Error Loading Customers</p>
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
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
      </div>

      <CustomersTable customers={customers} />
    </div>
  );
}
