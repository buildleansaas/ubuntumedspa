import { getDb } from "lib/mongodb";
import { getMailConfig, orderEmailsEnabled, sendMail } from "lib/mailer";
import type { OrderNotificationStatus, OrderRecord } from "lib/orders";
import { creditAmountCentsForItem } from "lib/cart-pricing";
import { formatUsd, formatUsdShort } from "lib/price";
import { GIFT_CARD_TERMS, isGiftCardItem, type GiftCardRecord } from "lib/gift-card-rules";
import { GOOGLE_REVIEW_URL, ORIGIN } from "lib/seo";
import { BOOKING_PHONE_DISPLAY, bookingSmsHref, bookingTelHref, orderBookingMessage, shortOrderRef } from "lib/text-to-book";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const digitsOnly = (phone: string) => phone.replace(/[^\d+]/g, "");

export const getOrderBookingUrl = (order: Pick<OrderRecord, "publicToken">) =>
  `${ORIGIN}/checkout/success?order=${order.publicToken}`;

// Botox and Xeomin credit blocks are paid at the card price but credit the cash value; say both.
const itemLabel = (item: OrderRecord["items"][number]) =>
  `${item.quantity} x ${item.name}: ${formatUsd(item.lineTotalCents)}` +
  (item.pricingMode === "increment_credit" ? ` (adds ${formatUsd(creditAmountCentsForItem(item))} treatment credit)` : "");

const itemLines = (order: OrderRecord) => order.items.map(itemLabel);

// Gift cards are emailed, never picked up: a gift-card-only order gets no pickup line.
const hasPickupItems = (order: OrderRecord) =>
  order.items.some((item) => item.fulfillment === "pickup") ||
  (!order.requiresScheduling && !order.items.every(isGiftCardItem));

export const giftCardUrl = (card: Pick<GiftCardRecord, "viewToken">) => `${ORIGIN}/gift-cards/card/${card.viewToken}`;

const giftCardLine = (card: GiftCardRecord) =>
  `${formatUsdShort(card.faceValueCents)} gift card${card.recipientName ? ` for ${card.recipientName}` : ""}: code ${card.code}` +
  (card.status === "void" ? " (VOID)" : "");

/** Gift card email options: the order's issued cards and, for the owner, other gift card buys by the same email. */
export type GiftCardEmailContext = { cards: GiftCardRecord[]; recentGiftOrdersByEmail?: number };

const assertCardsComplete = (order: OrderRecord, gift?: GiftCardEmailContext) => {
  const expected = order.giftCardUnits ?? 0;
  if (expected && (gift?.cards.length ?? 0) !== expected) {
    throw new Error(`Order ${order.orderId} needs ${expected} gift cards before its emails go out.`);
  }
};

const PICKUP_LINE_CUSTOMER = "For the products in your order, we'll contact you to set a pickup time.";
const PICKUP_LINE_OWNER = "This order has products for pickup. Contact them to set a pickup time.";

export type ReceiptOutcome = OrderNotificationStatus | "sending";

const formatPaidDate = (order: OrderRecord) =>
  order.paidAt
    ? new Date(order.paidAt).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })
    : "";

const receiptLine = (order: OrderRecord, receipt: ReceiptOutcome) => {
  if (receipt === "sending") {
    return "A receipt is being emailed to them. If they don't book in a day or two, text or call them.";
  }
  if (receipt === "sent") {
    return order.requiresScheduling
      ? "They were emailed a receipt asking them to text or call you to book. If they don't book in a day or two, text or call them."
      : "They were emailed a receipt.";
  }
  if (receipt === "skipped") return "They left no email address, so no receipt was sent. Text or call them.";
  return "Their receipt email failed to send. Text or call them.";
};

