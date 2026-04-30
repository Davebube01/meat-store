"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCheckoutStore } from "@/core/store/useCheckoutStore";
import { SignInModal } from "../SignInModal";

interface GuestLoginPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuestLoginPrompt({
  open,
  onOpenChange,
}: GuestLoginPromptProps) {
  const setGuest = useCheckoutStore((state) => state.setGuest);

  const handleGuestCheckout = () => {
    setGuest(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout Options</DialogTitle>
          <DialogDescription>
            Choose how you would like to proceed with your order.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <SignInModal>
            <Button className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold" size="lg">
              Sign In to Account
            </Button>
          </SignInModal>
          <div className="text-center text-sm text-gray-500">
            Earn points and track your history.{" "}
            <a href="/login?redirect=/checkout" className="text-green-700 font-bold hover:underline">
              Sign up
            </a>
          </div>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground font-bold">
                Or
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full h-12 border-green-700 text-green-700 font-bold hover:bg-green-50"
            size="lg"
            onClick={handleGuestCheckout}
          >
            Continue as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
