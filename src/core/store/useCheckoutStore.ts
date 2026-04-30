import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface DeliveryInfo {
  deliveryDate: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  landmark: string;
  instructions: string;
  deliveryZone: string;
  deliveryFee: number;
  timeSlot: string;
}

interface CheckoutStore {
  step: number;
  isGuest: boolean;
  guestInfo: GuestInfo;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryInfo: DeliveryInfo;
  paymentMethod: 'paystack' | 'flutterwave' | 'cod';
  setStep: (step: number) => void;
  setGuest: (isGuest: boolean) => void;
  setGuestInfo: (info: GuestInfo) => void;
  setDeliveryMethod: (method: 'delivery' | 'pickup') => void;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  setPaymentMethod: (method: 'paystack' | 'flutterwave' | 'cod') => void;
  clearCheckout: () => void;
}

const initialGuestInfo: GuestInfo = {
  fullName: "",
  email: "",
  phone: "",
};

const initialDeliveryInfo: DeliveryInfo = {
  deliveryDate: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  landmark: "",
  instructions: "",
  deliveryZone: "",
  deliveryFee: 0,
  timeSlot: "",
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      step: 1,
      isGuest: false,
      guestInfo: initialGuestInfo,
      deliveryMethod: 'delivery',
      deliveryInfo: initialDeliveryInfo,
      paymentMethod: 'paystack',
      setStep: (step) => set({ step }),
      setGuest: (isGuest) => set({ isGuest }),
      setGuestInfo: (guestInfo) => set({ guestInfo }),
      setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
      setDeliveryInfo: (deliveryInfo) => set({ deliveryInfo }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      clearCheckout: () =>
        set({
          step: 1,
          isGuest: false,
          guestInfo: initialGuestInfo,
          deliveryMethod: 'delivery',
          deliveryInfo: initialDeliveryInfo,
          paymentMethod: 'paystack',
        }),
    }),
    {
      name: "meat-store-checkout",
    },
  ),
);
