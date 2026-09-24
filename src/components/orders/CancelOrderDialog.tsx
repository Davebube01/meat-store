"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reasons: string[];
  title?: string;
  description?: string;
  // Resolve on success (the dialog closes); throw to keep it open and show the message.
  onConfirm: (reason: string) => Promise<void>;
}

const MAX_DETAILS = 200;

export function CancelOrderDialog({
  open,
  onOpenChange,
  reasons,
  title = "Cancel this order?",
  description = "Please tell us why. This can't be undone.",
  onConfirm,
}: CancelOrderDialogProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start fresh each time it opens.
  useEffect(() => {
    if (open) {
      setChoice(null);
      setDetails("");
      setError(null);
    }
  }, [open]);

  const isOther = choice === "Other";
  const trimmed = details.trim();

  const handleConfirm = async () => {
    if (!choice) {
      setError("Please choose a reason.");
      return;
    }
    if (isOther && trimmed.length < 3) {
      setError("Please tell us a little more.");
      return;
    }

    // "Other" is only ever the details; a preset keeps its label, with any extra note appended.
    const reason = isOther ? trimmed : trimmed ? `${choice}: ${trimmed}` : choice;

    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(reason);
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message || "Couldn't cancel the order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div role="radiogroup" aria-label="Reason for cancelling" className="space-y-2">
          {reasons.map((reason) => (
            <button
              key={reason}
              type="button"
              role="radio"
              aria-checked={choice === reason}
              onClick={() => {
                setChoice(reason);
                setError(null);
              }}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                choice === reason
                  ? "border-green-700 bg-green-50 text-gray-900"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              )}
            >
              <span
                className={cn(
                  "h-4 w-4 shrink-0 rounded-full border-2",
                  choice === reason ? "border-green-700 bg-green-700 ring-2 ring-green-700/20 ring-offset-1" : "border-gray-300"
                )}
              />
              {reason}
            </button>
          ))}
        </div>

        {choice && (
          <div className="space-y-1.5">
            <label htmlFor="cancel-details" className="text-sm font-medium text-gray-700">
              {isOther ? "Tell us more" : "Anything else we should know?"}
              {!isOther && <span className="text-gray-400 font-normal"> (optional)</span>}
            </label>
            <Textarea
              id="cancel-details"
              value={details}
              onChange={(e) => {
                setDetails(e.target.value.slice(0, MAX_DETAILS));
                setError(null);
              }}
              rows={3}
              className="resize-none"
              placeholder={isOther ? "Your reason" : "Add a note"}
            />
            <p className="text-xs text-gray-400 text-right">
              {details.length}/{MAX_DETAILS}
            </p>
          </div>
        )}

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Keep order
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
