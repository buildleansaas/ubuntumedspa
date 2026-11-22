import { randomInt, randomUUID } from "crypto";
import type Stripe from "stripe";

import { activeGiftCardTheme } from "config/gift-card-themes";
import { ensureMongoIndexes, getDb } from "lib/mongodb";
import type { OrderRecord } from "lib/orders";
import {
  type GiftCardRecord,
  GIFT_CARD_CODE_ALPHABET,
  formatGiftCardCode,
  giftCardEntryKeys,
  giftCardUnitsForItems,
  isGiftCardItem,
} from "lib/gift-card-rules";

export * from "lib/gift-card-rules";

/**
 * Gift card issuing (docs/gift-cards-plan.md). Safety promises:
 * - cards are issued only for an order marked paid whose Stripe session total matches the order total;
 * - one card per paid unit, keyed `${orderId}:${slug}:${i}`, so concurrent syncs never issue twice;
 * - an order voided by a refund or dispute before issuing gets its cards inserted as void;
 * - `giftCardsIssuedAt` is set only after every card exists; receipts wait for it (order-notifications sendOnce).
 */
const newCode = () => formatGiftCardCode(Array.from({ length: 10 }, () => GIFT_CARD_CODE_ALPHABET[randomInt(GIFT_CARD_CODE_ALPHABET.length)]).join(""));

type MongoDuplicateKeyError = { code?: number; keyPattern?: Record<string, unknown> };
const duplicateKeyField = (error: unknown) => {
  const mongoError = error as MongoDuplicateKeyError;
  if (mongoError?.code !== 11000) return null;
  return Object.keys(mongoError.keyPattern ?? {})[0] ?? "unknown";
};

const giftCards = async () => {
  await ensureMongoIndexes();
  return (await getDb()).collection<GiftCardRecord>("gift_cards");
};

/** Throws unless the Stripe session charged exactly what the order says, in USD. */
export const assertSessionMatchesOrder = (
  session: Pick<Stripe.Checkout.Session, "amount_total" | "currency">,
  order: Pick<OrderRecord, "subtotalCents" | "orderId">
) => {
  if (session.amount_total !== order.subtotalCents || session.currency !== "usd") {
    throw new Error(
      `Stripe charged ${session.amount_total} ${session.currency} but order ${order.orderId} totals ${order.subtotalCents} usd; gift cards not issued.`
    );
  }
};

/**
 * Issue every gift card on a paid order (idempotent). Returns the order's cards. Throws on any failure, so callers
 * send no receipt and the webhook asks Stripe to redeliver.
 */
export const ensureGiftCards = async (order: OrderRecord): Promise<GiftCardRecord[]> => {
  const units = giftCardUnitsForItems(order.items);
  if (!units) return [];
  if (order.paymentStatus !== "paid") throw new Error(`Order ${order.orderId} is not paid; gift cards not issued.`);

  const collection = await giftCards();
  const theme = activeGiftCardTheme(order.paidAt ? new Date(order.paidAt) : new Date());
  const voided = Boolean(order.giftCardsVoidedAt);

  for (const { entryKey, slug, faceValueCents } of giftCardEntryKeys(order.orderId, order.items)) {
    for (let attempt = 0; ; attempt += 1) {
      const existing = await collection.findOne({ entryKey });
      if (existing) break;
      const now = new Date();
      try {
        await collection.insertOne({
          entryKey,
          code: newCode(),
          viewToken: randomUUID(),
          orderId: order.orderId,
          slug,
          faceValueCents,
          ...(order.giftRecipientName ? { recipientName: order.giftRecipientName } : {}),
          ...(order.giftMessage ? { message: order.giftMessage } : {}),
          themeSlug: theme.slug,
          status: voided ? "void" : "active",
          ...(voided ? { voidReason: order.giftCardsVoidReason ?? "voided before issue", voidedAt: now } : {}),
          createdAt: now,
        });
        break;
      } catch (error) {
        const field = duplicateKeyField(error);
        // Another request issued this unit first: done.
        if (field === "entryKey") break;
        // A code or token clash: draw new values and try again.
        if ((field === "code" || field === "viewToken") && attempt < 5) continue;
        throw error;
      }
    }
  }

  const cards = await collection.find({ orderId: order.orderId }).sort({ entryKey: 1 }).toArray();
  if (cards.length !== units) {
    throw new Error(`Order ${order.orderId} has ${cards.length} gift cards, expected ${units}.`);
  }

  const orders = (await getDb()).collection<OrderRecord>("orders");
  await orders.updateOne(
    { orderId: order.orderId, giftCardsIssuedAt: { $exists: false } },
    { $set: { giftCardsIssuedAt: new Date(), updatedAt: new Date() } }
  );
  return cards;
};

export const getGiftCardsForOrder = async (orderId: string) =>
  (await giftCards()).find({ orderId }).sort({ entryKey: 1 }).toArray();

export const getGiftCardByViewToken = async (viewToken: string) => (await giftCards()).findOne({ viewToken });

/** Marks the order voided (so later issuing inserts void cards) and voids any cards already issued. */
export const voidGiftCardsForOrder = async (orderId: string, reason: string) => {
  const db = await getDb();
  const now = new Date();
  await db
    .collection<OrderRecord>("orders")
    .updateOne(
      { orderId, giftCardsVoidedAt: { $exists: false } },
      { $set: { giftCardsVoidedAt: now, giftCardsVoidReason: reason, updatedAt: now } }
    );
  await (await giftCards()).updateMany({ orderId, status: "active" }, { $set: { status: "void", voidReason: reason, voidedAt: now } });
  return getGiftCardsForOrder(orderId);
};

/** True when the order holds gift cards that must exist before its receipt goes out. */
export const orderNeedsGiftCards = (order: Pick<OrderRecord, "items">) => order.items.some(isGiftCardItem);
