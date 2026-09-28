export * from "./client";
export * from "./user/auth";
export * from "./user/products";
export * from "./user/categories";
export * from "./admin/auth";
export * from "./admin/products";
export * from "./admin/categories";
export * from "./admin/upload";
export * from "./admin/customers";
export * from "./admin/dashboard";
export * from "./admin/notifications";
export * from "./admin/inventory";
export * from "./admin/settings";
// Admin orders — explicit re-exports to avoid collision with user/orders
export { getOrders, getOrdersSummary, getOrderById, updateOrderStatus, updateAdminOrderStatus, dispatchOrder, confirmDelivery, cancelAdminOrder } from "./admin/orders";
export type { Order, OrderItem, OrderDelivery, DispatchPayload, AdminOrderStatus, OrderStatus, OrderView, OrderListParams, OrdersSummary } from "./admin/orders";
// User orders
export * from "./user/orders";
