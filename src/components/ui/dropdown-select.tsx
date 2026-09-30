"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
  id?: string;
}

// Radix's <Select.Item> can't take value="" (it uses "" internally to mean
// "cleared"), but several filters in this app use "" as their "no filter /
// show all" state. This sentinel lets callers keep using "" exactly as they
// do with a native <select>, without knowing about the Radix restriction.
const EMPTY = "__all__";

/**
 * App-wide styled dropdown — drop-in replacement for a native <select> with
 * the same value/onChange-shaped API, so callers just swap the element and
 * pass an options array instead of <option> children.
 */
export function DropdownSelect({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  className,
  contentClassName,
  id,
  ...aria
}: DropdownSelectProps) {
  return (
    <Select
      value={value === "" ? EMPTY : value}
      onValueChange={(v) => onValueChange(v === EMPTY ? "" : v)}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        aria-label={aria["aria-label"]}
        className={cn(
          "h-9 w-full justify-between rounded-lg border-gray-200 bg-white px-3 text-sm font-normal text-gray-700 shadow-none hover:bg-gray-50 focus-visible:border-[#3f7a55] focus-visible:ring-[#3f7a55]/20 data-[placeholder]:text-gray-700",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {options.map((o) => (
          <SelectItem key={o.value === "" ? EMPTY : o.value} value={o.value === "" ? EMPTY : o.value} disabled={o.disabled}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
