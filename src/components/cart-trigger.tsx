"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "components/cart-provider";
import { cn } from "lib/utils";

interface CartTriggerProps {
  mode?: "default" | "compact";
  className?: string;
}

export default function CartTrigger({ mode = "default", className }: CartTriggerProps) {
  const { totalCount, openCart, isCartOpen } = useCart();
  const isCompact = mode === "compact";

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart with ${totalCount} ${totalCount === 1 ? "item" : "items"}`}
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
        isCompact
          ? [
              "relative inline-flex h-10 w-10 items-center justify-center rounded-full border bg-base-100 text-base-content shadow-sm transition-colors duration-150 ease-out motion-reduce:transition-none",
              isCartOpen
                ? "border-primary/25 text-primary"
                : "border-base-300 hover:border-base-content/15 hover:bg-base-200",
            ]
          : [
              "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-left text-sm font-medium shadow-sm transition-colors duration-150 ease-out motion-reduce:transition-none",
              isCartOpen
                ? "border-primary/20 bg-base-100 text-primary"
                : "border-primary/80 bg-primary text-primary-content hover:border-primary/20 hover:bg-base-100 hover:text-primary",
            ],
        className
      )}
    >
      <ShoppingCart className={cn(isCompact ? "h-[1.05rem] w-[1.05rem]" : "h-4 w-4")} />
      {isCompact ? (
        totalCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-[1.2rem] min-w-[1.2rem] items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold leading-none text-error-content">
            {totalCount}
          </span>
        ) : null
      ) : (
        <>
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
        </>
      )}
    </button>
  );
}
