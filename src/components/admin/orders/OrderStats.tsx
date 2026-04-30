import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order, OrderStatus } from "@/core/api";
import { ListOrdered, CheckCircle2, Clock, Truck } from "lucide-react";

interface OrderStatsProps {
  orders: Order[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const processing = orders.filter((o) =>
    ["processing", "in_transit"].includes(o.status),
  ).length;
  const completed = orders.filter((o) => o.status === "delivered").length;

  const stats = [
    {
      title: "Total Orders",
      value: total,
      description: "All time orders",
      icon: ListOrdered,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Pending",
      value: pending,
      description: "Waiting for confirmation",
      icon: Clock,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Processing",
      value: processing,
      description: "Currently in progress",
      icon: Truck,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Completed",
      value: completed,
      description: "Successfully delivered",
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-none shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