export const buildOwnerEmail = (order: OrderRecord, receipt: ReceiptOutcome = "sent", gift?: GiftCardEmailContext) => {
  assertCardsComplete(order, gift);
  const cards = gift?.cards ?? [];
  const giftLines = cards.length
    ? [
        ``,
        `Gift cards (redeem by hand: note the code and date when it's used):`,
        ...cards.map(giftCardLine),
        ...(order.giftMessage ? [`Message: "${order.giftMessage}"`] : []),
        ...(gift?.recentGiftOrdersByEmail
          ? [
              `WARNING: this email bought gift cards ${gift.recentGiftOrdersByEmail} other time(s) in the last 24 hours. Check before honoring large amounts.`,
            ]
          : []),
      ]
    : [];
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
    order.paidAt ? `Paid: ${formatPaidDate(order)}` : "",
    ...giftLines,
    ``,
    receiptLine(order, receipt),
    hasPickupItems(order) ? PICKUP_LINE_OWNER : "",
    ``,
    `Their order page: ${getOrderBookingUrl(order)}`,
    `Order ID: ${order.orderId} (their text will say #${shortOrderRef(order.orderId)})`,
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
      .map((item) => `<li>${escapeHtml(itemLabel(item))}</li>`)
      .join("")}</ul>
    <p><strong>Total paid: ${formatUsd(order.subtotalCents)}</strong>${
      order.paidAt ? `<br>Paid: ${escapeHtml(formatPaidDate(order))}` : ""
    }</p>
    ${
      cards.length
        ? `<p><strong>Gift cards</strong> (redeem by hand: note the code and date when it's used):</p><ul>${cards
            .map((card) => `<li>${escapeHtml(giftCardLine(card))}</li>`)
            .join("")}</ul>${order.giftMessage ? `<p>Message: &ldquo;${escapeHtml(order.giftMessage)}&rdquo;</p>` : ""}${
            gift?.recentGiftOrdersByEmail
              ? `<p><strong>Warning:</strong> this email bought gift cards ${gift.recentGiftOrdersByEmail} other time(s) in the last 24 hours. Check before honoring large amounts.</p>`
              : ""
          }`
        : ""
    }
    <p>${escapeHtml(receiptLine(order, receipt))}</p>
    ${hasPickupItems(order) ? `<p>${PICKUP_LINE_OWNER}</p>` : ""}
    <p><a href="${getOrderBookingUrl(order)}">Their order page</a> · Order ${escapeHtml(order.orderId)} (their text will say #${escapeHtml(shortOrderRef(order.orderId))})</p>
  `;

  return {
    subject: `[PAID ORDER] ${name}, ${order.items.map((item) => item.name).join(", ")} (${formatUsd(order.subtotalCents)})`,
    text: lines.join("\n"),
    html,
  };
};

export const buildCustomerEmail = (order: OrderRecord, gift?: GiftCardEmailContext) => {
  assertCardsComplete(order, gift);
  const cards = (gift?.cards ?? []).filter((card) => card.status === "active");
  const firstName = order.customerName?.trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  const bookingUrl = getOrderBookingUrl(order);
  const nextSteps = [
    order.requiresScheduling
      ? `Next step: text or call Jenny at ${BOOKING_PHONE_DISPLAY} to book your appointment. On your phone, the Text button on your order page opens a message with your order details filled in:\n${bookingUrl}`
      : "",
    hasPickupItems(order) ? PICKUP_LINE_CUSTOMER : "",
  ].filter(Boolean);
  const giftText = cards.length
    ? [
        `Your gift card${cards.length > 1 ? "s" : ""}. Open the link to print it or send it on (the card shows the code, so share it only with the person it's for):`,
        ...cards.map((card) => `${giftCardLine(card)}\n${giftCardUrl(card)}`),
        ``,
        ...GIFT_CARD_TERMS,
        ``,
      ]
    : [];

  const text = [
    greeting,
    ``,
    `Thank you for your purchase at Williamsburg Med Spa. Here is your receipt.`,
    ``,
    ...itemLines(order),
    `Total paid: ${formatUsd(order.subtotalCents)}`,
    ``,
    ...giftText,
    ...nextSteps,
    ``,
    `Questions? Just reply to this email.`,
    ``,
    `After your visit, a quick Google review helps others find us:`,
    GOOGLE_REVIEW_URL,
    ``,
    `Jenny`,
    `Williamsburg Med Spa`,
  ].join("\n");

  const html = `
    <p>${escapeHtml(greeting)}</p>
    <p>Thank you for your purchase at Williamsburg Med Spa. Here is your receipt.</p>
    <ul>${order.items
      .map((item) => `<li>${escapeHtml(itemLabel(item))}</li>`)
      .join("")}</ul>
    <p><strong>Total paid: ${formatUsd(order.subtotalCents)}</strong></p>
    ${
      cards.length
        ? `<p><strong>Your gift card${cards.length > 1 ? "s" : ""}.</strong> Open the link to print it or send it on. The card shows the code, so share it only with the person it's for.</p><ul>${cards
            .map(
              (card) =>
                `<li>${escapeHtml(giftCardLine(card))}<br><a href="${giftCardUrl(card)}">Open the ${escapeHtml(
                  formatUsdShort(card.faceValueCents)
                )} gift card</a></li>`
            )
            .join("")}</ul><p style="font-size:13px;color:#555">${GIFT_CARD_TERMS.map(escapeHtml).join(" ")}</p>`
        : ""
    }
    ${
      order.requiresScheduling
        ? `<p><strong>Next step:</strong> <a href="${escapeHtml(bookingSmsHref(orderBookingMessage(order)))}">Text Jenny</a> or call <a href="${bookingTelHref}">${BOOKING_PHONE_DISPLAY}</a> to book your appointment. The text opens with your order details filled in. You can also use the Text button on <a href="${bookingUrl}">your order page</a>.</p>`
        : ""
    }
    ${hasPickupItems(order) ? `<p>${PICKUP_LINE_CUSTOMER}</p>` : ""}
    <p>Questions? Just reply to this email.</p>
    <p>After your visit, a quick <a href="${GOOGLE_REVIEW_URL}">Google review</a> helps others find us.</p>
    <p>Jenny<br>Williamsburg Med Spa</p>
  `;

  return { subject: "Your Williamsburg Med Spa receipt", text, html };
};

