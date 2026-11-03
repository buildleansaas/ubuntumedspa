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
              "relative inline-flex h-11 w-11 items-center justify-center rounded-full border bg-base-100 text-base-content transition-colors duration-150 ease-out motion-reduce:transition-none",
              isCartOpen
                ? "border-primary/40 text-primary"
                : "border-base-300 hover:border-primary/40 hover:bg-base-200",
            ]
          : [
              "group inline-flex items-center gap-2 rounded-full border bg-base-100 px-4 py-2 text-left text-sm font-medium tracking-[0.01em] transition-colors duration-150 ease-out motion-reduce:transition-none",
              isCartOpen
                ? "border-primary/40 text-primary"
                : "border-base-300 text-base-content hover:border-primary/40",
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
              "inline-flex min-w-[1.75rem] items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-content"
            )}
          >
            {totalCount}
          </span>
        </>
      )}
    </button>
  );
}
