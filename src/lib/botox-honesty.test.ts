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

// Williamsburg Med Spa uses only Xeomin (incobotulinumtoxinA). It does not offer Botox® brand.
// This is an allowlist: every "Botox" token in served copy, data, and agent notes must sit in one of the contexts
// below (the search term, a comparison, a "we do not offer" statement, the trademark notice). Anything else fails,
// so new wording such as "Botox treatments in our office" or "We carry Botox" cannot slip in.

const ROOT = process.cwd();

const B = String.raw`Botox®?`;
export const ALLOWED_BOTOX_CONTEXTS: RegExp[] = [
  // The search term.
  new RegExp(String.raw`${B}[\s-]+alternatives?\b`, "gi"),
  new RegExp(String.raw`\b(?:looking|searching|searched|search)\s+for\s+${B}`, "gi"),
  // Saying we do not offer it, and the questions the copy answers "No" to.
  new RegExp(String.raw`\b(?:not|never|don't|do not|doesn't|does not)\s+(?:currently\s+)?offer(?:s)?\s+(?:Dysport\s+or\s+)?${B}`, "gi"),
  new RegExp(String.raw`\bnot\s+${B}`, "gi"),
  new RegExp(String.raw`\bDo(?:es)?\s+(?:you|we|Williamsburg Med Spa)\s+offer\s+${B}`, "gi"),
  new RegExp(String.raw`${B}\s*\((?:not offered here|which Williamsburg Med Spa does not offer)\)`, "gi"),
  // Comparisons.
  new RegExp(String.raw`\b(?:vs\.?|versus|or|than|compared with|compares with|compare it with|comparing Xeomin with|same as|different from|differ from|differs from|interchangeable with)\s+${B}`, "gi"),
  new RegExp(String.raw`${B}\s+(?:vs\.?|versus)\s`, "gi"),
  new RegExp(String.raw`\bsame\s+(?:treatment\s+)?category\s+as\s+${B}`, "gi"),
  new RegExp(String.raw`\b(?:Both\s+|Are\s+)?(?:${B}\s+and\s+Xeomin®?|Xeomin®?\s+and\s+${B})\s+(?:are|have|as|units\s+are|the\s+same)\b`, "gi"),
  new RegExp(String.raw`\bIs\s+${B}\s+the\s+same\s+as\b`, "gi"),
  new RegExp(String.raw`\bhad\s+${B}`, "gi"),
  new RegExp(String.raw`\bmention\s+${B}`, "gi"),
  new RegExp(String.raw`${B}\s+appears\s+only\s+as\s+the\s+search\s+term`, "gi"),
  // The trademark notice and the FDA label citation.
  new RegExp(String.raw`${B}\s+is\s+a\s+registered\s+trademark\s+of\s+Allergan`, "gi"),
  /\bBOTOX Cosmetic Prescribing Information\b/g,
];

