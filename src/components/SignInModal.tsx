"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthForm, AuthTab } from "@/components/auth/AuthForm";

interface SignInModalProps {
  children?: React.ReactNode;
  defaultTab?: AuthTab;
}

export function SignInModal({ children, defaultTab = "login" }: SignInModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome</DialogTitle>
          <DialogDescription className="text-center">
            Sign in or create an account to order faster and track deliveries.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          {/* Remounted on each open so a previous attempt's errors don't linger. */}
          {open && <AuthForm defaultTab={defaultTab} onSuccess={() => setOpen(false)} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
