"use client";

import { useState } from "react";

import AddToCartButton from "components/add-to-cart-button";
import { formatUsd } from "lib/price";
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

  return (
    <div className={cn("flex flex-wrap items-end gap-3", className)}>
      {showQuantityInput && (
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor={`${slug}-quantity`}>
            {quantityInputLabel || `Quantity (${quantityLabel})`}
          </label>
          <input
            id={`${slug}-quantity`}
            type="number"
            min={minQuantity}
            max={maxQuantity}
            value={clampedQuantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className={cn("w-24 rounded-md border border-base-300 bg-base-100 px-3 py-2", inputClassName)}
          />
        </div>
      )}

      <div className="space-y-2">
        <AddToCartButton slug={slug} kind={kind} quantity={clampedQuantity} />
        {showSubtotal && (
          <p className="text-sm text-base-content/60">
            Total: <span className="font-semibold">{formatUsd(clampedQuantity * unitAmountCents)}</span>
          </p>
        )}
      </div>
    </div>
  );
}
