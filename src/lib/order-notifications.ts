import { getDb } from "lib/mongodb";
import { getMailConfig, sendMail } from "lib/mailer";
import type { OrderRecord } from "lib/orders";
import { formatUsd } from "lib/price";
import { ORIGIN } from "lib/seo";

type NotificationStatus = "sent" | "failed" | "skipped";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const digitsOnly = (phone: string) => phone.replace(/[^\d+]/g, "");

export const getOrderBookingUrl = (order: Pick<OrderRecord, "publicToken">) =>
  `${ORIGIN}/checkout/success?order=${order.publicToken}`;

const itemLines = (order: OrderRecord) =>
  order.items.map((item) => `${item.quantity} x ${item.name}: ${formatUsd(item.lineTotalCents)}`);

export const buildOwnerEmail = (order: OrderRecord) => {
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
    order.requiresScheduling
      ? `They were sent a receipt with a link to book. If they don't book in a day or two, text or call them.`
      : `This is a product order for pickup. Reach out to arrange pickup.`,
    ``,
    `Their booking page: ${getOrderBookingUrl(order)}`,
    `Order ID: ${order.orderId}`,
    order.stripeSessionId ? `Stripe checkout: ${order.stripeSessionId}` : "",
  ].filter((line, index, all) => line !== "" || all[index - 1] !== "");

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
    <p>${
      order.requiresScheduling
        ? "They were sent a receipt with a link to book. If they don't book in a day or two, text or call them."
        : "This is a product order for pickup. Reach out to arrange pickup."
    }</p>
    <p><a href="${getOrderBookingUrl(order)}">Their booking page</a> · Order ${escapeHtml(order.orderId)}</p>
  `;

  return {
    subject: `[PAID ORDER] ${name}, ${order.items.map((item) => item.name).join(", ")} (${formatUsd(order.subtotalCents)})`,
    text: lines.join("\n"),
    html,
  };
};

export const buildCustomerEmail = (order: OrderRecord) => {
  const greeting = order.customerName ? `Hi ${order.customerName.split(" ")[0]},` : "Hi,";
  const bookingUrl = getOrderBookingUrl(order);
  const nextStep = order.requiresScheduling
    ? `Next step: pick your appointment time here:\n${bookingUrl}`
    : `Your order is ready for pickup arrangements. Reply to this email and we'll set a time.`;

  const text = [
    greeting,
    ``,
    `Thank you for your purchase at Williamsburg Med Spa. Here is your receipt.`,
    ``,
    ...itemLines(order),
    `Total paid: ${formatUsd(order.subtotalCents)}`,
    ``,
    nextStep,
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
    ${
      order.requiresScheduling
        ? `<p><strong>Next step:</strong> <a href="${bookingUrl}">pick your appointment time</a>.</p>`
        : `<p>Your order is ready for pickup arrangements. Reply to this email and we'll set a time.</p>`
    }
    <p>Questions? Just reply to this email.</p>
    <p>Jenny<br>Williamsburg Med Spa</p>
  `;

  return { subject: "Your Williamsburg Med Spa receipt", text, html };
};

const trySend = async (send: () => Promise<void>): Promise<{ status: NotificationStatus; error?: string }> => {
  try {
    await send();
    return { status: "sent" };
  } catch (error) {
    return { status: "failed", error: error instanceof Error ? error.message : "Unknown email error" };
  }
};

// Sends the owner alert and the customer receipt once per paid order. The webhook and the
// success page can both sync the same order at the same moment, so the order is claimed
// atomically before anything is sent.
export const sendPaidOrderNotifications = async (orderId: string) => {
  if (!getMailConfig().configured) return null;

  const db = await getDb();
  const orders = db.collection<OrderRecord & { notificationsClaimedAt?: Date }>("orders");
  const claimed = await orders.findOneAndUpdate(
    { orderId, paymentStatus: "paid", notificationsClaimedAt: { $exists: false } },
    { $set: { notificationsClaimedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!claimed) return null;

  const owner = buildOwnerEmail(claimed);
  const ownerResult = await trySend(() =>
    sendMail({ to: getMailConfig().leadsTo, ...owner, replyTo: claimed.customerEmail || undefined })
  );

  const customerResult = claimed.customerEmail
    ? await trySend(() => sendMail({ to: claimed.customerEmail as string, ...buildCustomerEmail(claimed) }))
    : { status: "skipped" as const };

  await orders.updateOne(
    { orderId },
    {
      $set: {
        ownerNotificationStatus: ownerResult.status,
        ownerNotificationError: ownerResult.error,
        customerReceiptStatus: customerResult.status,
        customerReceiptError: "error" in customerResult ? customerResult.error : undefined,
        updatedAt: new Date(),
      },
    }
  );

  return { owner: ownerResult.status, customer: customerResult.status };
};
