"use client";

import { useState } from "react";

import AddToCartButton from "components/add-to-cart-button";
import type { GiftCardTheme } from "config/gift-card-themes";
import { cardPriceLabel, formatUsdShort } from "lib/price";

type Props = {
  theme: GiftCardTheme;
  faceValuesCents: readonly number[];
  slugs: Record<number, string>;
  defaultCents: number;
};

/** Pick an amount, see the cash value and card price, add it to the cart. Prices come from lib/price. */
export default function GiftCardAmountPicker({ theme, faceValuesCents, slugs, defaultCents }: Props) {
  const [selected, setSelected] = useState(defaultCents);
  const { colors } = theme;

  return (
    <div className="w-full">
      <fieldset>
        <legend className="sr-only">Gift card amount</legend>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {faceValuesCents.map((cents) => {
            const active = cents === selected;
            return (
              <label
                key={cents}
                className="flex min-h-12 cursor-pointer items-center justify-center rounded-full border text-lg font-semibold transition-colors focus-within:ring-2 focus-within:ring-offset-2 motion-reduce:transition-none"
                style={{
                  borderColor: active ? colors.accent : `${colors.accent}66`,
                  backgroundColor: active ? colors.accent : "transparent",
                  color: active ? colors.accentText : colors.text,
                }}
              >
                <input
                  type="radio"
                  name="gift-card-amount"
                  value={cents}
                  checked={active}
                  onChange={() => setSelected(cents)}
                  className="sr-only"
                />
                {formatUsdShort(cents)}
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="mt-5 text-center text-base" style={{ color: colors.mutedText }} data-gift-card-price>
        Worth {formatUsdShort(selected)} · {cardPriceLabel(selected)} online by card
      </p>

      <AddToCartButton
        slug={slugs[selected]}
        kind="product"
        label={`Add ${formatUsdShort(selected)} gift card to cart`}
        className="mt-4 h-14 w-full rounded-full text-lg font-semibold"
        style={{ backgroundColor: colors.accent, color: colors.accentText, border: "none" }}
      />
    </div>
  );
}
