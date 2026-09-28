"use client";

import { useState } from "react";
import { Info, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DispatchPayload, OrderDelivery } from "@/core/api";

const SERVICES = ["Gokada", "Kwik", "Bolt", "Own rider", "Other"];

/** Remount (key) per open so the fields start from the current courier. */
export function DispatchDialog({ open, onOpenChange, delivery, saving, error, onSubmit }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  delivery: OrderDelivery | null;
  saving: boolean;
  error: string | null;
  onSubmit: (payload: DispatchPayload) => void;
}) {
  const editing = !!delivery?.courier_name;
  const [name, setName] = useState(delivery?.courier_name ?? "");
  const [phone, setPhone] = useState(delivery?.courier_phone ?? "");
  const [service, setService] = useState(delivery?.courier_service ?? "");
  const [reference, setReference] = useState(delivery?.courier_reference ?? "");
  const valid = name.trim().length >= 2 && phone.trim().length >= 7 && service.trim().length >= 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Update courier" : "Dispatch order"}</DialogTitle>
          <DialogDescription>
            {editing ? "Correct who's carrying this order. The customer's PIN stays the same." : "Who's taking this order out? It moves to Out for delivery."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid && !saving)
              onSubmit({ courier_name: name.trim(), courier_phone: phone.trim(), courier_service: service.trim(), courier_reference: reference.trim() || undefined });
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="courier-name">Courier name</Label>
              <Input id="courier-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ibrahim Sani" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courier-phone">Phone</Label>
              <Input id="courier-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0802 000 0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courier-service">Service</Label>
              <Input id="courier-service" list="courier-services" value={service} onChange={(e) => setService(e.target.value)} placeholder="Gokada" />
              <datalist id="courier-services">
                {SERVICES.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="courier-ref">
                Trip / tracking reference <span className="font-normal text-gray-400">(optional)</span>
              </Label>
              <Input id="courier-ref" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
          </div>
          {!editing && (
            <div className="flex gap-2.5 rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              A 4-digit delivery PIN is created and shown to the customer. The courier collects it on handover.
            </div>
          )}
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!valid || saving} className="bg-[#3f7a55] hover:bg-[#2d583d]">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Save courier" : "Dispatch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDeliveryDialog({ open, onOpenChange, saving, error, onSubmit }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  saving: boolean;
  error: string | null;
  onSubmit: (pin: string) => void;
}) {
  const [pin, setPin] = useState("");
  const valid = /^\d{4}$/.test(pin);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm delivery</DialogTitle>
          <DialogDescription>Enter the 4-digit PIN the courier collected from the customer.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid && !saving) onSubmit(pin);
          }}
        >
          <Input
            aria-label="Delivery PIN"
            autoFocus
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="••••"
            className={`h-16 text-center font-mono text-3xl tracking-[0.6em] ${error ? "border-red-300" : ""}`}
          />
          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!valid || saving} className="bg-[#3f7a55] hover:bg-[#2d583d]">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark delivered
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
