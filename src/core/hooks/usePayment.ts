"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify"
import { initializePayment, simulateWebhook, InitializePaymentPayload } from "@/core/api/user/payments";
import { getUserOrderById, updateOrderStatus, OrderStatus } from "@/core/api/user/orders";

// ─── Initialize Payment ────────────────────────────────────────────────────
export const useInitializePayment = () => {
  return useMutation({
    mutationFn: (payload: InitializePaymentPayload) => initializePayment(payload),
  });
};

// ─── Order Status with Polling ─────────────────────────────────────────────
// Polls every 3s while status is pending/awaiting_verification; stops once confirmed.
const POLLING_STATUSES: OrderStatus[] = ["pending", "awaiting_verification"];

export const useOrderStatus = (orderId: string | null, enabled = true) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getUserOrderById(orderId!),
    enabled: !!orderId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || POLLING_STATUSES.includes(status)) return 3000;
      return false; // stop polling once status advances
    },
    staleTime: 0,
  });
};

// ─── Simulate Webhook (Dev Only) ───────────────────────────────────────────
export const useSimulateWebhook = (orderId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => simulateWebhook(reference),
    onSuccess: () => {
      toast.success("Webhook simulated! Refreshing order status...");
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (error: Error) => {
      toast.error(`Simulation failed: ${error.message}`);
    },
  });
};

// ─── Update Order Status (Admin Only) ─────────────────────────────────────
export const useUpdateOrderStatus = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) => updateOrderStatus(orderId, status),
    onMutate: async (newStatus) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["order", orderId] });
      const previous = queryClient.getQueryData(["order", orderId]);
      queryClient.setQueryData(["order", orderId], (old: any) =>
        old ? { ...old, status: newStatus } : old
      );
      return { previous };
    },
    onError: (_err, _newStatus, context) => {
      queryClient.setQueryData(["order", orderId], context?.previous);
      toast.error("Failed to update order status.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated.");
    },
  });
};
