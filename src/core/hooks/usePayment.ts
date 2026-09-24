"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify"
import { initializePayment, simulateWebhook, InitializePaymentPayload } from "@/core/api/user/payments";
import { getUserOrderById, OrderStatus } from "@/core/api/user/orders";
import { dispatchOrder, DispatchPayload, confirmDelivery, updateAdminOrderStatus, cancelAdminOrder } from "@/core/api/admin/orders";

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

// ─── Dispatch: Assign Courier (Admin Only) ─────────────────────────────────
export const useDispatchOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DispatchPayload) => dispatchOrder(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Courier assigned.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign courier.");
    },
  });
};

// ─── Update Order Status (Admin Only) ─────────────────────────────────────
export const useUpdateOrderStatus = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) => updateAdminOrderStatus(orderId, status),
    onMutate: async (newStatus) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["order", orderId] });
      const previous = queryClient.getQueryData(["order", orderId]);
      queryClient.setQueryData(["order", orderId], (old: any) =>
        old ? { ...old, status: newStatus } : old
      );
      return { previous };
    },
    onError: (error: Error, _newStatus, context) => {
      queryClient.setQueryData(["order", orderId], context?.previous);
      toast.error(error.message || "Failed to update order status.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated.");
    },
  });
};

// ─── Cancel Order with a reason (Admin Only) ───────────────────────────────
export const useCancelAdminOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => cancelAdminOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order cancelled.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel order.");
    },
  });
};

// ─── Confirm Delivery with PIN (Admin Only) ────────────────────────────────
export const useConfirmDelivery = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pin: string) => confirmDelivery(orderId, pin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Delivery confirmed.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to confirm delivery.");
    },
  });
};
