import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/core/api";
import { toast } from "react-toastify";

interface CartItem extends Product {
  quantity: number;
  cartId: string;
  selectedOption?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, option?: string) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  getCartTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, option) => {
        const cartId = option ? `${product.id}-${option}` : product.id.toString();
        const items = get().items;
        const existingItem = items.find((item) => item.cartId === cartId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.cartId === cartId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({
            items: [...items, { ...product, quantity: 1, cartId, selectedOption: option }],
          });
        }
        
        toast.success(`${product.name} added to cart`);
      },
      removeItem: (cartId) =>
        set({
          items: get().items.filter((item) => item.cartId !== cartId),
        }),
      updateQuantity: (cartId, quantity) =>
        set({
          items: get().items.map((item) =>
            item.cartId === cartId ? { ...item, quantity } : item,
          ),
        }),
      clearCart: () => set({ items: [] }),
      get totalItems() {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
      getCartTotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "meat-store-cart",
    },
  ),
);

// This store's automatic hydrate-on-creation doesn't reliably fire in this
// app's setup (Next.js + code-split client boundaries) — every consumer was
// seeing an empty cart on first read until something happened to trigger a
// rehydrate. Kick it off once, here, as early as the module loads in the
// browser, so every page (checkout, cart, the header badge) gets real data
// instead of a transient empty cart.
if (typeof window !== "undefined") {
  useCart.persist.rehydrate();
}
