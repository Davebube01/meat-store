import { create } from 'zustand';

interface GuestInfo {
  email: string;
  phone: string;
}

interface DeliveryInfo {
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  instructions?: string;
  timeSlot?: string;
}

type PaymentMethod = 'paystack' | 'flutterwave' | 'cod';

interface CheckoutState {
  step: 1 | 2 | 3;
  isGuest: boolean;
  guestInfo: GuestInfo | null;
  deliveryInfo: DeliveryInfo | null;
  paymentMethod: PaymentMethod | null;
  
  setStep: (step: 1 | 2 | 3) => void;
  setIsGuest: (isGuest: boolean) => void;
  setGuestInfo: (info: GuestInfo) => void;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 1,
  isGuest: false,
  guestInfo: null,
  deliveryInfo: null,
  paymentMethod: null,

  setStep: (step) => set({ step }),
  setIsGuest: (isGuest) => set({ isGuest }),
  setGuestInfo: (info) => set({ guestInfo: info }),
  setDeliveryInfo: (info) => set({ deliveryInfo: info }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  resetCheckout: () => set({
    step: 1,
    isGuest: false,
    guestInfo: null,
    deliveryInfo: null,
    paymentMethod: null
  }),
}));
