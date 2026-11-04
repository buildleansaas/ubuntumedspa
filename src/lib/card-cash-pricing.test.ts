import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { COMMERCE_CATALOG, EAR_PIERCING_PRICES, getCatalogConfigBySlug } from "../config/commerce-catalog";
import { procedures, products } from "../data";
import { creditAmountCentsForItem, resolveCartItemPricing, resolveSyncedStripePriceId } from "./cart-pricing";
import type { ResolvedCartItem } from "./catalog";
import {
  cardPriceCents,
  cardQuantityBreakLineCents,
  cardQuantityBreakUnitCents,
  estimatedStripeFeeCents,
  formatUsdShort,
} from "./price";
import { buildStripeLineItem } from "./stripe-line-item";

const allowedQuantities = (minQuantity: number, maxQuantity: number) =>
  Array.from({ length: maxQuantity - minQuantity + 1 }, (_, index) => minQuantity + index);

test("cardPriceCents covers 2.9% + 30 cents and rounds up to the cent", () => {
  assert.equal(cardPriceCents(4500), 4666);
  assert.equal(cardPriceCents(8000), 8270);
  assert.equal(cardPriceCents(25000), 25778);
  assert.equal(cardPriceCents(120000), 123615);
  assert.equal(cardPriceCents(0), 31);
  assert.throws(() => cardPriceCents(45.5));
  assert.throws(() => cardPriceCents(-1));
});

test("cardPriceCents matches the documented formula ceil((cash + 30) / 0.971) for every catalog cash amount", () => {
  for (const item of COMMERCE_CATALOG) {
    const cashAmounts = [item.cashAmountCents, ...Object.entries(item.cashQuantityPriceBreaks ?? {}).map(([q, c]) => c * Number(q))];
    for (const cash of cashAmounts) {
      const exact = (cash + 30) / (1 - 0.029);
      const card = cardPriceCents(cash);
      assert.ok(card >= exact && card - exact < 1, `${item.slug}: ${card} is not the ceiling of ${exact}`);
    }
  }
});

test("ear piercing quantity break: both ears are $82.70 by card ($41.35 per ear), one ear $46.66", () => {
  assert.equal(cardQuantityBreakUnitCents(4000, 2), 4135);
  assert.equal(cardQuantityBreakLineCents(4000, 2), 8270);

  const piercing = getCatalogConfigBySlug("blomdahl-ear-piercing");
  assert.ok(piercing);
  assert.equal(piercing.unitAmountCents, 4666);
  assert.deepEqual(piercing.quantityPriceBreaks, { 2: 4135 });
  assert.deepEqual(piercing.cashQuantityPriceBreaks, { 2: 4000 });

  const one = resolveCartItemPricing(piercing, 1);
  assert.deepEqual(one, {
    unitAmountCents: 4666,
    lineTotalCents: 4666,
    cashUnitAmountCents: 4500,
    cashLineTotalCents: 4500,
    usesQuantityPriceBreak: false,
  });

  const both = resolveCartItemPricing(piercing, 2);
  assert.deepEqual(both, {
    unitAmountCents: 4135,
    lineTotalCents: 8270,
    cashUnitAmountCents: 4000,
    cashLineTotalCents: 8000,
    usesQuantityPriceBreak: true,
  });

  assert.deepEqual(EAR_PIERCING_PRICES, {
    oneEarCard: "$46.66",
    oneEarCash: "$45",
    bothEarsCard: "$82.70",
    bothEarsCash: "$80",
  });
});

test("every catalog item at every allowed quantity nets at least the cash price after Stripe fees, without overcharging", () => {
  let checked = 0;

  for (const item of COMMERCE_CATALOG) {
    assert.equal(item.unitAmountCents, cardPriceCents(item.cashAmountCents), `${item.slug}: card unit price is not derived from cash`);

    for (const quantity of allowedQuantities(item.minQuantity, item.maxQuantity)) {
      const pricing = resolveCartItemPricing(item, quantity);
      const card = pricing.lineTotalCents;
      const cash = pricing.cashLineTotalCents;

      assert.ok(Number.isInteger(card) && Number.isInteger(cash), `${item.slug} x${quantity}: non-integer cents`);
      assert.ok(
        card - estimatedStripeFeeCents(card) >= cash,
        `${item.slug} x${quantity}: card ${card} minus fee ${estimatedStripeFeeCents(card)} is below cash ${cash}`
      );
      assert.ok(
        card - cash < cash * 0.04 + 35,
        `${item.slug} x${quantity}: card ${card} exceeds cash ${cash} by more than 4% + 35 cents`
      );
      checked += 1;
    }
  }

  assert.ok(checked >= COMMERCE_CATALOG.length);
});

test("increment-credit items (Botox, Xeomin) charge the card price but credit exactly the cash value", () => {
  const creditItems = COMMERCE_CATALOG.filter((item) => item.pricingMode === "increment_credit");
  assert.deepEqual(
    creditItems.map((item) => item.slug).sort(),
    ["botox", "xeomin"]
  );

  for (const item of creditItems) {
    assert.equal(item.cashAmountCents, 25000);
    assert.equal(item.unitAmountCents, 25778);

    for (const quantity of allowedQuantities(item.minQuantity, item.maxQuantity)) {
      const pricing = resolveCartItemPricing(item, quantity);
      assert.equal(pricing.lineTotalCents, 25778 * quantity);
      assert.equal(pricing.cashLineTotalCents, 25000 * quantity);
      assert.equal(creditAmountCentsForItem(pricing), 25000 * quantity, `${item.slug} x${quantity} credit`);
    }
  }

  // Orders created before card pricing have no cash fields: they paid (and are credited) the old line total.
  assert.equal(creditAmountCentsForItem({ lineTotalCents: 50000 }), 50000);
});