type ClaimField = "customerReceiptClaimedAt" | "ownerNotificationClaimedAt";
type StatusField = "customerReceiptStatus" | "ownerNotificationStatus";

// A claim with no "sent" status this old means the function died mid-send; take it over.
const STALE_CLAIM_MS = 10 * 60 * 1000;

// Claims one message for one paid order so the webhook and the success page can't both send it.
// A failed send releases the claim, so the next sync (or page load) tries again.
const sendOnce = async (
  orderId: string,
  claimField: ClaimField,
  statusField: StatusField,
  send: (order: OrderRecord) => Promise<void>
): Promise<OrderNotificationStatus | "already_handled"> => {
  const orders = (await getDb()).collection<OrderRecord>("orders");
  const claimed = await orders.findOneAndUpdate(
    {
      orderId,
      paymentStatus: "paid",
      // A gift card order's emails carry the codes: never claim them before every card is issued.
      $and: [{ $or: [{ giftCardUnits: { $exists: false } }, { giftCardUnits: 0 }, { giftCardsIssuedAt: { $exists: true } }] }],
      $or: [
        { [claimField]: { $exists: false } },
        { [claimField]: { $lt: new Date(Date.now() - STALE_CLAIM_MS) }, [statusField]: { $ne: "sent" } },
      ],
    },
    { $set: { [claimField]: new Date() } },
    { returnDocument: "after" }
  );

  if (!claimed) return "already_handled";

  try {
    await send(claimed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error(`[order-notifications] ${statusField} failed for order ${orderId}: ${message}`);
    await orders.updateOne(
      { orderId },
      { $set: { [statusField]: "failed", updatedAt: new Date() }, $unset: { [claimField]: "" } }
    );
    return "failed";
  }

  // Outside the try: once the email is out, the claim is never released.
  await orders.updateOne({ orderId }, { $set: { [statusField]: "sent", updatedAt: new Date() } });
  return "sent";
};

const resolveReceiptOutcome = async (orderId: string): Promise<ReceiptOutcome> => {
  const order = await (await getDb()).collection<OrderRecord>("orders").findOne({ orderId });
  return order?.customerReceiptStatus || "sending";
};

// Sends the buyer's receipt, then the owner alert (which says whether the receipt went out).
// Each is sent at most once; failures are retried on the next sync. Safe to call on every visit.
export const sendPaidOrderNotifications = async (orderId: string) => {
  if (!orderEmailsEnabled()) return null;

  const orders = (await getDb()).collection<OrderRecord>("orders");
  const order = await orders.findOne({ orderId, paymentStatus: "paid" });
  if (!order) return null;
  if (order.customerReceiptStatus === "sent" && order.ownerNotificationStatus === "sent") {
    return { customer: "sent" as const, owner: "sent" as const };
  }
  // Gift card orders wait until every card exists (lib/gift-cards ensureGiftCards sets giftCardsIssuedAt).
  if (order.giftCardUnits && !order.giftCardsIssuedAt) return null;
  const gift: GiftCardEmailContext | undefined = order.giftCardUnits
    ? {
        cards: await (await getDb()).collection<GiftCardRecord>("gift_cards").find({ orderId }).sort({ entryKey: 1 }).toArray(),
        recentGiftOrdersByEmail: order.customerEmail
          ? await orders.countDocuments({
              orderId: { $ne: orderId },
              customerEmail: order.customerEmail,
              paymentStatus: "paid",
              giftCardUnits: { $gt: 0 },
              paidAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            })
          : 0,
      }
    : undefined;

  let receipt: ReceiptOutcome;
  if (!order.customerEmail) {
    receipt = "skipped";
    if (order.customerReceiptStatus !== "skipped") {
      await orders.updateOne({ orderId }, { $set: { customerReceiptStatus: "skipped", updatedAt: new Date() } });
    }
  } else {
    const result = await sendOnce(orderId, "customerReceiptClaimedAt", "customerReceiptStatus", (claimed) =>
      sendMail({ to: claimed.customerEmail as string, ...buildCustomerEmail(claimed, gift) })
    );
    receipt = result === "already_handled" ? await resolveReceiptOutcome(orderId) : result;
  }

  const owner = await sendOnce(orderId, "ownerNotificationClaimedAt", "ownerNotificationStatus", (claimed) =>
    sendMail({
      to: getMailConfig().leadsTo,
      ...buildOwnerEmail(claimed, receipt, gift),
      replyTo: claimed.customerEmail || undefined,
    })
  );

  return { customer: receipt, owner };
};
