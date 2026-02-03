"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { SignInModal } from "../SignInModal";

interface GuestLoginPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuestLoginPrompt({
  open,
  onOpenChange,
}: GuestLoginPromptProps) {
  const setIsGuest = useCheckoutStore((state) => state.setIsGuest);

  const handleGuestCheckout = () => {
    setIsGuest(true);
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
            <Button className="w-full" size="lg">
              Log In
            </Button>
          </SignInModal>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleGuestCheckout}
          >
            Checkout as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
