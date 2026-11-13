"use client";

import { useState } from "react";

import AddToCartButton from "components/add-to-cart-button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { resolveCartItemPricing } from "lib/cart-pricing";
import { formatUsd, formatUsdShort } from "lib/price";
import { cn } from "lib/utils";

type Props = {
  slug: string;
  kind: "product" | "procedure";
  pricingMode: "fixed" | "quantity" | "increment_credit";
  unitAmountCents: number;
  quantityLabel: string;
  minQuantity: number;
  maxQuantity: number;
  quantityInputLabel?: string;
  showSubtotal?: boolean;
  className?: string;
  inputClassName?: string;
};

const clampQuantity = (value: number, minQuantity: number, maxQuantity: number) => {
  if (!Number.isFinite(value)) return minQuantity;
  return Math.min(Math.max(Math.floor(value), minQuantity), maxQuantity);
};

const stepButtonClass =
  "flex h-11 w-11 items-center justify-center text-lg text-base-content transition-colors hover:bg-base-200 focus-visible:relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:text-base-content/30 disabled:hover:bg-transparent motion-reduce:transition-none";

/**
 * Quantity stepper, live total and a full-width Add to Cart button, stacked for the booking card.
 * Quantity is clamped to the catalog min/max; pricing comes from resolveCartItemPricing (same math as the cart).
 */
export default function CatalogAddToCartControl({
  slug,
  kind,
  pricingMode,
  unitAmountCents,
  quantityLabel,
  minQuantity,
  maxQuantity,
  quantityInputLabel,
  showSubtotal = false,
  className,
  inputClassName,
}: Props) {
  const [quantity, setQuantity] = useState(minQuantity);
  const showQuantityInput = maxQuantity > 1 || pricingMode !== "fixed";
  const clampedQuantity = clampQuantity(quantity, minQuantity, maxQuantity);
  const catalogItem = getCatalogConfigBySlug(slug);
  const pricing = catalogItem ? resolveCartItemPricing(catalogItem, clampedQuantity) : null;
  const inputId = `${slug}-quantity`;
  const label = quantityInputLabel || `Quantity (${quantityLabel})`;
  const step = (delta: number) => setQuantity(clampQuantity(clampedQuantity + delta, minQuantity, maxQuantity));

  return (
    <div className={cn("space-y-4", className)}>
      {showQuantityInput && (
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-medium text-base-content" htmlFor={inputId}>
            {label}
          </label>
          <div className="inline-flex shrink-0 items-stretch overflow-hidden rounded-full border border-base-content/30 bg-base-100">
            <button
              type="button"
              className={stepButtonClass}
              onClick={() => step(-1)}
              disabled={clampedQuantity <= minQuantity}
              aria-controls={inputId}
              aria-label="Decrease quantity"
            >
              <span aria-hidden="true">−</span>
            </button>
            <input
              id={inputId}
              type="number"
              inputMode="numeric"
              min={minQuantity}
              max={maxQuantity}
              value={clampedQuantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className={cn(
                "w-12 border-x border-base-content/15 bg-transparent text-center text-base font-semibold tabular-nums text-base-content [appearance:textfield] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                inputClassName
              )}
            />
            <button
              type="button"
              className={stepButtonClass}
              onClick={() => step(1)}
              disabled={clampedQuantity >= maxQuantity}
              aria-controls={inputId}
              aria-label="Increase quantity"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      )}

      {showSubtotal && (
        <p
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-base-300 pt-4 text-sm text-base-content/70"
          aria-live="polite"
        >
          <span className="font-medium text-base-content">Total:</span>{" "}
          {pricing ? (
            <span>
              <span className="text-base font-semibold text-base-content">{formatUsdShort(pricing.cashLineTotalCents)}</span> cash ·{" "}
              {formatUsd(pricing.lineTotalCents)} card/online
            </span>
          ) : (
            <span className="font-semibold text-base-content">{formatUsd(clampedQuantity * unitAmountCents)}</span>
          )}
        </p>
      )}

      <AddToCartButton slug={slug} kind={kind} quantity={clampedQuantity} size="lg" className="w-full" />
    </div>
  );
}
