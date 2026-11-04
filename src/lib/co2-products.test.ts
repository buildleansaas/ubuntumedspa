import assert from "node:assert/strict";
import test from "node:test";

import { products } from "../data";
import { cashCardProse } from "./price";

// Co2 Lift and Co2 V Lift for Women are cosmetic carboxytherapy gels sold for pickup. Their pages must not
// make outcome or medical claims, or read like a laser or vaginal-rejuvenation procedure.
// The exact "not a laser ... or surgical procedure" disclaimers are the only allowed laser mentions; they are removed
// before the scan, so any other "laser" (or any other banned word) fails.
const STRICT = /scientifically|clinically|proven|laser|tighten|rejuvenat|incontinence|cure|guarantee|before[- ]and[- ]after|cellular/i;
const stripNotALaser = (text: string) =>
  text.replace(/\bnot (?:a |any )?laser(?: procedure)?(?:, an energy-based device,)?(?: or (?:a )?surg(?:ery|ical procedure))?/gi, " ");

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
  ]) {
    assert.match(stripNotALaser(bad), STRICT, bad);
  }
  assert.doesNotMatch(stripNotALaser("It is not a laser or surgical procedure."), STRICT);
});
