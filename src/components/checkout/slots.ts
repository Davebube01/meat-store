// Delivery dates and 1-hour slots. Mon–Sat 08:00–19:00, Sun 10:00–16:00;
// today's slots need at least an hour's notice (the current and next hour
// are closed).

export const BOOKING_DAYS = 14;

export function bookingDates(from = new Date()): Date[] {
  return Array.from({ length: BOOKING_DAYS }, (_, i) => {
    const d = new Date(from);
    d.setDate(from.getDate() + i);
    return d;
  });
}

export interface Slot {
  text: string; // "14:00 - 15:00", the format orders store
  closed: boolean;
}

export function slotsFor(dateIso: string, now = new Date()): Slot[] {
  if (!dateIso) return [];
  const day = new Date(dateIso);
  const sunday = day.getDay() === 0;
  const [start, end] = sunday ? [10, 16] : [8, 19];
  const isToday = day.toDateString() === now.toDateString();
  const slots: Slot[] = [];
  for (let h = start; h < end; h++) {
    const text = `${String(h).padStart(2, "0")}:00 - ${String(h + 1).padStart(2, "0")}:00`;
    slots.push({ text, closed: isToday && h <= now.getHours() + 1 });
  }
  return slots;
}

export const hasOpenSlot = (dateIso: string, now = new Date()) => slotsFor(dateIso, now).some((s) => !s.closed);

export function dayLabel(d: Date, now = new Date()): string {
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-NG", { weekday: "short" });
}

export const longDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" }) : "";
