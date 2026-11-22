import { randomUUID } from "crypto";

import { addAccountCredit, type AccountRecord, upsertAccountByEmail } from "lib/accounts";
import { creditAmountCentsForItem } from "lib/cart-pricing";
import { type ResolvedCart, resolveCart } from "lib/catalog";
import {
  assertSessionMatchesOrder,
  cleanGiftText,
  ensureGiftCards,
  giftCardUnitsForItems,
  voidGiftCardsForOrder,
} from "lib/gift-cards";
import { alertOwnerGiftCardsNotIssued } from "lib/gift-card-alerts";
import { ensureMongoIndexes, getDb } from "lib/mongodb";
import { sendPaidOrderNotifications } from "lib/order-notifications";
import { getStripe } from "lib/stripe";

export type OrderNotificationStatus = "sent" | "failed" | "skipped";

export type OrderRecord = {
  orderId: string;
  publicToken: string;
  accountId?: string;
  affiliateId?: string;
  affiliateCode?: string;
  affiliateName?: string;
  items: ResolvedCart["items"];
  /** Card / online subtotal charged by Stripe. */
  subtotalCents: number;
  /** Listed cash subtotal. Missing on orders created before card pricing. */
  cashSubtotalCents?: number;
  requiresScheduling: boolean;
  paymentStatus: "pending" | "paid" | "expired";
  schedulingStatus: "not_required" | "pending" | "scheduled";
  stripeSessionId?: string;
  stripeCustomerId?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  paidAt?: Date;
  customerReceiptClaimedAt?: Date;
  customerReceiptStatus?: OrderNotificationStatus;
  ownerNotificationClaimedAt?: Date;
  ownerNotificationStatus?: OrderNotificationStatus;
  /** Gift card units on the order; receipts wait for giftCardsIssuedAt when this is above 0. */
  giftCardUnits?: number;
  giftCardsIssuedAt?: Date;
  /** Set by a refund or dispute; cards issued after this are inserted as void. */
  giftCardsVoidedAt?: Date;
  giftCardsVoidReason?: string;
  /** Set once Jenny was emailed that a paid order's gift cards could not be issued. */
  giftCardIssueAlertedAt?: Date;
  giftRecipientName?: string;
  giftMessage?: string;
  stripePaymentIntentId?: string;
  /** Stripe refund / dispute ids the owner has already been emailed about. */
  refundNotifiedFor?: string[];
  disputeNotifiedFor?: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreditLedgerEntry = {
  entryKey: string;
  accountId: string;
  orderId: string;
  procedureSlug: string;
  amountCents: number;
  direction: "credit" | "debit";
  reason: string;
  createdAt: Date;
};

export const createPendingOrder = async (
  cartItems: { slug: string; kind: "product" | "procedure"; quantity: number }[],
  affiliate?: {
    affiliateId?: string;
    affiliateCode?: string;
    affiliateName?: string;
  }
) => {
  const resolvedCart = await resolveCart(cartItems);

  if (!resolvedCart.items.length) {
    throw new Error("Your cart is empty.");
  }

  await ensureMongoIndexes();
  const db = await getDb();
  const now = new Date();
  const order: OrderRecord = {
    orderId: randomUUID(),
    publicToken: randomUUID(),
    affiliateId: affiliate?.affiliateId,
    affiliateCode: affiliate?.affiliateCode,
    affiliateName: affiliate?.affiliateName,
    items: resolvedCart.items,
    subtotalCents: resolvedCart.subtotalCents,
    cashSubtotalCents: resolvedCart.cashSubtotalCents,
    requiresScheduling: resolvedCart.requiresScheduling,
    giftCardUnits: giftCardUnitsForItems(resolvedCart.items),
    paymentStatus: "pending",
    schedulingStatus: resolvedCart.requiresScheduling ? "pending" : "not_required",
    createdAt: now,
    updatedAt: now,
  };

  await db.collection<OrderRecord>("orders").insertOne(order);
  return order;
};

export const markOrderSession = async (orderId: string, stripeSessionId: string) => {
  await ensureMongoIndexes();
  const db = await getDb();
  await db.collection<OrderRecord>("orders").updateOne(
    { orderId },
    {
      $set: {
        stripeSessionId,
        updatedAt: new Date(),
      },
    }
  );
};

export const getOrderByPublicToken = async (publicToken: string) => {
  await ensureMongoIndexes();
  const db = await getDb();
  return db.collection<OrderRecord>("orders").findOne({ publicToken });
};

export const getOrderByPaymentIntent = async (stripePaymentIntentId: string) => {
  await ensureMongoIndexes();
  const db = await getDb();
  return db.collection<OrderRecord>("orders").findOne({ stripePaymentIntentId });
};

export const getOrderById = async (orderId: string) => {
  await ensureMongoIndexes();
  const db = await getDb();
  return db.collection<OrderRecord>("orders").findOne({ orderId });
};

const ensureCreditEntries = async (order: OrderRecord, account: AccountRecord) => {
  const db = await getDb();

  for (const item of order.items) {
    if (item.pricingMode !== "increment_credit") continue;

    const entryKey = `${order.orderId}:${item.slug}:credit`;
    // Credit the cash value of the blocks ($250 each), not the card amount charged.
    const amountCents = creditAmountCentsForItem(item);

    const result = await db.collection<CreditLedgerEntry>("credit_ledger").updateOne(
      { entryKey },
      {
        $setOnInsert: {
          entryKey,
          accountId: account.accountId,
          orderId: order.orderId,
          procedureSlug: item.slug,
          amountCents,
          direction: "credit",
          reason: "stripe_payment_completed",
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (result.upsertedCount) {
      await addAccountCredit(account.accountId, amountCents);
    }
  }
};

export const syncOrderFromStripeSession = async (sessionId: string, { notify = true }: { notify?: boolean } = {}) => {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = session.metadata?.orderId;

  if (!orderId) throw new Error("Stripe session is missing order metadata.");

  const order = await getOrderById(orderId);
  if (!order) throw new Error("Order not found for Stripe session.");

  const email = session.customer_details?.email || session.customer_email || undefined;
  const name = session.customer_details?.name || undefined;
  const phone = session.customer_details?.phone || undefined;
  const stripeCustomerId = typeof session.customer === "string" ? session.customer : undefined;
  const stripePaymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || undefined;
  const customField = (key: string) => session.custom_fields?.find((field) => field.key === key)?.text?.value;
  const giftRecipientName = cleanGiftText(customField("gift_recipient"), 60);
  const giftMessage = cleanGiftText(customField("gift_message"), 200);
  let accountId = order.accountId;

  let account: AccountRecord | null = null;
  if (email) {
    account = await upsertAccountByEmail({
      email,
      name,
      phone,
      stripeCustomerId,
      source: "stripe_checkout",
    });
    accountId = account?.accountId;
  }

  await ensureMongoIndexes();
  const db = await getDb();
  const paid = session.payment_status === "paid";
  const paymentStatus = paid ? "paid" : order.paymentStatus === "paid" ? "paid" : session.status === "expired" ? "expired" : "pending";

  await db.collection<OrderRecord>("orders").updateOne(
    { orderId },
    {
      $set: {
        accountId,
        stripeSessionId: session.id,
        stripeCustomerId,
        ...(stripePaymentIntentId ? { stripePaymentIntentId } : {}),
        ...(giftRecipientName ? { giftRecipientName } : {}),
        ...(giftMessage ? { giftMessage } : {}),
        customerEmail: email,
        customerName: name,
        customerPhone: phone,
        paymentStatus,
        paidAt: order.paidAt || (paid ? new Date() : undefined),
        updatedAt: new Date(),
      },
    }
  );

  const freshOrder = await getOrderById(orderId);
  if (freshOrder && account && paymentStatus === "paid") {
    await ensureCreditEntries(freshOrder, account);
  }

  // Gift cards must exist before any receipt (which carries the codes). Errors propagate: no emails go out and the
  // webhook returns an error so Stripe redelivers.
  if (freshOrder && paymentStatus === "paid" && freshOrder.giftCardUnits && !freshOrder.giftCardsIssuedAt) {
    try {
      assertSessionMatchesOrder(session, freshOrder);
      // A refund or dispute may have landed before this first sync (missed webhook): issue those cards as void.
      if (stripePaymentIntentId && !freshOrder.giftCardsVoidedAt) {
        const intent = await stripe.paymentIntents.retrieve(stripePaymentIntentId, { expand: ["latest_charge"] });
        const charge = typeof intent.latest_charge === "object" ? intent.latest_charge : null;
        if (charge && (charge.amount_refunded > 0 || charge.disputed)) {
          await voidGiftCardsForOrder(orderId, charge.disputed ? "disputed before issue" : "refunded before issue");
        }
      }
      await ensureGiftCards((await getOrderById(orderId)) ?? freshOrder);
    } catch (error) {
      // Codes fail closed, but Jenny still hears about the paid order (once).
      await alertOwnerGiftCardsNotIssued(freshOrder, error).catch((alertError) =>
        console.error("[orders] gift card failure alert failed", orderId, alertError)
      );
      throw error;
    }
  }

  if (freshOrder && notify && paymentStatus === "paid") {
    try {
      await sendPaidOrderNotifications(orderId);
    } catch (error) {
      console.error("[orders] order emails failed", orderId, error);
    }
    return getOrderById(orderId);
  }

  return freshOrder;
};
