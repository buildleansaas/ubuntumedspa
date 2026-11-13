"use client";

import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useCart } from "components/cart-provider";
import { cn } from "lib/utils";

const preloadCartDrawer = () => {
  void import("components/cart-drawer");
};

interface CartTriggerProps {
  mode?: "default" | "compact";
  className?: string;
}

export default function CartTrigger({ mode = "default", className }: CartTriggerProps) {
  const { totalCount, openCart, isCartOpen, hydrated } = useCart();
  const isCompact = mode === "compact";
  // A small bump on the count when an item is added. Not on page load (the saved cart arriving is not an add).
  const [bump, setBump] = useState(0);
  const previousCount = useRef<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (previousCount.current !== null && totalCount > previousCount.current) setBump((value) => value + 1);
    previousCount.current = totalCount;
  }, [hydrated, totalCount]);

  return (
    <button
      type="button"
      onClick={openCart}
      // Fetch the drawer code on hover or focus, so the first open slides in without waiting on the network.
      onPointerEnter={preloadCartDrawer}
      onFocus={preloadCartDrawer}
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
          <span
            key={bump}
            className={cn(
              "absolute -right-1 -top-1 inline-flex h-[1.2rem] min-w-[1.2rem] items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold leading-none text-error-content",
              bump > 0 && "cart-count-bump"
            )}
          >
            {totalCount}
          </span>
        ) : null
      ) : (
        <>
          <span>Cart</span>
          <span
            key={bump}
            className={cn(
              "inline-flex min-w-[1.75rem] items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-content",
              bump > 0 && "cart-count-bump"
            )}
          >
            {totalCount}
          </span>
        </>
      )}
    </button>
  );
}
