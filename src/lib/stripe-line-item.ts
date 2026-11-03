import type Stripe from "stripe";

import type { ResolvedCartItem } from "lib/catalog";

/**
 * Stripe Checkout line item for a resolved cart item. Uses the synced Stripe price only when resolveCart
 * kept it (its amount matches the current card price) and no quantity price break applies; otherwise
 * sends price_data with the card unit amount, so checkout always charges the advertised card price.
 */
export const buildStripeLineItem = (item: ResolvedCartItem): Stripe.Checkout.SessionCreateParams.LineItem => {
  if (item.stripePriceId && !item.usesQuantityPriceBreak) {
    return {
      price: item.stripePriceId,
      quantity: item.quantity,
    };
  }

  return {
    quantity: item.quantity,
    price_data: {
      currency: item.currency,
      unit_amount: item.unitAmountCents,
      product_data: {
        name: item.name,
        description: item.shortDescription,
        metadata: {
          slug: item.slug,
          kind: item.kind,
          pricingMode: item.pricingMode,
        },
      },
    },
  };
};
