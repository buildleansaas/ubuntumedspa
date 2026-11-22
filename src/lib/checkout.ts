import type { CartItemInput } from "lib/catalog";
import { createPendingOrder, markOrderSession } from "lib/orders";
import { isGiftCardItem } from "lib/gift-card-rules";
import { getStripe } from "lib/stripe";
import { buildStripeLineItem } from "lib/stripe-line-item";

export const createCheckoutSession = async ({
  items,
  origin,
  affiliate,
}: {
  items: CartItemInput[];
  origin: string;
  affiliate?: {
    affiliateId?: string;
    affiliateCode?: string;
    affiliateName?: string;
  };
}) => {
  const order = await createPendingOrder(items, affiliate);
  const stripe = getStripe();
  const hasGiftCards = order.items.some(isGiftCardItem);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_creation: "always",
    phone_number_collection: { enabled: true },
    // Gift cards: who it's for and a note for the card. Cards only (no buy-now-pay-later) for gift card orders.
    ...(hasGiftCards
      ? {
          payment_method_types: ["card" as const],
          custom_fields: [
            {
              key: "gift_recipient",
              label: { type: "custom" as const, custom: "Gift card is for (name)" },
              type: "text" as const,
              optional: true,
              text: { maximum_length: 60 },
            },
            {
              key: "gift_message",
              label: { type: "custom" as const, custom: "Message on the gift card" },
              type: "text" as const,
              optional: true,
              text: { maximum_length: 200 },
            },
          ],
        }
      : {}),
    line_items: order.items.map(buildStripeLineItem),
    success_url: `${origin}/checkout/success?order=${order.publicToken}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: {
      orderId: order.orderId,
      publicToken: order.publicToken,
      requiresScheduling: order.requiresScheduling ? "true" : "false",
      itemSlugs: order.items.map((item) => item.slug).join(","),
      ...(order.affiliateId ? { affiliateId: order.affiliateId } : {}),
      ...(order.affiliateCode ? { affiliateCode: order.affiliateCode } : {}),
      ...(order.affiliateName ? { affiliateName: order.affiliateName } : {}),
    },
    payment_intent_data: {
      metadata: {
        orderId: order.orderId,
        publicToken: order.publicToken,
        ...(order.affiliateId ? { affiliateId: order.affiliateId } : {}),
        ...(order.affiliateCode ? { affiliateCode: order.affiliateCode } : {}),
        ...(order.affiliateName ? { affiliateName: order.affiliateName } : {}),
      },
    },
  });

  await markOrderSession(order.orderId, session.id);

  return {
    order,
    session,
  };
};
