const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const wholeUsdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatUsd = (amountCents: number) => usdFormatter.format(amountCents / 100);

/** "$1,200" for whole dollars, "$1,236.15" otherwise. */
export const formatUsdShort = (amountCents: number) =>
  amountCents % 100 === 0 ? wholeUsdFormatter.format(amountCents / 100) : usdFormatter.format(amountCents / 100);

/**
 * Card / online pricing.
 *
 * The listed cash price is the source of truth. The card / online price (what Stripe checkout charges)
 * is derived so the clinic nets at least the cash price after Stripe's 2.9% + 30 cents. Cash is presented
 * to patients as the lower cash price, never as a card fee or surcharge.
 *
 * cardPriceCents(cash) = ceil((cash + 30) / (1 - 0.029)), computed in integer basis points so there is
 * no floating-point drift: ceil((cash + 30) * 10000 / 9710).
 */
export const STRIPE_PERCENT_FEE_BASIS_POINTS = 290; // 2.9%
export const STRIPE_FIXED_FEE_CENTS = 30;
const BASIS_POINTS = 10_000;

const assertWholeCents = (value: number, label: string) => {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative whole number of cents, got ${value}.`);
  }
};

export const cardPriceCents = (cashCents: number) => {
  assertWholeCents(cashCents, "cashCents");
  const numerator = (cashCents + STRIPE_FIXED_FEE_CENTS) * BASIS_POINTS;
  const denominator = BASIS_POINTS - STRIPE_PERCENT_FEE_BASIS_POINTS;
  // Integer ceiling division.
  return Math.floor((numerator + denominator - 1) / denominator);
};

/**
 * Per-unit card price for a cash quantity price break: the card price of the whole cash line,
 * spread over the units and rounded up (e.g. both ears $80 cash -> $82.70 card -> 4135 per ear).
 */
export const cardQuantityBreakUnitCents = (cashBreakUnitCents: number, quantity: number) => {
  assertWholeCents(cashBreakUnitCents, "cashBreakUnitCents");
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error(`quantity must be a positive whole number, got ${quantity}.`);
  }
  return Math.ceil(cardPriceCents(cashBreakUnitCents * quantity) / quantity);
};

/** Card line total checkout charges for a quantity price break (per-unit card break x quantity). */
export const cardQuantityBreakLineCents = (cashBreakUnitCents: number, quantity: number) =>
  cardQuantityBreakUnitCents(cashBreakUnitCents, quantity) * quantity;

/** Estimated Stripe fee on a single charge (2.9% rounded + 30 cents). Used by tests and sanity checks. */
export const estimatedStripeFeeCents = (chargeCents: number) =>
  Math.round((chargeCents * STRIPE_PERCENT_FEE_BASIS_POINTS) / BASIS_POINTS) + STRIPE_FIXED_FEE_CENTS;

/** "$45 cash · $46.66 card/online" (optional unit, e.g. "per treatment", goes after the cash price). Cash leads. */
export const cashCardLabel = (cashCents: number, unit?: string) =>
  `${formatUsdShort(cashCents)}${unit ? ` ${unit}` : ""} cash · ${formatUsdShort(cardPriceCents(cashCents))} card/online`;

/** "$45 per ear in cash or $46.66 online by card" for prose (optional unit after the cash price). Cash leads. */
export const cashCardProse = (cashCents: number, unit?: string) =>
  `${formatUsdShort(cashCents)}${unit ? ` ${unit}` : ""} in cash or ${formatUsdShort(cardPriceCents(cashCents))} online by card`;

/** Card price only, formatted, e.g. "$46.66". */
export const cardPriceLabel = (cashCents: number) => formatUsdShort(cardPriceCents(cashCents));

/** Card price as a schema.org Offer price string, e.g. "46.66". */
export const cardPriceSchemaValue = (cashCents: number) => (cardPriceCents(cashCents) / 100).toFixed(2);

export const CASH_CARD_NOTE =
  "Paying cash in the office? You pay the cash price. The card price applies online and to card payments in the office.";
