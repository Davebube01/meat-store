import { CartItem } from "@/store/useCart";
import { Customer, customers } from "./customers";

export type OrderStatus = 'placed' | 'confirmed' | 'prepping' | 'quality_check' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  shippingAddress: string;
}

// Helper to generate some dummy cart items
const dummyItems: CartItem[] = [
  {
    id: "1",
    name: "Full Goat (Live)",
    price: 45000,
    quantity: 1,
    selectedOption: "Full",
    description: "A healthy, full-sized live goat.",
    imageUrl: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80",
    slug: "full-goat-live",
    category: "full",
    weightOptions: ["Full"],
    cartId: "1-Full"
  },
  {
    id: "3",
    name: "Goat Leg (Rear)",
    price: 5000,
    quantity: 2,
    selectedOption: "1 leg",
    description: "Meaty rear leg.",
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80",
    slug: "goat-leg-rear",
    category: "part",
    weightOptions: ["1 leg"],
    cartId: "3-1 leg"
  }
];

export const orders: Order[] = [
  {
    id: "ORD-001",
    customerId: "CUST-001",
    items: [dummyItems[0]],
    total: 45000,
    status: "placed",
    date: "2024-02-20T10:00:00Z",
    paymentMethod: "Bank Transfer",
    shippingAddress: "123 Lekki Phase 1, Lagos",
  },
  {
    id: "ORD-002",
    customerId: "CUST-002",
    items: [dummyItems[1]],
    total: 10000,
    status: "prepping",
    date: "2024-02-19T14:30:00Z",
    paymentMethod: "Card",
    shippingAddress: "45 Victoria Island, Lagos",
  },
  {
    id: "ORD-003",
    customerId: "CUST-001",
    items: dummyItems,
    total: 55000,
    status: "delivered",
    date: "2024-02-15T09:15:00Z",
    paymentMethod: "Bank Transfer",
    shippingAddress: "123 Lekki Phase 1, Lagos",
  },
  {
    id: "ORD-004",
    customerId: "CUST-003",
    items: [dummyItems[0]],
    total: 45000,
    status: "cancelled",
    date: "2024-02-10T16:45:00Z",
    paymentMethod: "Card",
    shippingAddress: "78 Ikeja GRA, Lagos",
  },
];
