import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  selectedOption?: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  date: string;
  shippingAddress?: string;
  paymentMethod?: string;
  items: OrderItem[];
}

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  updateOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  setOrder: (order: Order | null) => void; // Alias for compatibility
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      currentOrder: null,
      updateOrders: (orders) => set({ orders }),
      setCurrentOrder: (currentOrder) => set({ currentOrder }),
      setOrder: (currentOrder) => set({ currentOrder }),
      clearOrders: () => set({ orders: [], currentOrder: null }),
    }),
    {
      name: "meat-store-orders",
    },
  ),
);
