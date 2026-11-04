import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

import { getMarkup } from "../components/structured-data";
import { getCartRecommendations } from "../config/cart-recommendations";
import { COMMERCE_CATALOG } from "../config/commerce-catalog";
import { procedures, products } from "../data";
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

test(".agents notes use medical-grade only inside the words-to-avoid list", () => {
  const files = readdirSync(join(ROOT, ".agents"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => join(ROOT, ".agents", name));
  assert.ok(files.length > 0);
  const found = files.flatMap((file) =>
    readFileSync(file, "utf8")
      .split("\n")
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => /medical[- ]grade/i.test(stripAllowed(line)) && !line.startsWith("**Words to avoid:**"))
      .map(({ line, index }) => `${relative(ROOT, file)}:${index + 1}: ${line.trim().slice(0, 100)}`)
  );
  assert.deepEqual(found, []);
});

// PRP Facial, PRP Face Lift, and the shared "What is PRP" section must not promise collagen, firmness, youth,
// restoration, pore changes, or "optimal results". Slugs and unrendered blog_post_title/blog_post_slug values are URL
// keys and are skipped; "Enlarged Pores" is the name of a concern, not a promise.
const PRP_STRICT = /collagen|\bfirm|youthful|optimal results|restor|pores/i;
const SKIP_KEYS = new Set(["slug", "blog_post_slug", "blog_post_title", "image", "imageAlt", "tag"]);
const stripPrpAllowed = (text: string) => stripAllowed(text).replace(/\benlarged pores\b/gi, " ");
const visibleCopy = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(visibleCopy);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => (SKIP_KEYS.has(key) ? [] : visibleCopy(child)));
  }
  return [];
};

test("PRP Facial, PRP Face Lift, and What is PRP copy has no collagen, firmness, youth, or optimal-results claims", () => {
  const found: string[] = [];
  for (const slug of ["prp-facial", "prp-face-lift"]) {
    const procedure = procedures.find((entry) => entry.slug === slug);
    assert.ok(procedure, `missing procedure ${slug}`);
    for (const text of visibleCopy(procedure)) {
      if (PRP_STRICT.test(stripPrpAllowed(text))) found.push(`${slug}: ${text.slice(0, 120)}`);
    }
  }
  const whatIsPrp = readFileSync(join(ROOT, "src/views/what-is-prp.tsx"), "utf8");
  for (const match of stripPrpAllowed(whatIsPrp).matchAll(new RegExp(PRP_STRICT.source, "gi"))) {
    found.push(`what-is-prp.tsx: ${match[0]}`);
  }
  assert.deepEqual(found, []);
});

test("PRP Facial copy does not name a skin-prep method", () => {
  const procedure = procedures.find((entry) => entry.slug === "prp-facial");
  assert.ok(procedure);
  const found = visibleCopy(procedure).filter((text) => /micro-?needl|microderm/i.test(text));
  assert.deepEqual(found, []);
});
