import Stripe from "stripe";

import type { CartItemInput, ResolvedCartItem } from "lib/catalog";
import { createPendingOrder, markOrderSession } from "lib/orders";
import { getStripe } from "lib/stripe";

const buildStripeLineItem = (item: ResolvedCartItem): Stripe.Checkout.SessionCreateParams.LineItem => {
  if (item.stripePriceId) {
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

export const createCheckoutSession = async ({
  items,
  origin,
}: {
  items: CartItemInput[];
  origin: string;
}) => {
  const order = await createPendingOrder(items);
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_creation: "always",
    phone_number_collection: { enabled: true },
    line_items: order.items.map(buildStripeLineItem),
    success_url: `${origin}/checkout/success?order=${order.publicToken}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: {
      orderId: order.orderId,
      publicToken: order.publicToken,
      requiresScheduling: order.requiresScheduling ? "true" : "false",
      itemSlugs: order.items.map((item) => item.slug).join(","),
    },
    payment_intent_data: {
      metadata: {
        orderId: order.orderId,
        publicToken: order.publicToken,
      },
    },
  });

  await markOrderSession(order.orderId, session.id);

  return {
    order,
    session,
  };
};
