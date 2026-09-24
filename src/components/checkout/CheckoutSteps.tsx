"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import { useAuthStore } from "@/core/store/useAuthStore";
import { useCheckoutStore } from "@/core/store/useCheckoutStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Truck, CreditCard, User as UserIcon, Search, MapPin, ChevronDown, Calendar, Clock, Loader2, Store } from "lucide-react";
import { useCart } from "@/core/store/useCart";
import { useOrderStore } from "@/core/store/useOrderStore";
import { cn } from "@/lib/utils";
import { checkoutOrder } from "@/core/api/user/orders";
import { initializePayment, simulateWebhook } from "@/core/api/user/payments";
import { getDeliveryZones, DeliveryZone } from "@/core/api/user/delivery";

const isDev = process.env.NODE_ENV === "development";

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const DATES = generateDates();

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' });
};

const formatFullDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const generateTimeSlots = (dateString: string) => {
  if (!dateString) return [];
  const selectedDate = new Date(dateString);
  const isSunday = selectedDate.getDay() === 0;
  
  const startHour = isSunday ? 10 : 8;
  const endHour = isSunday ? 16 : 19;
  
  const slots = [];
  const now = new Date();
  const isToday = selectedDate.toDateString() === now.toDateString();
  const currentHour = now.getHours();
  
  for (let i = startHour; i < endHour; i++) {
    const startTimeStr = `${i.toString().padStart(2, '0')}:00`;
    const endTimeStr = `${(i + 1).toString().padStart(2, '0')}:00`;
    const text = `${startTimeStr} - ${endTimeStr}`;
    
    const closed = isToday && (i <= currentHour + 1); 
    
    slots.push({ text, closed });
  }
  return slots;
};

