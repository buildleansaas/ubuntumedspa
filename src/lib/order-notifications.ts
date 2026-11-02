import { getDb } from "lib/mongodb";
import { getMailConfig, orderEmailsEnabled, sendMail } from "lib/mailer";
import type { OrderNotificationStatus, OrderRecord } from "lib/orders";
import { formatUsd } from "lib/price";
import { ORIGIN } from "lib/seo";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const digitsOnly = (phone: string) => phone.replace(/[^\d+]/g, "");

export const getOrderBookingUrl = (order: Pick<OrderRecord, "publicToken">) =>
  `${ORIGIN}/checkout/success?order=${order.publicToken}`;

const itemLines = (order: OrderRecord) =>
  order.items.map((item) => `${item.quantity} x ${item.name}: ${formatUsd(item.lineTotalCents)}`);

const hasPickupItems = (order: OrderRecord) =>
  !order.requiresScheduling || order.items.some((item) => item.fulfillment === "pickup");

const PICKUP_LINE_CUSTOMER = "For the products in your order, we'll contact you to set a pickup time.";
const PICKUP_LINE_OWNER = "This order has products for pickup. Contact them to set a pickup time.";

const receiptLine = (order: OrderRecord, receipt: OrderNotificationStatus) => {
  if (receipt === "sent") {
    return order.requiresScheduling
      ? "They were emailed a receipt with a link to book. If they don't book in a day or two, text or call them."
      : "They were emailed a receipt.";
  }
  if (receipt === "skipped") return "They left no email address, so no receipt was sent. Text or call them.";
  return "Their receipt email failed to send. Text or call them.";
};

