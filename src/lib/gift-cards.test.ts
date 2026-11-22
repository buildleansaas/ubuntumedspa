import assert from "node:assert/strict";
import test from "node:test";

import {
  COMMERCE_CATALOG_BY_SLUG,
  GIFT_CARD_FACE_VALUES_CENTS,
  GIFT_CARD_MAX_ORDER_CASH_CENTS,
  giftCardSlug,
} from "../config/commerce-catalog";
import { activeGiftCardTheme, GIFT_CARD_THEMES } from "../config/gift-card-themes";
import { resolveCartItemPricing } from "./cart-pricing";
import {
  GIFT_CARD_CODE_ALPHABET,
  GIFT_CARD_CODE_PATTERN,
  assertGiftCardOrderCap,
  formatGiftCardCode,
  giftCardCashTotalCents,
  giftCardEntryKeys,
  giftCardUnitsForItems,
  type GiftCardRecord,
} from "./gift-card-rules";
import { buildCustomerEmail, buildOwnerEmail } from "./order-notifications";
import type { OrderRecord } from "./orders";
import { cardPriceCents } from "./price";

const line = (faceValueCents: number, quantity: number) => {
  const item = COMMERCE_CATALOG_BY_SLUG[giftCardSlug(faceValueCents)];
  return { ...item, quantity, unitLabel: item.quantityLabel, ...resolveCartItemPricing(item, quantity) };
};

test("six gift card amounts, $25 to $1,000, charged at the card price and worth the cash amount", () => {
  assert.deepEqual([...GIFT_CARD_FACE_VALUES_CENTS], [2500, 5000, 10000, 25000, 50000, 100000]);
  const expectedCard: Record<number, number> = { 2500: 2606, 5000: 5181, 10000: 10330, 25000: 25778, 50000: 51525, 100000: 103018 };
  for (const cents of GIFT_CARD_FACE_VALUES_CENTS) {
    const item = COMMERCE_CATALOG_BY_SLUG[giftCardSlug(cents)];
    assert.equal(item.fulfillment, "email");
    assert.equal(item.requiresScheduling, false);
    assert.equal(item.cashAmountCents, cents);
    assert.equal(item.unitAmountCents, cardPriceCents(cents));
    assert.equal(item.unitAmountCents, expectedCard[cents], `card price for ${cents}`);
  }
});

test("gift cards are capped at $1,000 face value per order, summed across amounts", () => {
  assert.equal(GIFT_CARD_MAX_ORDER_CASH_CENTS, 100000);
  assert.doesNotThrow(() => assertGiftCardOrderCap([line(100000, 1)]));
  assert.doesNotThrow(() => assertGiftCardOrderCap([line(50000, 1), line(25000, 2)]));
  assert.throws(() => assertGiftCardOrderCap([line(100000, 1), line(2500, 1)]), /limited to \$1,000/);
  assert.throws(() => assertGiftCardOrderCap([line(50000, 3)]), /limited to \$1,000/);
  // Non-gift lines don't count toward the cap.
  const botox = { ...COMMERCE_CATALOG_BY_SLUG.botox, quantity: 4, ...resolveCartItemPricing(COMMERCE_CATALOG_BY_SLUG.botox, 4) };
  assert.doesNotThrow(() => assertGiftCardOrderCap([botox, line(100000, 1)]));
  assert.equal(giftCardCashTotalCents([botox, line(10000, 2)]), 20000);
});

test("one entry key per gift card unit (the unique key issuing upserts on)", () => {
  const items = [line(10000, 2), line(2500, 1)];
  assert.equal(giftCardUnitsForItems(items), 3);
  assert.deepEqual(
    giftCardEntryKeys("order-1", items).map(({ entryKey, faceValueCents }) => [entryKey, faceValueCents]),
    [
      ["order-1:gift-card-100:0", 10000],
      ["order-1:gift-card-100:1", 10000],
      ["order-1:gift-card-25:0", 2500],
    ]
  );
});

test("codes: WMS-XXXXX-XXXXX from 31 unambiguous characters (~49.5 bits)", () => {
  assert.equal(GIFT_CARD_CODE_ALPHABET.length, 31);
  assert.doesNotMatch(GIFT_CARD_CODE_ALPHABET, /[01ILO]/);
  assert.equal(new Set(GIFT_CARD_CODE_ALPHABET).size, 31);
  assert.match(formatGiftCardCode("ABCDE23456"), GIFT_CARD_CODE_PATTERN);
  assert.throws(() => formatGiftCardCode("ABC"));
  assert.ok(10 * Math.log2(31) > 49);
});

