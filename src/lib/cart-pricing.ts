import type { CatalogItemConfig } from "config/commerce-catalog";

/**
 * Pure cart pricing helpers (no Mongo or Stripe imports) so checkout math is testable.
 *
 * unitAmountCents / lineTotalCents are card / online amounts: what Stripe checkout charges.
 * cashUnitAmountCents / cashLineTotalCents are the listed cash amounts. Increment-credit items
 * (Xeomin) credit the cash value to the account, not the card amount.
 */
export type CartItemPricing = {
  unitAmountCents: number;
  lineTotalCents: number;
  cashUnitAmountCents: number;
  cashLineTotalCents: number;
  usesQuantityPriceBreak: boolean;
};

export const resolveCartItemPricing = (
  catalogItem: Pick<CatalogItemConfig, "unitAmountCents" | "quantityPriceBreaks" | "cashAmountCents" | "cashQuantityPriceBreaks">,
  quantity: number
): CartItemPricing => {
  const cardBreak = catalogItem.quantityPriceBreaks?.[quantity];
  const cashBreak = catalogItem.cashQuantityPriceBreaks?.[quantity];

  if ((cardBreak === undefined) !== (cashBreak === undefined)) {
    throw new Error(`Card and cash quantity price breaks are out of sync for quantity ${quantity}.`);
  }

  const unitAmountCents = cardBreak ?? catalogItem.unitAmountCents;
  const cashUnitAmountCents = cashBreak ?? catalogItem.cashAmountCents;

  return {
    unitAmountCents,
    lineTotalCents: quantity * unitAmountCents,
    cashUnitAmountCents,
    cashLineTotalCents: quantity * cashUnitAmountCents,
    usesQuantityPriceBreak: cardBreak !== undefined,
  };
};

/**
 * Use a synced Stripe price ID only when the synced record was created for the current card amount.
 * Until `pnpm sync:stripe-catalog` runs, the Mongo records still point at the old (cash-amount) Stripe
 * prices; returning undefined makes checkout fall back to price_data with the current card amount.
 */
export const resolveSyncedStripePriceId = (
  catalogItem: Pick<CatalogItemConfig, "unitAmountCents" | "currency">,
  stripeRecord?: { stripePriceId?: string; unitAmountCents?: number; currency?: string } | null
) => {
  if (!stripeRecord?.stripePriceId) return undefined;
  if (stripeRecord.unitAmountCents !== catalogItem.unitAmountCents) return undefined;
  if (stripeRecord.currency && stripeRecord.currency !== catalogItem.currency) return undefined;
  return stripeRecord.stripePriceId;
};

/** Account credit for a paid increment-credit line: the cash value. Older orders without cash fields fall back. */
export const creditAmountCentsForItem = (item: { lineTotalCents: number; cashLineTotalCents?: number }) =>
  typeof item.cashLineTotalCents === "number" ? item.cashLineTotalCents : item.lineTotalCents;
