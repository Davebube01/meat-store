import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './useCart';

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    email: string;
    date: string;
    status: 'placed' | 'confirmed' | 'prepping' | 'quality_check' | 'out_for_delivery' | 'delivered';
}

interface OrderState {
    currentOrder: Order | null;
    setOrder: (order: Order) => void;
    clearOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set) => ({
            currentOrder: null,
            setOrder: (order) => set({ currentOrder: order }),
            clearOrder: () => set({ currentOrder: null }),
        }),
        {
            name: 'meat-store-order',
        }
    )
);
