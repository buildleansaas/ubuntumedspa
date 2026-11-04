import assert from "node:assert/strict";
import test from "node:test";

import type { OrderRecord } from "./orders";
import { buildCustomerEmail, buildOwnerEmail } from "./order-notifications";
import { GOOGLE_REVIEW_URL } from "./seo";

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

test("customer receipt has the total and asks the buyer to text or call to book", () => {
  const email = buildCustomerEmail(order);

  assert.equal(email.subject, "Your Williamsburg Med Spa receipt");
  assert.match(email.text, /^Hi Pat,/);
  assert.match(email.text, /Total paid: \$80/);
  assert.match(email.text, /text or call Jenny at \(804\) 738-9483[\s\S]*\nhttps?:\/\/[^\s]+\/checkout\/success\?order=token-abc/);
  assert.match(email.html, /href="[^"]+\/checkout\/success\?order=token-abc"/);
  assert.match(email.html, /href="tel:\+18047389483"/);
  const sms = email.html.match(/href="(sms:[^"]+)"/)?.[1].replace(/&amp;/g, "&");
  assert.ok(sms, "receipt has a Text Jenny sms: link");
  assert.match(sms, /^sms:\+18047389483\?&body=/);
  assert.match(decodeURIComponent(sms.split("&body=")[1]), /^Hi Jenny, this is .+ I paid online for .+ \(order #[A-Z0-9]{1,8}\) and would like to book my appointment\. Days and times that work for me:$/);
  assert.doesNotMatch(email.text + email.html, /cal\.com|calendly|pick your appointment time/i);
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

  assert.match(buildCustomerEmail(mixed).text, /text or call Jenny[\s\S]*set a pickup time/);
  assert.match(buildOwnerEmail(mixed).text, /Contact them to set a pickup time/);
});

test("greeting uses the first name even with stray spaces", () => {
  assert.match(buildCustomerEmail({ ...order, customerName: "  Pat Buyer" }).text, /^Hi Pat,/);
});

test("owner alert says plainly when the receipt did not go out", () => {
  assert.match(buildOwnerEmail(order, "failed").text, /receipt email failed to send\. Text or call them/);
  assert.match(buildOwnerEmail({ ...order, customerEmail: undefined }, "skipped").text, /no email address/);
  assert.match(buildOwnerEmail(order, "sent").text, /emailed a receipt asking them to text or call you to book/);
});

test("owner alert hedges while the receipt is still sending, and shows the paid date", () => {
  const email = buildOwnerEmail({ ...order, paidAt: new Date("2026-10-29T21:06:00Z") }, "sending");

  assert.match(email.text, /A receipt is being emailed to them/);
  assert.doesNotMatch(email.text, /were emailed a receipt/);
  assert.match(email.text, /Paid: Oct 29, 2026, 5:06\s?PM/);
  assert.match(email.text, /Their order page: /);
});

test("Botox credit lines show the card amount paid and the cash-value credit", () => {
  const botox = {
    ...order.items[0],
    slug: "botox",
    name: "Botox",
    pricingMode: "increment_credit",
    quantity: 2,
    unitAmountCents: 25778,
    lineTotalCents: 51556,
    cashUnitAmountCents: 25000,
    cashLineTotalCents: 50000,
  } as OrderRecord["items"][number];
  const credited: OrderRecord = { ...order, items: [botox], subtotalCents: 51556 };

  for (const email of [buildCustomerEmail(credited), buildOwnerEmail(credited)]) {
    assert.match(email.text, /2 x Botox: \$515\.56 \(adds \$500(\.00)? treatment credit\)/);
    assert.match(email.html, /adds \$500(\.00)? treatment credit/);
  }
});

test("receipt asks for a Google review after the visit; the owner alert does not", () => {
  const receipt = buildCustomerEmail(order);

  assert.match(receipt.text, /After your visit, a quick Google review/);
  assert.ok(receipt.text.includes(GOOGLE_REVIEW_URL));
  assert.ok(receipt.html.includes(`href="${GOOGLE_REVIEW_URL}"`));
  assert.ok(!buildOwnerEmail(order).text.includes(GOOGLE_REVIEW_URL));
  assert.ok(!buildOwnerEmail(order).html.includes(GOOGLE_REVIEW_URL));
});

test("review link is the clinic's direct Google write-review link", () => {
  // g.page token decodes to the clinic's Maps CID 0xd403d5b64880bed7 (verified in PR #150).
  assert.equal(GOOGLE_REVIEW_URL, "https://g.page/r/Cde-gEi21QPUEBM/review");
});
