import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

import { getCartRecommendations } from "../config/cart-recommendations";
import { COMMERCE_CATALOG, getCatalogConfigBySlug } from "../config/commerce-catalog";
import { FORM_INPUTS, procedures, products } from "../data";
import { normalizeCartItems } from "./cart-items";
import { resolveCart } from "./catalog";
import { getProcedureInterests, normalizeConsultInterests, XEOMIN_INTEREST } from "./consult-procedure-interests";
import { earPiercingIntentPages } from "./ear-piercing-intents";
import { EVENTS } from "./events";
import { localInjectableServicePages } from "./local-injectable-service-pages";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "./seo";

// Williamsburg Med Spa uses only Xeomin (incobotulinumtoxinA). It does not offer Botox brand.
// "Botox" may appear only as the searched-for term ("Botox alternative", "Looking for Botox in Williamsburg?"),
// a comparison ("Xeomin vs Botox"), the trademark notice, or a URL slug (/procedures/botox, /events/botox-party).

const ROOT = process.cwd();

/** Phrases that claim or imply the clinic offers, injects, sells, or books Botox. */
export const BOTOX_OFFER_CLAIMS: RegExp[] = [
  // Questions such as "Do you offer Botox®?" or "Do you offer Botox for Newport News patients?" are answered "No".
  /\b(we|Jenny|she|Williamsburg Med Spa|the clinic)\s+(offer|offers|provide|provides|use|uses|inject|injects|plan|plans|treat|treats|sell|sells)\s+Botox\b(?![^.!\n"]{0,40}\?)/i,
  /(?<!\b(?:not|never)\s)\b(offer|offers|offering|provide|provides|inject|injects|injecting|plan|plans|sell|sells|selling)\s+Botox\b(?![^.!\n"]{0,40}\?)/i,
  /Botox®?\s+(appointments?|injections?\s+(at|in|with))\b/i,
  /free\s+Botox/i,
  /Botox®?\s+part(y|ies)\b/i,
  /Botox-(led|first)\b/i,
  /\b(book|request|schedule)\s+(a\s+|my\s+|your\s+)?Botox\b/i,
  /Botox®?\s+(consultation|details|treatment planning)\b/i,
  /\bBotox®?,\s+Xeomin\b/i,
  /\b(whether|between)\s+Botox®?\s+(or|and)\s+Xeomin\b/i,
  // "Botox in Williamsburg" as an offering; "searching for / looking for Botox in Williamsburg" is the search term.
  /(?<!\b(?:for|about)\s)\bBotox®?\s+(in|near)\s+(Williamsburg|Newport News|Yorktown|James City County)\b(?!\?)/i,
];

/** URL slugs and code identifiers are not copy. */
const stripSlugsAndIdentifiers = (text: string) =>
  text
    // Lowercase slugs only (/procedures/botox, botox-party, botox-vs-xeomin-...); "Botox-led" copy is still checked.
    .replace(/[\w/-]*botox[\w-]*/g, (match) => (/[-/]/.test(match) ? "" : match))
    .replace(/\b[a-z]+Botox[A-Za-z]*\b|\bBOTOX_[A-Z_]+\b|\bBotox[A-Z][A-Za-z]*\b/g, "");

const walk = (dir: string, extensions: string[], recursive = true): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return recursive ? walk(path, extensions) : [];
    return extensions.some((ext) => name.endsWith(ext)) ? [path] : [];
  });

// Blog posts are the top-level src/markdown/*.mdx files (lib/blog.ts). src/markdown/ailments/botox/* is not served:
// next.config.mjs redirects every /procedures/botox/for/:ailmentSlug to /procedures/botox (asserted below).
const servedMdx = walk(join(ROOT, "src/markdown"), [".mdx"], false);
const sourceFiles = [
  ...walk(join(ROOT, "src/app"), [".tsx", ".ts"]),
  ...walk(join(ROOT, "src/views"), [".tsx"]),
  ...walk(join(ROOT, "src/components"), [".tsx"]),
  join(ROOT, "src/lib/seo.ts"),
  join(ROOT, "src/lib/events.ts"),
  join(ROOT, "src/lib/local-injectable-service-pages.ts"),
  join(ROOT, "src/config/commerce-catalog.ts"),
  join(ROOT, "src/config/cart-recommendations.ts"),
  join(ROOT, "src/data.ts"),
];

const renderedData = JSON.stringify([
  procedures,
  products,
  COMMERCE_CATALOG,
  localInjectableServicePages,
  EVENTS,
  earPiercingIntentPages,
  FORM_INPUTS,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
]);

export const findBotoxOfferClaims = (label: string, text: string) => {
  const cleaned = stripSlugsAndIdentifiers(text);
  const found: string[] = [];
  for (const pattern of BOTOX_OFFER_CLAIMS) {
    const match = cleaned.match(pattern);
    if (match) {
      const start = Math.max(0, (match.index ?? 0) - 60);
      found.push(`${label}: ${pattern} matched "${cleaned.slice(start, (match.index ?? 0) + match[0].length + 40)}"`);
    }
  }
  return found;
};

test("the claim patterns catch the old false copy (the test can fail)", () => {
  for (const falseClaim of [
    "Jenny Brady, MSN, RN, CPNP, PMHS plans Botox around forehead lines",
    "Most Botox appointments are short",
    "Five paid Botox guests gets the host free Botox.",
    "Host a Botox party that introduces friends",
    "Williamsburg Med Spa offers Botox, Xeomin, PRP treatments",
    "Medical Spa Williamsburg VA | Botox, Xeomin & PRP",
    "whether Botox or Xeomin is the better fit",
    "Request a Botox Consultation",
    "Botox injections at our Williamsburg clinic",
    "Botox in Williamsburg, VA | Natural-Looking Botox Injections",
    "We offer Botox for Newport News patients.",
  ]) {
    assert.ok(findBotoxOfferClaims("sample", falseClaim).length > 0, `pattern set missed: ${falseClaim}`);
  }
  for (const honest of [
    "A Botox Alternative in Williamsburg, VA: We Use Xeomin®",
    "Looking for Botox in Williamsburg? We use Xeomin®, a wrinkle relaxer in the same category.",
    "Do you offer Botox®? No. We use Xeomin® (incobotulinumtoxinA).",
    "Williamsburg Med Spa is not affiliated with Allergan and does not offer Botox® brand.",
    'href="/events/botox-party" and /procedures/botox and botox-vs-xeomin-williamsburg-va',
  ]) {
    assert.deepEqual(findBotoxOfferClaims("sample", honest), [], honest);
  }
});

test("rendered data never claims the clinic offers Botox", () => {
  assert.deepEqual(findBotoxOfferClaims("rendered data", renderedData), []);
  // "Botox" is never a catalog item, consult interest, procedure name, or locked event option.
  assert.doesNotMatch(renderedData, /"Botox"/);
});

test("served blog posts and page/view/lib source never claim the clinic offers Botox", () => {
  const problems = [...servedMdx, ...sourceFiles].flatMap((file) =>
    findBotoxOfferClaims(relative(ROOT, file), readFileSync(file, "utf8"))
  );
  assert.deepEqual(problems, []);
});

test("the unserved ailments/botox MDX stays unserved (every /procedures/botox/for/* redirects)", () => {
  const nextConfig = readFileSync(join(ROOT, "next.config.mjs"), "utf8");
  assert.match(nextConfig, /\["\/procedures\/botox\/for\/:ailmentSlug", "\/procedures\/botox"\]/);
  assert.match(nextConfig, /\["\/procedures\/botox\/near\/williamsburg-va", "\/procedures\/botox"\]/);
});

test("/procedures/botox is the honest Botox-alternative page and sells Xeomin", () => {
  const page = procedures.find((procedure) => procedure.slug === "botox");
  assert.ok(page);
  assert.match(page.seo.title, /Botox Alternative/);
  assert.match(page.seo.title, /Xeomin/);
  assert.equal(page.seo.title, "Botox Alternative in Williamsburg, VA | Xeomin® from $250 Cash");
  assert.match(page.seo.description, /Xeomin/);
  assert.match(page.seo.description, /\$250 cash per credit block \(\$257\.78 card\)/);
  assert.ok(page.seo.description.length <= 160, `meta is ${page.seo.description.length} characters`);
  assert.ok("h1" in page.seo && page.seo.h1 === "A Botox Alternative in Williamsburg, VA: We Use Xeomin®");
  assert.equal(
    "trademarkNote" in page ? page.trademarkNote : undefined,
    "Botox® is a registered trademark of Allergan Aesthetics, an AbbVie company. Williamsburg Med Spa is not affiliated with Allergan and does not offer Botox® brand."
  );
  assert.equal(page.faqs[0].question, "Do you offer Botox®?");
  assert.match(page.faqs[0].answer, /^No\. We use Xeomin® \(incobotulinumtoxinA\)/);
  assert.ok("catalogSlug" in page && page.catalogSlug === "xeomin");
  assert.equal(page.price, getCatalogConfigBySlug("xeomin")?.displayPrice);

  const xeomin = procedures.find((procedure) => procedure.slug === "xeomin");
  assert.ok(xeomin);
  assert.equal(xeomin.seo.title, "Xeomin® in Williamsburg, VA | Wrinkle Relaxer from $250 Cash");
  assert.match(xeomin.description, /Botox® alternative/);
});

test("the botox catalog item is gone and a stale cart cannot buy it", async () => {
  assert.equal(getCatalogConfigBySlug("botox"), null);
  assert.equal(COMMERCE_CATALOG.some((item) => /botox/i.test(`${item.slug} ${item.name} ${item.stripeProductKey}`)), false);
  assert.deepEqual(normalizeCartItems([{ slug: "botox", kind: "procedure", quantity: 1 }]), []);
  for (const slug of [...COMMERCE_CATALOG.map((item) => item.slug), "botox"]) {
    assert.equal(getCartRecommendations([slug], 10).some((item) => item.slug === "botox"), false, slug);
  }
  assert.equal(getCartRecommendations([], 10).some((item) => item.slug === "botox"), false);

  const previousMongoUri = process.env.MONGO_URI;
  delete process.env.MONGO_URI;
  try {
    await assert.rejects(resolveCart([{ slug: "botox", kind: "procedure", quantity: 1 }]), {
      message: '"botox" is no longer available online. Remove it from your cart to continue.',
    });
  } finally {
    if (previousMongoUri !== undefined) process.env.MONGO_URI = previousMongoUri;
  }
});

test('consult interest "Botox" became "Xeomin (Botox alternative)"; old values still map', () => {
  const interests = FORM_INPUTS.find((input) => input.id === "interests")?.options ?? [];
  assert.ok(interests.includes(XEOMIN_INTEREST));
  assert.equal(interests.includes("Botox"), false);
  assert.deepEqual(getProcedureInterests("botox"), [XEOMIN_INTEREST]);
  assert.deepEqual(getProcedureInterests("xeomin"), [XEOMIN_INTEREST]);
  assert.deepEqual(normalizeConsultInterests(["Botox", "Xeomin", "PRP Facial", "O-Shot"]), [
    XEOMIN_INTEREST,
    "PRP Facial",
    "OH-Shot",
  ]);
});