/** URL slugs, image paths, object keys, and code identifiers are not copy. */
const stripSlugsAndIdentifiers = (text: string) =>
  text
    // Lowercase slugs and paths (/procedures/botox, botox-party, botox-vs-xeomin-..., *.webp) and the "botox" slug literal.
    .replace(/[\w/.-]*botox[\w.-]*/g, (match) => (/[-/.]/.test(match) ? " " : match))
    .replace(/(["'`])botox\1|\bbotox(?=\s*:)/g, " ")
    .replace(/\b[a-z]+Botox[A-Za-z]*\b|\bbotox[A-Z][A-Za-z]*\b|\bBOTOX_[A-Z_]+\b|\bBotox[A-Z][A-Za-z]*\b/g, " ");

export const findDisallowedBotox = (label: string, text: string) => {
  const cleaned = stripSlugsAndIdentifiers(text);
  const covered: Array<[number, number]> = [];
  for (const pattern of ALLOWED_BOTOX_CONTEXTS) {
    for (const match of cleaned.matchAll(new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`))) {
      covered.push([match.index ?? 0, (match.index ?? 0) + match[0].length]);
    }
  }
  const found: string[] = [];
  for (const match of cleaned.matchAll(/botox/gi)) {
    const index = match.index ?? 0;
    if (covered.some(([start, end]) => index >= start && index < end)) continue;
    found.push(`${label}: "${cleaned.slice(Math.max(0, index - 60), index + 50).replace(/\s+/g, " ")}"`);
  }
  return found;
};

const walk = (dir: string, extensions: string[], recursive = true): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return recursive ? walk(path, extensions) : [];
    return extensions.some((ext) => name.endsWith(ext)) ? [path] : [];
  });

// Blog posts are the top-level src/markdown/*.mdx files (lib/blog.ts). The ailments/botox MDX pages are redirected,
// but their metadata decides which treatment-area cards show, so they are held to the same rule.
const scannedFiles = [
  ...walk(join(ROOT, "src/markdown"), [".mdx"], false),
  ...walk(join(ROOT, "src/markdown/ailments/botox"), [".mdx"]),
  ...walk(join(ROOT, "src/app"), [".tsx", ".ts"]),
  ...walk(join(ROOT, "src/views"), [".tsx"]),
  ...walk(join(ROOT, "src/components"), [".tsx"]),
  join(ROOT, "src/lib/seo.ts"),
  join(ROOT, "src/lib/events.ts"),
  join(ROOT, "src/lib/local-injectable-service-pages.ts"),
  join(ROOT, "src/config/commerce-catalog.ts"),
  join(ROOT, "src/config/cart-recommendations.ts"),
  join(ROOT, "src/data.ts"),
  // Agent and repo notes, so a future session cannot reintroduce Botox offer copy from them.
  ...walk(join(ROOT, ".agents"), [".md"]),
  join(ROOT, "LOCALIZATION.md"),
  join(ROOT, "docs/seo/google-business-profile-plan-2026-10-03.md"),
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

test("the allowlist rejects offer wording and accepts the honest contexts (the test can fail)", () => {
  for (const falseClaim of [
    "Soften Smoker's Lines with Xeomin and Botox",
    "Botox & Xeomin",
    "Botox treatments in our office",
    "Botox Cosmetic by Jenny",
    "Botox injections for crow's feet",
    "Prepay Botox",
    "Botox credit blocks",
    "We carry Botox",
    "free Botox",
    "Jenny Brady, MSN, RN, CPNP, PMHS plans Botox around forehead lines",
    "Most Botox appointments are short",
    "Host a Botox party that introduces friends",
    "Williamsburg Med Spa offers Botox, Xeomin, PRP treatments",
    "Medical Spa Williamsburg VA | Botox, Xeomin & PRP",
    "Request a Botox Consultation",
    "Botox in Williamsburg, VA",
  ]) {
    assert.ok(findDisallowedBotox("sample", falseClaim).length > 0, `allowlist accepted: ${falseClaim}`);
  }
  for (const honest of [
    "A Botox Alternative in Williamsburg, VA: We Use Xeomin®",
    "Looking for Botox in Williamsburg? We use Xeomin®, a wrinkle relaxer in the same category as Botox®.",
    "Do you offer Botox®? No. We use Xeomin® (incobotulinumtoxinA).",
    "Botox® is a registered trademark of Allergan, Inc., an AbbVie company. Williamsburg Med Spa is not affiliated with Allergan and does not offer Botox® brand.",
    "Xeomin vs Botox. Botox vs Xeomin. Both Xeomin and Botox® are botulinum toxin type A products. If you have had Botox® elsewhere.",
    'href="/events/botox-party" and /procedures/botox and botox-vs-xeomin-williamsburg-va and "/procedure/botox-closeup.webp"',
  ]) {
    assert.deepEqual(findDisallowedBotox("sample", honest), [], honest);
  }
});

test("rendered data mentions Botox only in allowed contexts", () => {
  assert.deepEqual(findDisallowedBotox("rendered data", renderedData), []);
  // "Botox" is never a catalog item, consult interest, procedure name, or locked event option.
  assert.doesNotMatch(renderedData, /"Botox"/);
});

test("served copy, source, and agent notes mention Botox only in allowed contexts", () => {
  const problems = scannedFiles.flatMap((file) => findDisallowedBotox(relative(ROOT, file), readFileSync(file, "utf8")));
  assert.deepEqual(problems, []);
});

test("every /procedures/botox/for/* and /procedures/botox/near/williamsburg-va URL redirects to /procedures/botox", () => {
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
    "Botox® is a registered trademark of Allergan, Inc., an AbbVie company. Williamsburg Med Spa is not affiliated with Allergan and does not offer Botox® brand."
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
