"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { useCart } from "@/core/store/useCart";
import { checkCart, type CartCheckLine, type CartCheckResult } from "@/core/api/user/cartCheck";

// What we changed on the customer's behalf (new price, lowered quantity),
// per cart line, so the page and drawer can explain it.
const useNotices = create<{ notices: Record<string, string> }>(() => ({ notices: {} }));

/** Apply a check to the saved cart: take the live price, cap to what's in stock. */
function applyCheck(results: CartCheckResult[]) {
  const byKey = new Map(results.map((r) => [r.key, r]));
  const changed: Record<string, string> = {};
  useCart.setState((state) => ({
    items: state.items.map((item) => {
      const r = byKey.get(item.cartId);
      if (!r) return item;
      let next = item;
      if (r.unit_price !== null && r.unit_price !== item.price) {
        next = { ...next, price: r.unit_price };
        changed[item.cartId] = r.message ?? "Price updated.";
      }
      if (r.status === "reduced" && r.max_quantity > 0 && item.quantity > r.max_quantity) {
        next = { ...next, quantity: r.max_quantity };
        changed[item.cartId] = r.message ?? `Lowered to ${r.max_quantity}.`;
      }
      return next;
    }),
  }));
  if (Object.keys(changed).length) {
    useNotices.setState((s) => ({ notices: { ...s.notices, ...changed } }));
  }
}

/**
 * Keeps the saved cart honest: re-checks it against live prices and stock,
 * quietly applies new prices and lowers quantities that exceed stock, and
 * reports lines that can't be bought (sold out / no longer sold).
 */
export function useCartCheck(enabled = true) {
  const items = useCart((s) => s.items);
  const notices = useNotices((s) => s.notices);

  const payload: CartCheckLine[] = useMemo(
    () =>
      items.map((i) => ({
        key: i.cartId,
        product_id: i.id,
        weight_option: i.weightOption,
        part: i.part,
        quantity: i.quantity,
        unit_price: i.price,
      })),
    [items],
  );

  const query = useQuery({
    queryKey: ["cart-check", payload],
    queryFn: async () => {
      const results = await checkCart(payload);
      applyCheck(results); // changes the cart, which re-checks once and settles
      return results;
    },
    enabled: enabled && payload.length > 0,
    staleTime: 30_000,
    retry: 1,
  });

  const results = useMemo(() => new Map((query.data ?? []).map((r) => [r.key, r] as const)), [query.data]);
  const blocked = (query.data ?? []).filter(
    (r) => (r.status === "out_of_stock" || r.status === "unavailable") && items.some((i) => i.cartId === r.key),
  );

  return {
    /** Latest check result per cart line (by cartId). */
    results: results as Map<string, CartCheckResult>,
    /** Lines that must be removed before checkout. */
    blocked,
    notices,
    checking: query.isFetching,
    failed: query.isError,
  };
}
