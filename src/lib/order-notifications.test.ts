import assert from "node:assert/strict";
import test from "node:test";

import type { OrderRecord } from "./orders";
import { buildCustomerEmail, buildOwnerEmail } from "./order-notifications";

const order: OrderRecord = {
  orderId: "order-123",
  publicToken: "token-abc",
  items: [
    {
      slug: "blomdahl-ear-piercing",
      kind: "procedure",
      name: "Blomdahl Ear Piercing",
      quantity: 2,
      unitAmountCents: 4000,
      lineTotalCents: 8000,
      currency: "usd",
      pricingMode: "quantity",
    } as OrderRecord["items"][number],
  ],
  subtotalCents: 8000,
  requiresScheduling: true,
  paymentStatus: "paid",
  schedulingStatus: "pending",
  stripeSessionId: "cs_test_1",
  customerEmail: "buyer@example.com",
  customerName: "Pat <Buyer>",
  customerPhone: "(757) 555-0100",
  createdAt: new Date("2026-11-01T12:00:00Z"),
  updatedAt: new Date("2026-11-01T12:00:00Z"),
};

test("owner email names the buyer, their contact links, items and total", () => {
  const email = buildOwnerEmail(order);

  assert.match(email.subject, /^\[PAID ORDER\] Pat <Buyer>, Blomdahl Ear Piercing \(\$80/);
  assert.match(email.text, /Phone: \(757\) 555-0100/);
  assert.match(email.text, /2 x Blomdahl Ear Piercing: \$80/);
  assert.match(email.text, /checkout\/success\?order=token-abc/);
  assert.match(email.html, /href="sms:7575550100"/);
  assert.match(email.html, /href="tel:7575550100"/);
  assert.match(email.html, /Pat &lt;Buyer&gt;/, "customer name is escaped in HTML");
  assert.doesNotMatch(email.html, /<Buyer>/);
});

test("customer receipt has the total and a booking link when scheduling is needed", () => {
  const email = buildCustomerEmail(order);

  assert.equal(email.subject, "Your Williamsburg Med Spa receipt");
  assert.match(email.text, /^Hi Pat,/);
  assert.match(email.text, /Total paid: \$80/);
  assert.match(email.text, /pick your appointment time here:\nhttps?:\/\/[^\s]+\/checkout\/success\?order=token-abc/);
  assert.match(email.html, /href="[^"]+\/checkout\/success\?order=token-abc"/);
});

test("product-only receipts talk about pickup, not booking", () => {
  const email = buildCustomerEmail({ ...order, requiresScheduling: false, customerName: undefined });

  assert.match(email.text, /^Hi,/);
  assert.match(email.text, /we'll contact you to set a pickup time/);
  assert.doesNotMatch(email.text, /appointment|book/i);
});

test("mixed procedure + pickup orders get both the booking link and the pickup line", () => {
  const mixed: OrderRecord = {
    ...order,
    items: [...order.items, { ...order.items[0], slug: "aftercare", name: "Aftercare Kit", fulfillment: "pickup" }],
  };

  assert.match(buildCustomerEmail(mixed).text, /pick your appointment time[\s\S]*set a pickup time/);
  assert.match(buildOwnerEmail(mixed).text, /Contact them to set a pickup time/);
});

test("greeting uses the first name even with stray spaces", () => {
  assert.match(buildCustomerEmail({ ...order, customerName: "  Pat Buyer" }).text, /^Hi Pat,/);
});

test("owner alert says plainly when the receipt did not go out", () => {
  assert.match(buildOwnerEmail(order, "failed").text, /receipt email failed to send\. Text or call them/);
  assert.match(buildOwnerEmail({ ...order, customerEmail: undefined }, "skipped").text, /no email address/);
  assert.match(buildOwnerEmail(order, "sent").text, /emailed a receipt with a link to book/);
});
