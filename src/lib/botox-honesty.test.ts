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
import { XEOMIN_CLUSTER_REDIRECTS, xeominClusterPages } from "./xeomin-concerns";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "./seo";

// Williamsburg Med Spa uses only Xeomin (incobotulinumtoxinA). It does not offer Botox® brand.
// This is an allowlist: every "Botox" token in served copy, data, and agent notes must sit in one of the contexts
// below (the search term, a comparison, a "we do not offer" statement, the trademark notice). Anything else fails,
// so new wording such as "Botox treatments in our office" or "We carry Botox" cannot slip in.

const ROOT = process.cwd();

const B = String.raw`Botox®?`;
export const ALLOWED_BOTOX_CONTEXTS: RegExp[] = [
  // 1. The search term.
  new RegExp(String.raw`${B}[\s-]+alternatives?\b`, "gi"),
  new RegExp(String.raw`\b(?:looking|searching|searched|search)\s+for\s+${B}`, "gi"),
  new RegExp(String.raw`${B}\s+appears\s+only\s+as\s+the\s+search\s+term`, "gi"),
  // 2. A "we do not offer Botox®" statement, and the questions the copy answers "No" to.
  new RegExp(String.raw`\b(?:not|never|don't|do not|doesn't|does not)\s+(?:currently\s+)?offer(?:s)?\s+(?:Dysport\s+or\s+)?${B}`, "gi"),
  new RegExp(String.raw`\b(?:uses Xeomin|Xeomin),\s+not\s+${B}`, "gi"),
  new RegExp(String.raw`\bnot\s+Dysport\s+or\s+${B}`, "gi"),
  new RegExp(String.raw`\bDo(?:es)?\s+(?:you|we|Williamsburg Med Spa)\s+offer\s+${B}(?![^.!\n"]{0,40}\?\s*Yes)`, "gi"),
  new RegExp(String.raw`\bno\s+${B}\s+brand\b`, "gi"),
  new RegExp(String.raw`${B}\s*\((?:not offered here|which Williamsburg Med Spa does not offer)\)`, "gi"),
  // 3. Comparisons, limited to the forms the copy uses.
  new RegExp(String.raw`\b(?:vs\.?|versus|compared with|compares with|compare it with|comparing Xeomin with|different from|differ from|differs from|interchangeable with|longer than)\s+${B}`, "gi"),
  new RegExp(String.raw`${B}\s+(?:vs\.?|versus)\s+Xeomin\s+in\s+Williamsburg\b`, "gi"),
  new RegExp(String.raw`\b(?:Is\s+Xeomin|not)\s+the\s+same\s+as\s+${B}`, "gi"),
  new RegExp(String.raw`\bIs\s+${B}\s+the\s+same\s+as\s+Kybella\b`, "gi"),
  new RegExp(String.raw`\bsame\s+(?:treatment\s+)?category\s+as\s+${B}`, "gi"),
  new RegExp(
    String.raw`\b(?:Both\s+|Are\s+)?(?:${B}\s+and\s+Xeomin®?|Xeomin®?\s+and\s+${B})\s+(?:are\s+both\s+(?:botulinum|neuromodulators|medical treatments)|are\s+botulinum|are\s+distinct\s+products|are\s+often\s+compared|are\s+prescription|are\s+wrinkle\s+relaxers|as\s+temporary\s+treatments|have\s+in\s+common|units\s+are\s+not\s+interchangeable|the\s+same\s+thing)\b`,
    "gi"
  ),
  new RegExp(String.raw`\bhad\s+${B}\s+(?:elsewhere|before)\b`, "gi"),
  new RegExp(String.raw`\bmention\s+${B}`, "gi"),
  // 4. The trademark notice and the FDA label citation.
  new RegExp(String.raw`${B}\s+is\s+a\s+registered\s+trademark\s+of\s+Allergan`, "gi"),
  /\bBOTOX Cosmetic Prescribing Information\b/g,
  // Legacy consult-form value mapped to "Xeomin (Botox alternative)" (consult-procedure-interests.ts).
  /\bBotox: XEOMIN_INTEREST\b/g,
];

