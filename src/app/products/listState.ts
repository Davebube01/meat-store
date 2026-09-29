export const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price_asc", label: "Price: low to high" },
  { key: "price_desc", label: "Price: high to low" },
  { key: "newest", label: "Newest" },
  { key: "name", label: "Name A–Z" },
] as const;

/** The shop's filters. They live in the URL: ?category=&q=&sort=&stock=1 */
export interface ListState {
  category: string; // slug or "all"
  q: string;
  sort: (typeof SORTS)[number]["key"];
  inStock: boolean;
}
