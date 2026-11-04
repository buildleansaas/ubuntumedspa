import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

import { getMarkup } from "../components/structured-data";
import { getCartRecommendations } from "../config/cart-recommendations";
import { COMMERCE_CATALOG } from "../config/commerce-catalog";
import { products } from "../data";
import { officialProfiles } from "../data/official-profiles";

const ROOT = process.cwd();
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61590541225404";

// Outcome and quality overclaims that must not appear in served copy.
const OVERCLAIM = /medical[- ]grade|rejuvenate your|defy aging|youthful glow|anti-?aging/i;

// "Medical Grade Titanium" is the name of Blomdahl's starter-earring material, not a claim. It is removed before the scan.
const stripAllowed = (text: string) => text.replace(/\bMedical Grade Titanium\b/g, " ");

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });

const findOverclaims = (label: string, text: string) => {
  const cleaned = stripAllowed(text);
  const found: string[] = [];
  for (const match of cleaned.matchAll(new RegExp(OVERCLAIM.source, "gi"))) {
    const index = match.index ?? 0;
    found.push(`${label}: "${cleaned.slice(Math.max(0, index - 50), index + 40).replace(/\s+/g, " ")}"`);
  }
  return found;
};

test("officialProfiles lists the clinic Facebook page", () => {
  assert.ok(
    officialProfiles.some((profile) => profile.name === "Facebook" && profile.href === FACEBOOK_URL),
    "officialProfiles is missing the confirmed Facebook page"
  );
});

test("business structured data sameAs includes the Facebook page", () => {
  for (const type of ["LocalBusiness", "Organization"] as const) {
    const markup = getMarkup({ type }) as { sameAs?: string[] };
    assert.ok(markup.sameAs?.includes(FACEBOOK_URL), `${type} sameAs is missing the Facebook page`);
  }
});

test("the clinic Facebook page is not attached to Jenny's Person markup", () => {
  const markup = getMarkup({ type: "Person" }) as { sameAs?: string[] };
  assert.ok(!markup.sameAs?.includes(FACEBOOK_URL));
});

test("served source (components, views, app, config, lib, data) has no overclaim wording", () => {
  const dirs = ["src/components", "src/views", "src/app", "src/config", "src/lib", "src/data"];
  const files = [...dirs.flatMap((dir) => walk(join(ROOT, dir))), join(ROOT, "src/data.ts")];
  assert.ok(files.length > 50, "scan found too few files");
  const found = files.flatMap((file) => findOverclaims(relative(ROOT, file), readFileSync(file, "utf8")));
  assert.deepEqual(found, []);
});

test("products, catalog descriptions, and cart reasons have no overclaim wording", () => {
  const found = [
    ...products.flatMap((product) => findOverclaims(`product ${product.slug}`, JSON.stringify(product))),
    ...COMMERCE_CATALOG.flatMap((item) => findOverclaims(`catalog ${item.slug}`, `${item.name} ${item.shortDescription}`)),
    ...COMMERCE_CATALOG.flatMap((item) =>
      getCartRecommendations([item.slug], 10).flatMap((rec) =>
        findOverclaims(`cart rec for ${item.slug} -> ${rec.slug}`, rec.reason)
      )
    ),
  ];
  assert.deepEqual(found, []);
});

test("Definage Clinical Power Trio Pro reads as a plain skincare set for pickup", () => {
  const definage = products.find((product) => product.slug === "definage-clinical-power-trio-pro");
  assert.ok(definage);
  assert.ok("seoTitle" in definage && definage.seoTitle);
  assert.ok("seoDescription" in definage && definage.seoDescription);
  const text = JSON.stringify(definage);
  assert.doesNotMatch(
    text,
    /firm|glow|texture|reversal|cellular|collagen|hydrat|plump|dermatologist|clinical-grade|youth|rejuvenat|\bag(?:e|es|ing)\b/i
  );
  assert.match(text, /pick it up at Williamsburg Med Spa/);
  assert.match(text, /ask Jenny/i);
});
