import { toast } from "react-toastify";
import { useCart } from "@/core/store/useCart";
import type { UserOrder } from "@/core/api/user/orders";

const SEPARATOR = " · ";

/**
 * Put a past order's items back in the cart, with the same size and cut.
 * Prices and stock are whatever they are now: the cart page re-checks them
 * against the live catalogue, so nothing here needs to be trusted.
 * Returns how many lines were added.
 */
export function buyAgain(order: UserOrder): number {
  const { addItem } = useCart.getState();
  let added = 0;
  let skipped = 0;

  for (const item of order.items) {
    const product = item.product;
    if (!product || product.is_active === false || product.stock_quantity <= 0) {
      skipped++;
      continue;
    }
    const sizes = product.weight_options ?? [];
    const pieces = item.selected_option ? item.selected_option.split(SEPARATOR) : [];
    const weight = sizes.length ? sizes.find((s) => s.label === pieces[0]) ?? sizes[0] : undefined;
    const part = sizes.length ? pieces[1] : pieces[0];
    const validPart = part && product.parts?.includes(part) ? part : product.parts?.[0];
    addItem(product, { weight, part: validPart }, item.quantity);
    added++;
  }

  // One message instead of one per item.
  toast.dismiss();
  if (added) {
    toast.success(
      skipped
        ? `Added ${added} item${added === 1 ? "" : "s"} to your cart. ${skipped} ${skipped === 1 ? "isn't" : "aren't"} available right now.`
        : `Added ${added} item${added === 1 ? "" : "s"} to your cart.`,
    );
  } else {
    toast.error("None of these items are available right now.");
  }
  return added;
}