test("a stale synced Stripe price (old amount) is never used; checkout falls back to price_data at the card price", () => {
  const botox = getCatalogConfigBySlug("botox");
  assert.ok(botox);

  // Mongo record left over from before card pricing: points at the old $250 Stripe price.
  const staleRecord = { stripePriceId: "price_old_250", unitAmountCents: 25000, currency: "usd" };
  assert.equal(resolveSyncedStripePriceId(botox, staleRecord), undefined);
  assert.equal(resolveSyncedStripePriceId(botox, { stripePriceId: "price_unknown_amount" }), undefined);
  assert.equal(resolveSyncedStripePriceId(botox, { ...staleRecord, unitAmountCents: 25778, currency: "eur" }), undefined);
  assert.equal(resolveSyncedStripePriceId(botox, null), undefined);

  // After `pnpm sync:stripe-catalog` the record carries the card amount and the price ID is reused.
  const syncedRecord = { stripePriceId: "price_new_25778", unitAmountCents: 25778, currency: "usd" };
  assert.equal(resolveSyncedStripePriceId(botox, syncedRecord), "price_new_25778");

  const resolvedItem = (stripeRecord: typeof staleRecord): ResolvedCartItem => ({
    ...botox,
    quantity: 2,
    unitLabel: botox.quantityLabel,
    ...resolveCartItemPricing(botox, 2),
    stripePriceId: resolveSyncedStripePriceId(botox, stripeRecord),
  });

  const staleLine = buildStripeLineItem(resolvedItem(staleRecord));
  assert.equal(staleLine.price, undefined);
  assert.equal(staleLine.quantity, 2);
  assert.equal(staleLine.price_data?.unit_amount, 25778);

  const syncedLine = buildStripeLineItem(resolvedItem(syncedRecord));
  assert.deepEqual(syncedLine, { price: "price_new_25778", quantity: 2 });

  // Quantity breaks always use price_data, even with a matching synced record.
  const piercing = getCatalogConfigBySlug("blomdahl-ear-piercing");
  assert.ok(piercing);
  const bothEars = buildStripeLineItem({
    ...piercing,
    quantity: 2,
    unitLabel: piercing.quantityLabel,
    ...resolveCartItemPricing(piercing, 2),
    stripePriceId: resolveSyncedStripePriceId(piercing, { stripePriceId: "price_ear", unitAmountCents: 4666, currency: "usd" }),
  });
  assert.equal(bothEars.price, undefined);
  assert.equal(bothEars.price_data?.unit_amount, 4135);
});

test("display prices show the card price with the cash price, never as a fee", () => {
  for (const item of COMMERCE_CATALOG) {
    assert.ok(item.displayPrice.includes(formatUsdShort(item.unitAmountCents)), `${item.slug}: ${item.displayPrice}`);
    assert.ok(item.displayPrice.includes(`${formatUsdShort(item.cashAmountCents)}`), `${item.slug}: ${item.displayPrice}`);
    assert.match(item.displayPrice, /cash · .*card\/online/);
    assert.ok(
      item.displayPrice.indexOf(formatUsdShort(item.cashAmountCents)) < item.displayPrice.indexOf(formatUsdShort(item.unitAmountCents)),
      `${item.slug}: cash price must come first: ${item.displayPrice}`
    );
    assert.doesNotMatch(item.displayPrice, /fee|surcharge/i);
  }

  assert.equal(getCatalogConfigBySlug("oh-shot")?.displayPrice, "$1,200 cash · $1,236.15 card/online");
  assert.equal(getCatalogConfigBySlug("botox")?.displayPrice, "$250 credit blocks · $250 cash · $257.78 card/online");
  assert.equal(
    getCatalogConfigBySlug("blomdahl-ear-piercing")?.displayPrice,
    "$45 per ear or $80 for both ears cash · $46.66 or $82.70 card/online"
  );
});

test("site copy prices (data.ts) match the catalog's card and cash prices", () => {
  for (const entry of [...procedures, ...products] as { slug: string; price?: string }[]) {
    const item = getCatalogConfigBySlug(entry.slug);
    if (!item || !entry.price) continue;
    if (entry.slug === "hyperhidrosis-treatment") {
      assert.equal(entry.price, `${formatUsdShort(item.cashAmountCents)}+ cash · ${formatUsdShort(item.unitAmountCents)}+ card/online`);
      continue;
    }
    assert.equal(entry.price, item.displayPrice, entry.slug);
  }
});

test("literal cash/card price pairs in copy and SEO checks use the computed card price", () => {
  const files = [
    "scripts/verify-seo.mjs",
    "src/data.ts",
    "src/lib/local-injectable-service-pages.ts",
    "src/lib/ear-piercing-intents.ts",
    "src/markdown/planning-holiday-ear-piercing-williamsburg-va.mdx",
  ];
  const pairPattern =
    /\$([\d,]+(?:\.\d{2})?)(?: per [a-z]+)? (?:cash · |in cash or )\$([\d,]+(?:\.\d{2})?)(?: card\/online| online by card)/g;
  const toCents = (value: string) => Math.round(Number(value.replace(/,/g, "")) * 100);
  let pairs = 0;

  for (const file of files) {
    const source = readFileSync(join(process.cwd(), file), "utf8");
    for (const match of source.matchAll(pairPattern)) {
      assert.equal(toCents(match[2]), cardPriceCents(toCents(match[1])), `${file}: ${match[0]}`);
      pairs += 1;
    }
  }

  assert.ok(pairs >= 4, `expected literal price pairs in verify-seo.mjs, found ${pairs}`);
});
