import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { getCartRecommendations } from "../config/cart-recommendations";
import { COMMERCE_CATALOG } from "../config/commerce-catalog";
import { products } from "../data";
import { cashCardProse } from "./price";

// Co2 Lift and Co2 V Lift for Women are cosmetic carboxytherapy gels sold for pickup. Their pages must not
// make outcome or medical claims, or read like a laser or vaginal-rejuvenation procedure.
const STRICT =
  /scientifically|clinically|proven|laser|tighten|rejuvenat|incontinence|cure|guarantee|before[- ]and[- ]after|cellular|collagen|firm|youth|restor|revitaliz|anti-?aging|hydrat|plump|glow/i;

// The only allowed "laser" mentions are these exact disclaimers, as written in src/data.ts. They are removed before
// the scan, so any other "laser" (or any other banned word) fails:
//   "not a laser procedure"
//   "not a laser or surgery"            (also the benefit title "Not a laser or surgery")
//   "not a laser or surgical procedure"
//   "not a laser, an energy-based device, or a surgical procedure"
const NOT_A_LASER_DISCLAIMERS = [
  "not a laser, an energy-based device, or a surgical procedure",
  "not a laser or surgical procedure",
  "not a laser or surgery",
  "not a laser procedure",
];
const stripNotALaser = (text: string) =>
  NOT_A_LASER_DISCLAIMERS.reduce(
    (value, phrase) => value.replace(new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "gi"), " "),
    text
  );

const EXPECTED = {
  "co2-lift": {
    title: "Co2 Lift Carboxytherapy Gel | Williamsburg Med Spa",
    cashCents: 10000,
  },
  "co2-v-lift-for-women": {
    title: "Co2 V Lift Carboxytherapy Gel for Women | Williamsburg Med Spa",
    cashCents: 50000,
  },
} as const;

const collectText = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectText);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectText);
  return [];
};

for (const [slug, expected] of Object.entries(EXPECTED)) {
  const product = products.find((entry) => entry.slug === slug);

  test(`${slug}: entry exists`, () => {
    assert.ok(product, `missing product ${slug}`);
  });

  if (!product) continue;
  const { image, link, ...copy } = product;
  void image;
  void link;
  const texts = collectText(copy);

  test(`${slug}: no outcome, medical, or laser claims`, () => {
    for (const text of texts) {
      assert.doesNotMatch(stripNotALaser(text), STRICT, `banned wording in ${slug}: ${text}`);
    }
  });

  test(`${slug}: SEO title and meta`, () => {
    assert.ok("seoTitle" in product && "seoDescription" in product, `${slug} needs seoTitle and seoDescription`);
    assert.equal(product.seoTitle, expected.title);
    const meta = product.seoDescription as string;
    assert.ok(meta.length <= 160, `${slug} meta is ${meta.length} chars: ${meta}`);
    assert.ok(meta.includes(cashCardProse(expected.cashCents)), `${slug} meta must carry the cash/card price`);
    const priceAt = meta.indexOf("$");
    assert.ok(priceAt >= 0 && priceAt < 40, `${slug} meta should lead with the cash price`);
  });
}

test("Co2 V Lift says it is not a laser or surgical procedure and points medical concerns to a clinician", () => {
  const vLift = products.find((entry) => entry.slug === "co2-v-lift-for-women");
  assert.ok(vLift);
  const all = collectText(vLift).join(" ");
  assert.match(vLift.description, /not a laser or surgical procedure/i);
  assert.match(all, /doctor or gynecologist/i);
});

test("the scan catches reintroduced overclaims", () => {
  for (const bad of [
    "a scientifically proven carboxytherapy gel",
    "clinically tested",
    "CO2 laser vaginal rejuvenation",
    "tightens intimate tissue",
    "works at the cellular level",
    "Enhanced Collagen Production",
    "Restore Feminine Vitality",
    "CO2 laser treatment",
  ]) {
    assert.match(stripNotALaser(bad), STRICT, bad);
  }
  assert.doesNotMatch(stripNotALaser("It is not a laser or surgical procedure."), STRICT);
});

const CO2_SLUGS = ["co2-lift", "co2-v-lift-for-women"];

test("cart recommendations involving the Co2 products use neutral, claim-free reasons", () => {
  let checked = 0;
  for (const cartSlug of ["", ...COMMERCE_CATALOG.map((item) => item.slug)]) {
    const cart = cartSlug ? [cartSlug] : [];
    for (const recommendation of getCartRecommendations(cart, 20)) {
      if (!CO2_SLUGS.includes(cartSlug) && !CO2_SLUGS.includes(recommendation.slug)) continue;
      checked += 1;
      assert.doesNotMatch(stripNotALaser(recommendation.reason), STRICT, `${cartSlug} -> ${recommendation.slug}: ${recommendation.reason}`);
      assert.doesNotMatch(recommendation.reason, /intimate/i, `${cartSlug} -> ${recommendation.slug}: ${recommendation.reason}`);
    }
  }
  assert.ok(checked > 0);
});

test("Co2 V Lift is never paired with an intimate-wellness procedure", () => {
  for (const shot of ["oh-shot", "pe-shot"]) {
    const slugs = getCartRecommendations([shot], 20).map((item) => item.slug);
    assert.equal(slugs.includes("co2-v-lift-for-women"), false, `${shot} cart recommends Co2 V Lift`);
  }
  const fromVLift = getCartRecommendations(["co2-v-lift-for-women"], 20).map((item) => item.slug);
  assert.equal(fromVLift.includes("oh-shot") || fromVLift.includes("pe-shot"), false, fromVLift.join(", "));
});

test("the /products listing heading and meta make no outcome or medical-grade claims", () => {
  const view = readFileSync(join(process.cwd(), "src/views/products.tsx"), "utf8");
  const page = readFileSync(join(process.cwd(), "src/app/products/page.tsx"), "utf8");
  for (const [file, text] of [
    ["src/views/products.tsx", view],
    ["src/app/products/page.tsx", page],
  ] as const) {
    assert.doesNotMatch(text, STRICT, file);
    assert.doesNotMatch(text, /medical[- ]grade|intimate/i, file);
  }
  assert.match(view, /Skincare Products/);
  assert.match(page, /title: "Skincare Products in Williamsburg, VA \| Williamsburg Med Spa"/);
  assert.match(page, /"Products available for pickup at Williamsburg Med Spa\. Ask Jenny which fits your routine\."/);
});