export const buildOwnerEmail = (order: OrderRecord, receipt: OrderNotificationStatus = "sent") => {
  const name = order.customerName || "(no name given)";
  const phone = order.customerPhone || "";
  const lines = [
    `New paid order on williamsburgmedspa.com`,
    ``,
    `Customer: ${name}`,
    `Email: ${order.customerEmail || "(none)"}`,
    `Phone: ${phone || "(none)"}`,
    ``,
    ...itemLines(order),
    `Total paid: ${formatUsd(order.subtotalCents)}`,
    ``,
    receiptLine(order, receipt),
    hasPickupItems(order) ? PICKUP_LINE_OWNER : "",
    ``,
    `Their booking page: ${getOrderBookingUrl(order)}`,
    `Order ID: ${order.orderId}`,
    order.stripeSessionId ? `Stripe checkout: ${order.stripeSessionId}` : "",
  ].filter((line, index, all) => line !== "" || (index > 0 && all[index - 1] !== ""));

  const contactHtml = [
    phone
      ? `<a href="sms:${digitsOnly(phone)}">Text ${escapeHtml(phone)}</a> · <a href="tel:${digitsOnly(phone)}">Call</a>`
      : "",
    order.customerEmail
      ? `<a href="mailto:${escapeHtml(order.customerEmail)}">${escapeHtml(order.customerEmail)}</a>`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const html = `
    <p><strong>New paid order on williamsburgmedspa.com</strong></p>
    <p><strong>${escapeHtml(name)}</strong><br>${contactHtml}</p>
    <ul>${order.items
      .map((item) => `<li>${item.quantity} x ${escapeHtml(item.name)}: ${formatUsd(item.lineTotalCents)}</li>`)
      .join("")}</ul>
    <p><strong>Total paid: ${formatUsd(order.subtotalCents)}</strong></p>
    <p>${escapeHtml(receiptLine(order, receipt))}</p>
    ${hasPickupItems(order) ? `<p>${PICKUP_LINE_OWNER}</p>` : ""}
    <p><a href="${getOrderBookingUrl(order)}">Their booking page</a> · Order ${escapeHtml(order.orderId)}</p>
  `;

  return {
    subject: `[PAID ORDER] ${name}, ${order.items.map((item) => item.name).join(", ")} (${formatUsd(order.subtotalCents)})`,
    text: lines.join("\n"),
    html,
  };
};

export const buildCustomerEmail = (order: OrderRecord) => {
  const firstName = order.customerName?.trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  const bookingUrl = getOrderBookingUrl(order);
  const nextSteps = [
    order.requiresScheduling ? `Next step: pick your appointment time here:\n${bookingUrl}` : "",
    hasPickupItems(order) ? PICKUP_LINE_CUSTOMER : "",
  ].filter(Boolean);

  const text = [
    greeting,
    ``,
    `Thank you for your purchase at Williamsburg Med Spa. Here is your receipt.`,
    ``,
    ...itemLines(order),
    `Total paid: ${formatUsd(order.subtotalCents)}`,
    ``,
    ...nextSteps,
    ``,
    `Questions? Just reply to this email.`,
    ``,
    `Jenny`,
    `Williamsburg Med Spa`,
  ].join("\n");

  const html = `
    <p>${escapeHtml(greeting)}</p>
    <p>Thank you for your purchase at Williamsburg Med Spa. Here is your receipt.</p>
    <ul>${order.items
      .map((item) => `<li>${item.quantity} x ${escapeHtml(item.name)}: ${formatUsd(item.lineTotalCents)}</li>`)
      .join("")}</ul>
    <p><strong>Total paid: ${formatUsd(order.subtotalCents)}</strong></p>
    ${order.requiresScheduling ? `<p><strong>Next step:</strong> <a href="${bookingUrl}">pick your appointment time</a>.</p>` : ""}
    ${hasPickupItems(order) ? `<p>${PICKUP_LINE_CUSTOMER}</p>` : ""}
    <p>Questions? Just reply to this email.</p>
    <p>Jenny<br>Williamsburg Med Spa</p>
  `;

  return { subject: "Your Williamsburg Med Spa receipt", text, html };
};

type ClaimField = "customerReceiptClaimedAt" | "ownerNotificationClaimedAt";
type StatusField = "customerReceiptStatus" | "ownerNotificationStatus";

// Claims one message for one paid order so the webhook and the success page can't both send it.
// A failed send releases the claim, so the next sync (or page load) tries again.
const sendOnce = async (
  orderId: string,
  claimField: ClaimField,
  statusField: StatusField,
  send: (order: OrderRecord) => Promise<void>
): Promise<{ status: OrderNotificationStatus | "already_handled"; order?: OrderRecord }> => {
  const orders = (await getDb()).collection<OrderRecord>("orders");
  const claimed = await orders.findOneAndUpdate(
    { orderId, paymentStatus: "paid", [claimField]: { $exists: false } },
    { $set: { [claimField]: new Date() } },
    { returnDocument: "after" }
  );

  if (!claimed) return { status: "already_handled" };

  try {
    await send(claimed);
    await orders.updateOne({ orderId }, { $set: { [statusField]: "sent", updatedAt: new Date() } });
    return { status: "sent", order: claimed };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error(`[order-notifications] ${statusField} failed for order ${orderId}: ${message}`);
    await orders.updateOne(
      { orderId },
      { $set: { [statusField]: "failed", updatedAt: new Date() }, $unset: { [claimField]: "" } }
    );
    return { status: "failed", order: claimed };
  }
};

// Sends the buyer's receipt, then the owner alert (which says whether the receipt went out).
// Each is sent at most once; failures are retried on the next sync. Safe to call on every visit.
export const sendPaidOrderNotifications = async (orderId: string) => {
  if (!orderEmailsEnabled()) return null;

  const orders = (await getDb()).collection<OrderRecord>("orders");
  const order = await orders.findOne({ orderId, paymentStatus: "paid" });
  if (!order) return null;

  let receipt: OrderNotificationStatus | "already_handled" = order.customerReceiptStatus || "already_handled";
  if (!order.customerEmail) {
    receipt = "skipped";
  } else if (!order.customerReceiptClaimedAt) {
    receipt = (
      await sendOnce(orderId, "customerReceiptClaimedAt", "customerReceiptStatus", (claimed) =>
        sendMail({ to: claimed.customerEmail as string, ...buildCustomerEmail(claimed) })
      )
    ).status;
  }

  const receiptForOwner: OrderNotificationStatus = receipt === "already_handled" ? "sent" : receipt;
  const owner = await sendOnce(orderId, "ownerNotificationClaimedAt", "ownerNotificationStatus", (claimed) =>
    sendMail({
      to: getMailConfig().leadsTo,
      ...buildOwnerEmail(claimed, receiptForOwner),
      replyTo: claimed.customerEmail || undefined,
    })
  );

  return { customer: receipt, owner: owner.status };
};
