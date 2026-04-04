import { randomUUID } from "crypto";

import { addAccountCredit, type AccountRecord, upsertAccountByEmail } from "lib/accounts";
import { type ResolvedCart, resolveCart } from "lib/catalog";
import { ensureMongoIndexes, getDb } from "lib/mongodb";
import { getStripe } from "lib/stripe";

export type OrderRecord = {
  orderId: string;
  publicToken: string;
  accountId?: string;
  affiliateId?: string;
  affiliateCode?: string;
  affiliateName?: string;
  items: ResolvedCart["items"];
  subtotalCents: number;
  requiresScheduling: boolean;
  paymentStatus: "pending" | "paid" | "expired";
  schedulingStatus: "not_required" | "pending" | "scheduled";
  stripeSessionId?: string;
  stripeCustomerId?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  paidAt?: Date;
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
    requiresScheduling: resolvedCart.requiresScheduling,
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
    const amountCents = item.lineTotalCents;

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

export const syncOrderFromStripeSession = async (sessionId: string) => {
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
        customerEmail: email,
        customerName: name,
        customerPhone: phone,
        paymentStatus,
        paidAt: paid ? new Date() : order.paidAt,
        updatedAt: new Date(),
      },
    }
  );

  const freshOrder = await getOrderById(orderId);
  if (freshOrder && account && paymentStatus === "paid") {
    await ensureCreditEntries(freshOrder, account);
  }

  return freshOrder;
};