export function CheckoutSteps() {
  const router = useRouter();
  const {
    step,
    setStep,
    isGuest,
    guestInfo,
    setGuestInfo,
    deliveryInfo,
    setDeliveryInfo,
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
  } = useCheckoutStore();
  const { user, isAuthenticated } = useAuthStore();

  // Payment state
  const [isInitializing, setIsInitializing] = useState(false);
  const [paystackConfig, setPaystackConfig] = useState<any>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  // Step 1 State
  const [fullName, setFullName] = useState(guestInfo?.fullName || "");
  const [email, setEmail] = useState(guestInfo?.email || "");
  const [phone, setPhone] = useState(guestInfo?.phone || "");

  // Step 2 State
  const [deliveryDate, setDeliveryDate] = useState(deliveryInfo?.deliveryDate || "");
  const [address, setAddress] = useState(deliveryInfo?.address || "");
  const [apartment, setApartment] = useState(deliveryInfo?.apartment || "");
  const [city, setCity] = useState(deliveryInfo?.city || "");
  const [state, setState] = useState(deliveryInfo?.state || "");
  const [landmark, setLandmark] = useState(deliveryInfo?.landmark || "");
  const [instructions, setInstructions] = useState(deliveryInfo?.instructions || "");
  const [deliveryZone, setDeliveryZone] = useState(deliveryInfo?.deliveryZone || "");
  const [deliveryFee, setDeliveryFee] = useState(deliveryInfo?.deliveryFee || 0);
  const [timeSlot, setTimeSlot] = useState(deliveryInfo?.timeSlot || "");

  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [dateSearch, setDateSearch] = useState("");

  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);
  const [zoneSearch, setZoneSearch] = useState("");

  // Estimated fees, fetched from the backend — never hardcoded here, and
  // never trusted for billing (the server recomputes it from the zone id
  // at checkout). The customer pays this directly to the courier, in cash.
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  useEffect(() => {
    getDeliveryZones().then(setZones).catch(() => {
      toast.error("Couldn't load delivery zones. Please refresh and try again.");
    });
  }, []);

  const filteredZones = zones.filter(z => z.name.toLowerCase().includes(zoneSearch.toLowerCase()));
  
  const filteredDates = DATES.filter(d => {
    const formatted = formatDate(d);
    return formatted.toLowerCase().includes(dateSearch.toLowerCase()) || (d.toDateString() === new Date().toDateString() && "today".includes(dateSearch.toLowerCase()));
  });

  const timeSlots = generateTimeSlots(deliveryDate);

  // Pre-fill for auth user
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!email) setEmail(user.email || "");
      if (!fullName && user.full_name) setFullName(user.full_name);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [isAuthenticated, user]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGuestInfo({ fullName, email, phone });
    setStep(2);
  };

  // ── Paystack payment hook ─────────────────────────────────────────────────
  // The config holds publicKey/email/amount/reference.
  // Callbacks are passed at call-time via initializePaystack({ onSuccess, onClose }).
  const initializePaystack = usePaystackPayment(
    paystackConfig ?? { publicKey: "", email: "", amount: 0, reference: "" }
  );

  // When config is ready, fire the popup
  useEffect(() => {
    if (!paystackConfig || !pendingOrderId) return;
    initializePaystack({
      onSuccess: async () => {
        // Paystack can't reach localhost, so local dev fakes the webhook here.
        // In every other environment, the real signed webhook (already
        // fired by Paystack server-to-server) is what actually confirms the
        // order — the success page polls for that, it isn't taken on faith.
        if (isDev) {
          try {
            await simulateWebhook(paystackConfig.reference);
          } catch (_) {
            // Non-fatal — don't block the user from seeing the success page
          }
        }
        useCart.getState().clearCart();
        router.push(`/checkout/success?id=${pendingOrderId}&ref=${paystackConfig.reference}`);
      },
      onClose: () => {
        toast.error("Payment was cancelled.");
        setIsInitializing(false);
        setPaystackConfig(null);
        setPendingOrderId(null);
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paystackConfig, pendingOrderId]);

  // ── Place Order handler ──────────────────────────────────────────────────
  const handlePlaceOrder = useCallback(async () => {
    setIsInitializing(true);
    try {
      const cartItems = useCart.getState().items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        selected_option: item.selectedOption,
        price_at_time: item.price,
      }));

      // 1. Create the order
      const orderResult = await checkoutOrder({
        is_guest: isGuest,
        guest_info: guestInfo,
        delivery_info: deliveryMethod === 'delivery' ? deliveryInfo : undefined,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        items: cartItems,
      });

      useOrderStore.getState().setOrder(orderResult as any);

      // 2. If cash on delivery, go straight to success page
      if (paymentMethod === "cod") {
        useCart.getState().clearCart();
        router.push(`/checkout/success?id=${orderResult.id}`);
        return;
      }

      // 3. Initialize Paystack transaction
      const contactEmail = isAuthenticated && user?.email
        ? user.email
        : guestInfo?.email || "";

      const payInit = await initializePayment({
        email: contactEmail,
        order_id: orderResult.id,
      });

      setPendingOrderId(orderResult.id);

      // 4. Set config — the useEffect will fire the popup
      setPaystackConfig({
        publicKey: payInit.public_key,
        email: contactEmail,
        amount: Math.round(orderResult.total_amount * 100), // kobo
        reference: payInit.reference,
      });
    } catch (err) {
      toast.error("Failed to place order. " + (err as Error).message);
      setIsInitializing(false);
    }
  }, [isGuest, guestInfo, deliveryInfo, paymentMethod, isAuthenticated, user, router]);

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryMethod === 'delivery') {
      if (!deliveryDate) {
        alert("Please select a delivery date");
        return;
      }
      if (!timeSlot) {
        alert("Please select a delivery time slot");
        return;
      }
      if (!deliveryZone) {
        alert("Please select a delivery zone");
        return;
      }
    }
    setDeliveryInfo({ deliveryDate, address, apartment, city, state, landmark, instructions, deliveryZone, deliveryFee, timeSlot });
    setStep(3);
  };

  return (
    <div className="space-y-6">
      {/* Steps Indicator */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10" />
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "flex flex-col items-center bg-white px-2",
              s <= step ? "text-green-700" : "text-gray-400",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold mb-1 transition-colors",
                s < step
                  ? "bg-green-700 border-green-700 text-white"
                  : s === step
                    ? "border-green-700 text-green-700 bg-white"
                    : "border-gray-200 text-gray-400 bg-white",
              )}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            <span className="text-xs font-medium">
              {s === 1 ? "Contact" : s === 2 ? "Delivery" : "Payment"}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Contact Info */}
      <Card
        className={cn("transition-all", step !== 1 && "opacity-50 grayscale")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-green-700" />
            Contact Information
          </CardTitle>
        </CardHeader>
        {step === 1 && (
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-600 text-white"
              >
                Continue to Delivery
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Step 2: Delivery Details */}
      <Card
        className={cn("transition-all", step !== 2 && "opacity-50 grayscale")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-green-700" />
            Delivery Details
          </CardTitle>
        </CardHeader>
        {step === 2 && (
          <CardContent>
            <form onSubmit={handleDeliverySubmit} className="space-y-6">
              <div className="mb-6">
                {/* Plain buttons, not Radix's RadioGroup: its controlled
                    value prop and an internal hidden native radio input can
                    fall out of sync with external (zustand) state updates,
                    causing it to silently revert a just-made selection. This
                    is simpler and fully predictable — deliveryMethod is the
                    only source of truth, read directly on every render. */}
                <div role="radiogroup" aria-label="Delivery method" className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={deliveryMethod === "delivery"}
                    className={cn(
                      "flex items-center space-x-2 border p-4 rounded-md transition-colors cursor-pointer text-left",
                      deliveryMethod === "delivery" && "border-green-700 bg-green-50",
                    )}
                    onClick={() => setDeliveryMethod("delivery")}
                  >
                    <Truck className={cn("h-5 w-5", deliveryMethod === "delivery" ? "text-green-700" : "text-gray-400")} />
                    <span className="cursor-pointer font-medium">Instant Delivery</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={deliveryMethod === "pickup"}
                    className={cn(
                      "flex items-center space-x-2 border p-4 rounded-md transition-colors cursor-pointer text-left",
                      deliveryMethod === "pickup" && "border-green-700 bg-green-50",
                    )}
                    onClick={() => setDeliveryMethod("pickup")}
                  >
                    <Store className={cn("h-5 w-5", deliveryMethod === "pickup" ? "text-green-700" : "text-gray-400")} />
                    <span className="cursor-pointer font-medium">Store Pickup</span>
                  </button>
                </div>
              </div>

              {deliveryMethod === 'delivery' ? (
                <>
                  <div className="space-y-4 pb-6 border-b">
                    <div>
                      <h3 className="text-[17px] font-semibold flex items-center gap-2 text-gray-900 mb-1">
                        <span className="text-gray-600"></span> When do you need your order? <span className="text-red-500">*</span>
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">Select your preferred date and time for delivery</p>
                    </div>
                
                
                <div className="grid gap-2 relative z-20">
                  <div 
                    className={cn(
                        "flex items-center justify-between h-12 w-full rounded-md border text-sm ring-offset-background cursor-pointer px-4 transition-colors",
                        isDateDropdownOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-input bg-background hover:bg-gray-50"
                    )}
                    onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                  >
                    <div className="flex items-center gap-2">
                       <Calendar className="h-5 w-5 text-gray-400" />
                       <span className={deliveryDate ? "text-gray-900" : "text-gray-500"}>
                         {deliveryDate ? formatDate(new Date(deliveryDate)) : "Select delivery date"}
                       </span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </div>
                  
                  {isDateDropdownOpen && (
                    <div className="absolute w-full mt-14 bg-white border border-gray-200 rounded-xl shadow-lg top-0 flex flex-col overflow-hidden animate-in fade-in duration-200 z-50">
                       <div className="p-2 border-b sticky top-0 bg-white z-10 w-full">
                          <div className="flex items-center px-3 border border-blue-500 ring-1 ring-blue-100 rounded-lg">
                            <Search className="mr-2 h-4 w-4 shrink-0 text-blue-500" />
                            <input
                              className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
                              placeholder="Search dates (e.g., today, Friday, Dec 25)"
                              value={dateSearch}
                              onChange={(e) => setDateSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                       </div>
                       <div className="overflow-y-auto w-full" style={{ maxHeight: "240px" }}>
                          {filteredDates.length === 0 ? (
                             <div className="py-6 text-center text-sm text-gray-500">No date found.</div>
                          ) : (
                            filteredDates.map((d) => {
                              const isToday = d.toDateString() === new Date().toDateString();
                              return (
                                <div 
                                  key={d.toISOString()}
                                  className="relative flex flex-col w-full cursor-pointer select-none py-3 px-4 text-sm outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                  onClick={() => {
                                     setDeliveryDate(d.toISOString());
                                     setTimeSlot("");
                                     setIsDateDropdownOpen(false);
                                     setDateSearch("");
                                  }}
                                >
                                  <span className="font-semibold text-gray-900">
                                      {formatDate(d)}
                                  </span>
                                  {isToday && <span className="text-gray-500 text-xs mt-0.5">Today</span>}
                                </div>
                              );
                            })
                          )}
                       </div>
                    </div>
                  )}
                </div>

                {deliveryDate && (
                  <div className="bg-green-50/50 border border-green-200 rounded-md p-3 flex items-center gap-2 text-sm text-green-800 mt-2">
                     <Check className="h-4 w-4 bg-green-500 text-white rounded-sm p-0.5 shrink-0" />
                     <span>Selected: <strong>{formatFullDate(deliveryDate)}</strong></span>
                  </div>
                )}

                {deliveryDate && timeSlots.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-[15px] font-semibold flex items-center gap-2 text-gray-900 mb-4">
                      <Clock className="h-5 w-5 text-blue-500 shrink-0" /> 
                      Select Delivery Time for {formatDate(new Date(deliveryDate))}
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.text}
                          type="button"
                          disabled={slot.closed}
                          onClick={() => setTimeSlot(slot.text)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
                            slot.closed 
                              ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60" 
                              : timeSlot === slot.text
                                ? "border-green-500 bg-green-50 text-green-700" 
                                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-white"
                          )}
                        >
                          <span className="font-semibold">{slot.text}</span>
                          {slot.closed ? (
                            <span className="text-[11px] text-red-400 mt-1.5 uppercase tracking-wide font-medium">booking closed</span>
                          ) : (
                            <span className={cn("text-xs mt-1.5 font-medium", timeSlot === slot.text ? "text-green-600" : "text-gray-400")}>
                               {timeSlot === slot.text ? "Selected" : "Available"}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[#f8faff] p-4 rounded-xl border border-blue-50/50 space-y-3 mt-4">
                  <div className="flex items-center gap-2.5 text-sm">
                     <span className="font-semibold text-blue-500">Booking Window: Mar 19 - May 18, 2026</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                     <span><strong>Delivery Hours:</strong> Mon-Sat: 8:00AM - 7:00PM | Sunday: 10:00AM - 4:00PM</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                     <span><strong>Lead Time:</strong> Minimum 60 minutes from booking</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold flex items-center gap-2 text-gray-900 mb-4">
                  Delivery Address
                </h3>

                <div className="space-y-5">
                  <div className="grid gap-2">
                    <Label htmlFor="address">Street Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="address"
                      placeholder="Enter street address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. <span className="text-gray-400 font-normal ml-1"> (optional)</span></Label>
                    <Input
                      id="apartment"
                      placeholder="Apartment, suite, etc."
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="landmark">Landmark <span className="text-gray-400 font-normal ml-1"> (optional)</span></Label>
                    <Input
                      id="landmark"
                      placeholder="Nearby landmark"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="instructions">Delivery Instructions <span className="text-gray-400 font-normal ml-1"> (optional)</span></Label>
                    <Input
                      id="instructions"
                      placeholder="Gate code, building entrance, floor, special handling notes..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      maxLength={160}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Help our drivers find you and deliver your order smoothly</span>
                      <span>{instructions.length}/160</span>
                    </div>
                  </div>

                  <div className="grid gap-2 mt-2">
                    <Label htmlFor="deliveryZone" className="flex items-center gap-2 text-[15px] font-semibold text-gray-900">
                    Select Delivery Zone <span className="text-gray-900">*</span>
                    </Label>
                    <div className="relative">
                      <div 
                        className="flex items-center justify-between h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                        onClick={() => setIsZoneDropdownOpen(!isZoneDropdownOpen)}
                      >
                        <span className={deliveryZone ? "text-gray-900 font-medium" : "text-gray-500"}>
                           {deliveryZone ? zones.find(z => z.id === deliveryZone)?.name : "Search and select delivery zone..."}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </div>
                      
                      {isZoneDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl top-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                           <div className="flex items-center px-3 border-b sticky top-0 bg-white z-10 w-full">
                              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                              <input
                                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                                placeholder="Search delivery zones..."
                                value={zoneSearch}
                                onChange={(e) => setZoneSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                           </div>
                           <div className="overflow-y-auto w-full p-1" style={{ maxHeight: "240px" }}>
                              {filteredZones.length === 0 ? (
                                 <div className="py-6 text-center text-sm text-gray-500">No zone found.</div>
                              ) : (
                                filteredZones.map(zone => (
                                  <div 
                                    key={zone.id}
                                    className="relative flex w-full cursor-pointer select-none items-center rounded-md py-3 px-3 text-sm outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                    onClick={() => {
                                       setDeliveryZone(zone.id);
                                       setDeliveryFee(zone.estimated_fee);
                                       setIsZoneDropdownOpen(false);
                                       setZoneSearch("");
                                    }}
                                  >
                                    <MapPin className="mr-3 h-4 w-4 text-blue-500 shrink-0" />
                                    <span className="flex-1 font-medium text-gray-700">{zone.name}</span>
                                    <span className="ml-auto text-blue-600 font-medium px-2.5 py-1 bg-blue-50/50 rounded-full border border-blue-100 text-xs shadow-sm">
                                        Est. ₦{zone.estimated_fee.toLocaleString() + ".00"}
                                    </span>
                                  </div>
                                ))
                              )}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </>
              ) : (
                <div className="bg-green-50/50 border border-green-200 rounded-lg p-6 text-center space-y-2 mb-6">
                  <Store className="h-8 w-8 text-green-700 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Pickup at TerraEats Store</h3>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
                    Your order will be prepared and ready for pickup at our main store location. You will receive an email confirmation when it's ready.
                  </p>
                </div>
              )}
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-600 text-white"
                >
                  Continue to Payment
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Step 3: Payment */}
      <Card
        className={cn("transition-all", step !== 3 && "opacity-50 grayscale")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-700" />
            Payment
          </CardTitle>
        </CardHeader>
        {step === 3 && (
          <CardContent>
            <div className="space-y-4">
              <RadioGroup
                defaultValue="paystack"
                onValueChange={(v) => setPaymentMethod(v as any)}
              >
                <div
                  className={cn(
                    "flex items-center space-x-2 border p-4 rounded-md transition-colors",
                    paymentMethod === "paystack" &&
                      "border-green-700 bg-green-50",
                  )}
                >
                  <RadioGroupItem
                    value="paystack"
                    id="paystack"
                    className="data-[state=checked]:border-amber-900 data-[state=checked]:text-amber-900"
                  />
                  <Label htmlFor="paystack">Paystack</Label>
                </div>
                <div
                  className={cn(
                    "flex items-center space-x-2 border p-4 rounded-md transition-colors",
                    paymentMethod === "flutterwave" &&
                      "border-green-700 bg-green-50",
                  )}
                >
                  <RadioGroupItem
                    value="flutterwave"
                    id="flutterwave"
                    className="data-[state=checked]:border-green-700 data-[state=checked]:text-green-700"
                  />
                  <Label htmlFor="flutterwave">Flutterwave</Label>
                </div>
                <div
                  className={cn(
                    "flex items-center space-x-2 border p-4 rounded-md transition-colors",
                    paymentMethod === "cod" && "border-green-700 bg-green-50",
                  )}
                >
                  <RadioGroupItem
                    value="cod"
                    id="cod"
                    className="data-[state=checked]:border-green-700 data-[state=checked]:text-green-700"
                  />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={isInitializing}
                >
                  Back
                </Button>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-80"
                  disabled={isInitializing}
                  onClick={handlePlaceOrder}
                >
                  {isInitializing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {paymentMethod === "cod" ? "Placing Order..." : "Initializing Payment..."}
                    </span>
                  ) : (
                    paymentMethod === "cod" ? "Place Order" : "Pay with Paystack"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
