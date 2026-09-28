import { WeightOption } from "@/core/api";

/** Inputs are kept as strings while editing so fields can be cleared. */
export interface SizeRow {
  label: string;
  price: string;
  stockUnits: string;
}

export const toSizeRows = (options: WeightOption[] = []): SizeRow[] =>
  options.map((o) => ({ label: o.label, price: String(o.price), stockUnits: String(o.stock_units) }));

/** Returns the options, or an error message for the first invalid row. */
export function parseSizeRows(rows: SizeRow[]): WeightOption[] | string {
  const options: WeightOption[] = [];
  for (const row of rows) {
    const label = row.label.trim();
    const price = parseFloat(row.price);
    const stockUnits = parseFloat(row.stockUnits);
    if (!label) return "Every size needs a label.";
    if (!(price > 0)) return `Set a price for ${label}.`;
    if (!(stockUnits > 0)) return `Set how much stock ${label} uses.`;
    options.push({ label, price, stock_units: stockUnits });
  }
  const labels = options.map((o) => o.label.toLowerCase());
  if (new Set(labels).size !== labels.length) return "Each size needs a different label.";
  return options;
}

// "2kg" → 2, "500g" → 0.5: a sensible stock default for cuts stocked in kg.
export const guessKg = (label: string): string | undefined => {
  const m = label.trim().match(/^(\d+(?:\.\d+)?)\s*(kg|g)\b/i);
  if (!m) return undefined;
  const kg = m[2].toLowerCase() === "kg" ? parseFloat(m[1]) : parseFloat(m[1]) / 1000;
  return String(kg);
};
