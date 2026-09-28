import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, WeightOption } from "@/core/api";
import { toast } from "react-toastify";

export interface CartSelection {
  weight?: WeightOption;
  part?: string;
}

interface CartItem extends Product {
  quantity: number;
  cartId: string;
  /** Display label, e.g. "2kg · Hind leg". */
  selectedOption?: string;
  weightOption?: string;
  part?: string;
  /** Stock one of this line uses, in the product's stock unit. */
  stockUnits: number;
  // `price` (from Product) is overridden with the chosen size's price.
}

/** Stock a product's lines already hold in the cart, in its stock unit. */
export const stockInCart = (items: CartItem[], productId: string) =>
  items.filter((i) => i.id === productId).reduce((n, i) => n + i.quantity * i.stockUnits, 0);

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, selection?: CartSelection, quantity?: number) => void;
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
      addItem: (product, selection = {}, quantity = 1) => {
        const { weight, part } = selection;
        const option = [weight?.label, part].filter(Boolean).join(" · ") || undefined;
        const cartId = option ? `${product.id}-${option}` : product.id.toString();
        const items = get().items;
        const existingItem = items.find((item) => item.cartId === cartId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.cartId === cartId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...product,
                price: weight?.price ?? product.price,
                quantity,
                cartId,
                selectedOption: option,
                weightOption: weight?.label,
                part,
                stockUnits: weight?.stock_units ?? 1,
              },
            ],
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
      // v1: lines carry their size's own price and stock usage. Carts saved
      // before that priced every size at the base price, so start them fresh
      // rather than show totals checkout would disagree with.
      version: 1,
      migrate: () => ({ items: [] }) as unknown as CartStore,
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
