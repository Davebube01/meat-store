import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

export interface CartItem extends Product {
  quantity: number;
  selectedOption?: string;
  cartId: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, selectedOption?: string) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, selectedOption) => {
        const items = get().items;
        const cartId = selectedOption
          ? `${product.id}-${selectedOption}`
          : product.id;
        
        const existingItem = items.find((item) => item.cartId === cartId);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.cartId === cartId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { ...product, quantity: 1, selectedOption, cartId },
            ],
          });
        }
      },
      removeItem: (cartId) =>
        set({
          items: get().items.filter(
            (item) => (item.cartId || item.id) !== cartId
          ),
        }),
      updateQuantity: (cartId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            (item.cartId || item.id) === cartId
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () =>
        get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
    }),
    {
      name: 'meat-store-cart',
    }
  )
);