/** Hyphenated slugs and ids that exist in the code. Anything else hyphenated ("botox-injections") is copy. */
const BOTOX_SLUGS = [
  "botox-vs-xeomin-williamsburg-va",
  "botox-party-callout-heading",
  "botox-party-callout",
  "botox-party",
  "botox-consultation",
];

/** URL paths, file names, known slugs, the quoted "botox" slug, code identifiers, and (in code) `botox:` keys. */
const stripSlugsAndIdentifiers = (text: string, isCode: boolean) => {
  let cleaned = text
    // Paths and URLs (contain "/") and file names (end in an extension).
    .replace(/[\w.:~%/-]*botox[\w.~%/-]*/gi, (match) =>
      match.includes("/") || /\.(?:webp|png|jpe?g|avif|svg|pdf|tsx?|mdx?|json)$/i.test(match) ? " " : match
    )
    .replace(new RegExp(String.raw`(?<![\w-])(?:${BOTOX_SLUGS.join("|")})(?![\w-])`, "g"), " ")
    .replace(/(["'`])botox\1/g, " ")
    .replace(/\b[a-z]+Botox[A-Za-z]*\b|\bbotox[A-Z][A-Za-z]*\b|\bBOTOX_[A-Z_]+\b|\bBotox[A-Z][A-Za-z]*\b/g, " ");
  // Object keys only: `botox:` at the start of a line (strings such as "Book botox: $250" are still copy).
  if (isCode) cleaned = cleaned.replace(/^(\s*)botox(?=\s*:)/gm, "$1 ");
  return cleaned;
};

/** In Markdown notes, a backticked search query such as `botox williamsburg va` is a quoted search term. */
const stripQuotedQueries = (text: string) => text.replace(/`[a-z0-9 ]*botox[a-z0-9 ]*`/g, " ");

export const findDisallowedBotox = (label: string, text: string, kind: "copy" | "code" | "notes" = "copy") => {
  let cleaned = stripSlugsAndIdentifiers(text, kind === "code");
  if (kind === "notes") cleaned = stripQuotedQueries(cleaned);
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

// Everything under src/ that can hold copy or data (tests excluded: they quote the false claims on purpose), plus
// agent and repo notes, so a future session cannot reintroduce Botox offer copy from them.
const isScannedSource = (path: string) => !/\.test\.tsx?$/.test(path) && !path.includes("node_modules");
const scannedFiles = [
  ...walk(join(ROOT, "src"), [".ts", ".tsx", ".mdx", ".md", ".json"]).filter(isScannedSource),
  ...walk(join(ROOT, ".agents"), [".md"]),
  join(ROOT, "LOCALIZATION.md"),
  ...walk(join(ROOT, "docs/seo"), [".md"], false),
];
/**
 * Dated SEO planning notes written while the site still listed Botox and filler. They are records, not instructions:
 * each must carry the supersede line near the top, and only then is its body skipped. The list is explicit, so a new
 * note cannot opt out by adding the line.
 */
export const SUPERSEDE_LINE =
  "Update 2026-11-04 (PR #155): the clinic uses only Xeomin (no Botox® brand) and no longer offers filler.";
const HISTORICAL_NOTES = [
  "docs/seo/oct-2026-owner-slice-baselines.md",
  "docs/seo/piercing-consolidation-2026-10.md",
  "docs/seo/post-deploy-indexing-queue-2026-05-16.md",
  "docs/seo/williamsburg-10x-growth-plan-2026-07-23.md",
  "docs/seo/williamsburg-dermal-filler-owner-slice-2026-09-29.md",
  "docs/seo/williamsburg-james-city-county-owner-slice-2026-07-21.md",
  "docs/seo/williamsburg-newport-news-growth-slice.md",
  "docs/seo/williamsburg-protected-query-owner-ledger.md",
];
const kindOf = (path: string) => (/\.tsx?$/.test(path) ? "code" : path.startsWith(join(ROOT, "src")) ? "copy" : "notes");

const renderedData = JSON.stringify([
  procedures,
  products,
  COMMERCE_CATALOG,
  localInjectableServicePages,
  EVENTS,
  earPiercingIntentPages,
  xeominClusterPages,
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
    "Prepay Xeomin or Botox",
    "Jenny Brady, MSN, RN, CPNP, PMHS plans Botox around forehead lines",
    "Most Botox appointments are short",
    "Host a Botox party that introduces friends",
    "Williamsburg Med Spa offers Botox, Xeomin, PRP treatments",
    "Medical Spa Williamsburg VA | Botox, Xeomin & PRP",
    "Request a Botox Consultation",
    "Botox in Williamsburg, VA",
    // Round 2: offers dressed up as comparisons, slug-looking copy, and loose contexts.
    "Xeomin and Botox as low as $250",
    "Botox and Xeomin are $250 per block",
    "Both Botox and Xeomin are offered by Jenny",
    "Botox and Xeomin have openings this week",
    "Xeomin and Botox are both available here.",
    "We carry botox.",
    "Book botox: $250",
    "Get botox-injections today",
    "We offer more than Botox",
    "Xeomin is the same as Botox.",
    "Clients who had Botox here love it",
    "Do we offer Botox? Yes!",
    "Our Botox vs. Xeomin special",
  ]) {
    assert.ok(findDisallowedBotox("sample", falseClaim).length > 0, `allowlist accepted: ${falseClaim}`);
  }
  for (const honest of [
    "A Botox Alternative in Williamsburg, VA: We Use Xeomin®",
    "Looking for Botox in Williamsburg? We use Xeomin®, a wrinkle relaxer in the same category as Botox®.",
    "Do you offer Botox®? No. We use Xeomin® (incobotulinumtoxinA).",
    "Botox® is a registered trademark of Allergan, Inc., an AbbVie company. Williamsburg Med Spa is not affiliated with Allergan and does not offer Botox® brand.",
    "Xeomin vs Botox. Botox vs Xeomin in Williamsburg, VA. Both Xeomin and Botox® are botulinum toxin type A products. If you have had Botox® elsewhere.",
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
  for (const note of HISTORICAL_NOTES) {
    const head = readFileSync(join(ROOT, note), "utf8").split("\n").slice(0, 5).join("\n");
    assert.ok(head.includes(SUPERSEDE_LINE), `${note} is missing the 2026-11-04 supersede line at the top`);
  }
  const problems = scannedFiles
    .filter((file) => !HISTORICAL_NOTES.includes(relative(ROOT, file)))
    .flatMap((file) =>
    findDisallowedBotox(relative(ROOT, file), readFileSync(file, "utf8"), kindOf(file))
  );
  assert.deepEqual(problems, []);
});

test("/procedures/botox/for/<concern> redirects to the Xeomin concern page; every other /procedures/botox/for/* and /near/williamsburg-va to /procedures/botox", () => {
  const nextConfig = readFileSync(join(ROOT, "next.config.mjs"), "utf8");
  assert.match(nextConfig, /\["\/procedures\/botox\/for\/:ailmentSlug", "\/procedures\/botox"\]/);
  assert.match(nextConfig, /\["\/procedures\/botox\/near\/williamsburg-va", "\/procedures\/botox"\]/);
  const catchAll = nextConfig.indexOf('["/procedures/botox/for/:ailmentSlug", "/procedures/botox"]');
  const concernRedirects = XEOMIN_CLUSTER_REDIRECTS.filter(([source]) => source.startsWith("/procedures/botox/for/"));
  assert.deepEqual(
    concernRedirects.map(([source]) => source),
    ["frown-lines", "forehead-lines", "crows-feet", "lip-flip"].map((slug) => `/procedures/botox/for/${slug}`)
  );
  for (const [source, destination] of concernRedirects) {
    assert.match(destination, /^\/procedures\/xeomin\/for\//);
    const index = nextConfig.indexOf(`["${source}", "${destination}"]`);
    assert.ok(index > 0 && index < catchAll, `${source} -> ${destination} must be listed above the catch-all`);
  }
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