test("theme by clinic date: Christmas Nov 15 to Dec 31, evergreen otherwise", () => {
  const at = (iso: string) => activeGiftCardTheme(new Date(iso)).slug;
  assert.equal(at("2026-11-14T17:00:00Z"), "evergreen");
  assert.equal(at("2026-11-15T17:00:00Z"), "christmas");
  assert.equal(at("2026-12-31T23:00:00Z"), "christmas"); // 6 PM Dec 31 in Williamsburg
  assert.equal(at("2027-01-01T05:30:00Z"), "evergreen"); // 12:30 AM Jan 1 in Williamsburg
  for (const theme of GIFT_CARD_THEMES) {
    assert.match(theme.startsOn ?? "", /^\d{2}-\d{2}$/);
    assert.match(theme.endsOn ?? "", /^\d{2}-\d{2}$/);
  }
});

const giftOrder = (overrides: Partial<OrderRecord> = {}): OrderRecord => ({
  orderId: "11111111-2222-3333-4444-555555555555",
  publicToken: "tok",
  items: [line(10000, 2)],
  subtotalCents: 20660,
  cashSubtotalCents: 20000,
  requiresScheduling: false,
  paymentStatus: "paid",
  schedulingStatus: "not_required",
  customerEmail: "buyer@example.com",
  customerName: "Pat Buyer",
  giftCardUnits: 2,
  giftCardsIssuedAt: new Date(),
  giftMessage: "Merry Christmas <3",
  paidAt: new Date("2026-11-22T15:00:00Z"),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const card = (i: number, overrides: Partial<GiftCardRecord> = {}): GiftCardRecord => ({
  entryKey: `x:gift-card-100:${i}`,
  code: `WMS-ABCDE-2345${i + 6}`,
  viewToken: `view-${i}`,
  orderId: "11111111-2222-3333-4444-555555555555",
  slug: "gift-card-100",
  faceValueCents: 10000,
  recipientName: "Sam <b>",
  themeSlug: "christmas",
  status: "active",
  createdAt: new Date(),
  ...overrides,
});

test("receipt and owner email carry every code, no pickup line, and escape buyer text", () => {
  const order = giftOrder();
  const cards = [card(0), card(1)];
  const customer = buildCustomerEmail(order, { cards });
  assert.match(customer.text, /WMS-ABCDE-23456/);
  assert.match(customer.text, /WMS-ABCDE-23457/);
  assert.match(customer.text, /\/gift-cards\/card\/view-0/);
  assert.match(customer.text, /Never expires/);
  assert.doesNotMatch(customer.text, /pickup/i);
  assert.doesNotMatch(customer.html, /<b>/);
  assert.match(customer.html, /Sam &lt;b&gt;/);

  const owner = buildOwnerEmail(order, "sent", { cards, recentGiftOrdersByEmail: 2 });
  assert.match(owner.text, /WMS-ABCDE-23456/);
  assert.match(owner.text, /WMS-ABCDE-23457/);
  assert.match(owner.text, /\/gift-cards\/card\/view-1/);
  assert.match(owner.text, /redeem by hand/);
  assert.doesNotMatch(customer.text, /After your visit/);
  assert.match(owner.text, /bought gift cards 2 other time/);
  assert.doesNotMatch(owner.text, /pickup/i);
  assert.match(owner.html, /Merry Christmas &lt;3/);
});

test("emails refuse to build while cards are missing", () => {
  const order = giftOrder();
  assert.throws(() => buildCustomerEmail(order, { cards: [card(0)] }), /needs 2 gift cards/);
  assert.throws(() => buildCustomerEmail(order), /needs 2 gift cards/);
  assert.throws(() => buildOwnerEmail(order, "sent", { cards: [] }), /needs 2 gift cards/);
});

test("void cards are left out of the buyer's receipt", () => {
  const customer = buildCustomerEmail(giftOrder(), { cards: [card(0), card(1, { status: "void" })] });
  assert.match(customer.text, /WMS-ABCDE-23456/);
  assert.doesNotMatch(customer.text, /WMS-ABCDE-23457/);
});

test("the booking text leaves gift cards out of a mixed order", async () => {
  const { orderBookingMessage } = await import("./text-to-book");
  const message = orderBookingMessage({
    orderId: "abc",
    items: [
      { name: "Botox", quantity: 1, fulfillment: "appointment" },
      { name: "$100 Gift Card", quantity: 1, fulfillment: "email" },
    ],
  });
  assert.match(message, /paid online for Botox \(order/);
  assert.doesNotMatch(message, /Gift Card/);
});
