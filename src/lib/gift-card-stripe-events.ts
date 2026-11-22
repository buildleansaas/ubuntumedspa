import type Stripe from "stripe";

import { getGiftCardsForOrder, voidGiftCardsForOrder } from "lib/gift-cards";
import { type GiftCardRecord } from "lib/gift-card-rules";
import { getMailConfig, orderEmailsEnabled, sendMail } from "lib/mailer";
import { getDb } from "lib/mongodb";
import { getOrderById, getOrderByPaymentIntent, type OrderRecord } from "lib/orders";
import { getStripe } from "lib/stripe";
import { formatUsd, formatUsdShort } from "lib/price";

/**
 * Refunds and disputes on gift card orders (docs/gift-cards-plan.md, promise 7).
 * - A full refund or any new dispute voids every card on the order (and marks the order, so cards issued later are void).
 * - Every refund and dispute update emails the owner the order's codes once per Stripe object id.
 * - Charges that aren't site orders, or orders without gift cards, are ignored (the webhook still returns 200).
 */
const paymentIntentId = (value: string | { id: string } | null | undefined) =>
  typeof value === "string" ? value : value?.id || undefined;

const cardList = (cards: GiftCardRecord[]) =>
  cards.map((card) => `${formatUsdShort(card.faceValueCents)}: ${card.code} (${card.status === "void" ? "VOID" : "still active"})`);

/** Records that the owner was told about `objectId`; returns false when already recorded. */
const claimNotice = async (orderId: string, field: "refundNotifiedFor" | "disputeNotifiedFor", objectId: string) => {
  const result = await (await getDb())
    .collection<OrderRecord>("orders")
    .updateOne({ orderId, [field]: { $ne: objectId } }, { $addToSet: { [field]: objectId } });
  return result.modifiedCount === 1;
};

const releaseNotice = async (orderId: string, field: "refundNotifiedFor" | "disputeNotifiedFor", objectId: string) => {
  await (await getDb()).collection<OrderRecord>("orders").updateOne({ orderId }, { $pull: { [field]: objectId } });
};

const notifyOwner = async (
  order: OrderRecord,
  field: "refundNotifiedFor" | "disputeNotifiedFor",
  objectId: string,
  subject: string,
  lines: string[]
) => {
  if (!orderEmailsEnabled()) return;
  if (!(await claimNotice(order.orderId, field, objectId))) return;
  try {
    await sendMail({ to: getMailConfig().leadsTo, subject, text: lines.join("\n") });
  } catch (error) {
    await releaseNotice(order.orderId, field, objectId);
    throw error;
  }
};

const giftOrderFor = async (paymentIntent: string | undefined) => {
  if (!paymentIntent) return null;
  // Orders store the PaymentIntent id at their first sync; before that, fall back to the orderId checkout put on it.
  let order = await getOrderByPaymentIntent(paymentIntent);
  if (!order) {
    const intent = await getStripe().paymentIntents.retrieve(paymentIntent);
    const orderId = intent.metadata?.orderId;
    order = orderId ? await getOrderById(orderId) : null;
  }
  return order?.giftCardUnits ? order : null;
};

export const handleChargeRefunded = async (charge: Stripe.Charge) => {
  const order = await giftOrderFor(paymentIntentId(charge.payment_intent));
  if (!order) return;

  const fullRefund = charge.refunded || charge.amount_refunded >= charge.amount;
  const cards = fullRefund
    ? await voidGiftCardsForOrder(order.orderId, "refunded")
    : await getGiftCardsForOrder(order.orderId);
  const latestRefund = charge.refunds?.data?.[0]?.id ?? `${charge.id}:${charge.amount_refunded}`;

  await notifyOwner(
    order,
    "refundNotifiedFor",
    latestRefund,
    `[GIFT CARD REFUND] ${order.customerName || order.customerEmail || order.orderId}: ${formatUsd(charge.amount_refunded)} refunded`,
    [
      `A refund was made on an order with gift cards.`,
      ``,
      `Refunded so far: ${formatUsd(charge.amount_refunded)} of ${formatUsd(charge.amount)}.`,
      fullRefund
        ? `Full refund: every gift card on this order is now VOID. Do not honor these codes.`
        : `Partial refund: the codes are still active. Decide which card the refund covers and don't honor that code.`,
      ``,
      ...cardList(cards),
      ``,
      `Buyer: ${order.customerName || "(no name)"} ${order.customerEmail || ""}`,
      `Order ID: ${order.orderId}`,
    ]
  );
};

export const handleDispute = async (dispute: Stripe.Dispute, eventType: string) => {
  const order = await giftOrderFor(paymentIntentId(dispute.payment_intent));
  if (!order) return;

  const opened = eventType === "charge.dispute.created";
  const cards = opened ? await voidGiftCardsForOrder(order.orderId, "disputed") : await getGiftCardsForOrder(order.orderId);

  await notifyOwner(
    order,
    "disputeNotifiedFor",
    `${dispute.id}:${opened ? "created" : dispute.status}`,
    `[GIFT CARD DISPUTE] ${order.customerName || order.customerEmail || order.orderId}: ${opened ? "opened" : dispute.status}`,
    [
      opened
        ? `The card owner disputed a payment that bought gift cards (reason: ${dispute.reason}). Every gift card on this order is now VOID. Do not honor these codes.`
        : `A dispute on a gift card order closed with status "${dispute.status}". The cards stay VOID; to reactivate them, ask Austin.`,
      ``,
      `Disputed amount: ${formatUsd(dispute.amount)}`,
      ``,
      ...cardList(cards),
      ``,
      `Buyer: ${order.customerName || "(no name)"} ${order.customerEmail || ""}`,
      `Order ID: ${order.orderId}`,
    ]
  );
};
