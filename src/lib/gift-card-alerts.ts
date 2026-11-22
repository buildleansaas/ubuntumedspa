import { getMailConfig, orderEmailsEnabled, sendMail } from "lib/mailer";
import { getDb } from "lib/mongodb";
import type { OrderRecord } from "lib/orders";
import { formatUsd } from "lib/price";

/**
 * Emails Jenny once when a paid order's gift cards could not be issued (amount mismatch, database error, ...).
 * The codes stay unissued (the receipt waits), Stripe keeps redelivering the webhook, and this tells her a paid
 * customer is waiting. Claimed with giftCardIssueAlertedAt so retries don't repeat it.
 */
export const alertOwnerGiftCardsNotIssued = async (order: OrderRecord, error: unknown) => {
  if (!orderEmailsEnabled()) return;
  const orders = (await getDb()).collection<OrderRecord>("orders");
  const claimed = await orders.findOneAndUpdate(
    { orderId: order.orderId, giftCardIssueAlertedAt: { $exists: false } },
    { $set: { giftCardIssueAlertedAt: new Date() } }
  );
  if (!claimed) return;

  const reason = error instanceof Error ? error.message : String(error);
  try {
    await sendMail({
      to: getMailConfig().leadsTo,
      subject: `[PAID, GIFT CARDS NOT ISSUED] ${order.customerName || order.customerEmail || order.orderId} (${formatUsd(order.subtotalCents)})`,
      text: [
        `A paid order has gift cards that could not be created yet. The site keeps retrying; no codes have been sent.`,
        ``,
        `Reason: ${reason}`,
        ``,
        `Buyer: ${order.customerName || "(no name)"} ${order.customerEmail || ""} ${order.customerPhone || ""}`,
        ...order.items.map((item) => `${item.quantity} x ${item.name}`),
        `Order total: ${formatUsd(order.subtotalCents)} (if the reason is an amount mismatch, check the charge in Stripe)`,
        `Order ID: ${order.orderId}`,
        ``,
        `If it clears on a retry, you'll get the normal paid-order email with the codes. If it doesn't clear within a day, text the buyer and forward this email to Austin.`,
      ].join("\n"),
    });
  } catch (sendError) {
    await orders.updateOne({ orderId: order.orderId }, { $unset: { giftCardIssueAlertedAt: "" } });
    throw sendError;
  }
};
