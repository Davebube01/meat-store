export * from "./client";
export * from "./user/auth";
export * from "./user/products";
export * from "./user/categories";
export * from "./admin/auth";
export * from "./admin/products";
export * from "./admin/categories";
export * from "./admin/upload";
export * from "./admin/customers";
// Admin orders — explicit re-exports to avoid collision with user/orders
export { getOrders, getOrderById, updateOrderStatus, updateAdminOrderStatus } from "./admin/orders";
export type { Order, OrderItem, AdminOrderStatus, OrderStatus } from "./admin/orders";
// User orders
export * from "./user/orders";
