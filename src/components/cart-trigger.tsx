"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "components/cart-provider";
import { cn } from "lib/utils";

export default function CartTrigger() {
  const { totalCount, openCart, isCartOpen } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart with ${totalCount} ${totalCount === 1 ? "item" : "items"}`}
      className={cn(
        "group mx-2 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-left text-sm font-medium shadow-sm transition-colors duration-150 ease-out motion-reduce:transition-none",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
        isCartOpen
          ? "border-primary/20 bg-base-100 text-primary"
          : "border-primary/80 bg-primary text-primary-content hover:border-primary/20 hover:bg-base-100 hover:text-primary"
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      <span>Cart</span>
      <span
        className={cn(
          "inline-flex min-w-[1.75rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors duration-150",
          isCartOpen
            ? "bg-primary/10 text-primary"
            : "bg-white/20 text-primary-content group-hover:bg-primary/10 group-hover:text-primary"
        )}
      >
        {totalCount}
      </span>
    </button>
  );
}
