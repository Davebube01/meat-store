"use client";

import { useState } from "react";
import { Order, Customer, OrderStatus } from "@/core/api";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface OrdersTableProps {
  orders: Order[];
  customers: Customer[];
}

export function OrdersTable({ orders, customers }: OrdersTableProps) {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const getCustomerName = (customerId: string) => {
    return customers.find((c) => c.id === customerId)?.name || "Unknown";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const customerName = (order.user_id ? getCustomerName(order.user_id) : order.guest_info?.fullName || "Guest").toLowerCase();
    const orderId = order.id.toLowerCase();
    const matchesSearch =
      customerName.includes(search.toLowerCase()) ||
      orderId.includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
      case "paid":
      case "processing":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "paid":
        return "Paid";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return (status as string).replace(/_/g, " ");
    }
  };

  return (
    <Card className="border-t-4 border-t-blue-500 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">All Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Input
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={filterStatus}
            onValueChange={(value: string) =>
              setFilterStatus(value as OrderStatus | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/20">
                    <TableCell className="font-semibold text-primary">
                      #{order.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {order.user_id ? getCustomerName(order.user_id) : order.guest_info?.fullName || "Guest"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell className="text-right font-bold">
                      ₦{order.total_amount.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`${getStatusStyles(order.status)} px-3 py-1`}
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-primary"
                        >
                          <span className="sr-only">View</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
