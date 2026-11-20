import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

import { getCartRecommendations } from "../config/cart-recommendations";
import { COMMERCE_CATALOG, getCatalogConfigBySlug } from "../config/commerce-catalog";
import { FORM_INPUTS, procedures, products } from "../data";
import { normalizeCartItems } from "./cart-items";
import { pickStripeRecord } from "./catalog";
import {
  allowedConsultInterests,
  BOTOX_INTEREST,
  getProcedureInterests,
  normalizeConsultInterests,
  XEOMIN_INTEREST,
} from "./consult-procedure-interests";
import { earPiercingIntentPages } from "./ear-piercing-intents";
import { EVENTS } from "./events";
import { localInjectableServicePages } from "./local-injectable-service-pages";
import { serviceSatellitePages } from "./service-satellites";
import { BOTOX_OFF_LABEL_NOTE, XEOMIN_CLUSTER_REDIRECTS, XEOMIN_TRADEMARK_NOTE, xeominClusterPages } from "./xeomin-concerns";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "./seo";

// Williamsburg Med Spa offers Botox® and Xeomin®, priced the same (Austin, 2026-11-20). From 2026-11-04 to 2026-11-20
// the site said it used only Xeomin and did not offer Botox, and Google rankings for "botox williamsburg" fell.
// This test fails if any served copy, data, or agent note says the clinic does not offer Botox or uses only Xeomin.

const ROOT = process.cwd();

const B = String.raw`Botox®?`;
export const FALSE_BOTOX_CLAIMS: RegExp[] = [
  // "does not offer Botox", "don't carry Botox", "no longer offers Dysport or Botox®"
  new RegExp(
    String.raw`(?:\bnot|\bnever|n't|\bno longer)\s+(?:currently\s+)?(?:offer|offers|carry|carries|provide|provides|sell|sells|use|uses)\s+(?:Dysport\s+or\s+)?${B}`,
    "gi"
  ),
  new RegExp(String.raw`\bno\s+${B}\s+brand\b`, "gi"),
  // "Botox is not offered", "Botox® isn't available here"
  new RegExp(String.raw`${B}\s+(?:brand\s+)?(?:is\s+not|isn't|is\s+no\s+longer)\s+(?:offered|available|sold|carried)`, "gi"),
  new RegExp(String.raw`${B}\s*\((?:not offered|which Williamsburg Med Spa does not offer)`, "gi"),
  new RegExp(String.raw`\bXeomin®?,?\s+not\s+${B}`, "gi"),
  new RegExp(String.raw`\bLooking for ${B}[^?]{0,60}\?\s*We use Xeomin`, "gi"),
  // "uses only Xeomin", "only Xeomin", "Xeomin only", "Xeomin-only", "We use Xeomin®"
  /\bonly\s+(?:uses?|offers?|carr(?:y|ies))?\s*Xeomin\b/gi,
  /\bXeomin®?[\s-]+only\b/gi,
  /\bwe use Xeomin\b/gi,
  // "its only wrinkle relaxer is Xeomin", "Xeomin, our wrinkle relaxer", "the clinic's wrinkle relaxer"
  /\b(?:only|sole)\s+wrinkle[\s-]relaxer\b/gi,
  /\b(?:our|the clinic's)\s+wrinkle[\s-]relaxer\b(?!s)(?!\s+part)/gi,
  // A "Do you offer Botox?" question answered "No" in the same text.
  new RegExp(String.raw`\bDo(?:es)?\s+(?:you|we|Williamsburg Med Spa)\s+offer\s+${B}[^?\n]{0,60}\?["'\s,]*(?:answer:\s*)?["'\x60]?\s*No\b`, "gi"),
];

/**
 * Text that records the old Xeomin-only rule as history, or tells agents never to write it, is not a claim. A match is
 * skipped only when the 100 characters before it contain one of these markers.
 */
const HISTORY_MARKERS = /never write|revers|2026-11-04|PR #155|until 2026-11-20|From 2026-11-04/i;

export const findFalseBotoxClaims = (label: string, text: string) => {
  const found: string[] = [];
  for (const pattern of FALSE_BOTOX_CLAIMS) {
    for (const match of text.matchAll(new RegExp(pattern.source, pattern.flags))) {
      const index = match.index ?? 0;
      if (HISTORY_MARKERS.test(text.slice(Math.max(0, index - 100), index))) continue;
      found.push(`${label}: "${text.slice(Math.max(0, index - 50), index + 70).replace(/\s+/g, " ")}"`);
    }
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
// agent and repo notes, so a future session cannot reintroduce the Xeomin-only claim from them.
const isScannedSource = (path: string) => !/\.test\.tsx?$/.test(path) && !path.includes("node_modules");
const scannedFiles = [
  ...walk(join(ROOT, "src"), [".ts", ".tsx", ".mdx", ".md", ".json"]).filter(isScannedSource),
  ...walk(join(ROOT, ".agents"), [".md"]),
  join(ROOT, "LOCALIZATION.md"),
];

/**
 * Dated SEO notes written while the site said "Xeomin only". They are records, not instructions: each must carry the
 * 2026-11-20 update line, and only then is its body skipped. The list is explicit, so a new note cannot opt out.
 */
export const BOTOX_BACK_LINE =
  "Update 2026-11-20: the clinic offers Botox® and Xeomin® again, priced the same (this reverses PR #155's Xeomin-only change of 2026-11-04). It still does not offer filler.";
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

const renderedData = [
  procedures,
  products,
  COMMERCE_CATALOG,
  localInjectableServicePages,
  serviceSatellitePages,
  EVENTS,
  earPiercingIntentPages,
  xeominClusterPages,
  FORM_INPUTS,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
];

/** Every { question, answer } pair anywhere in the rendered data. */
const collectFaqs = (value: unknown, out: Array<{ question: string; answer: string }> = []) => {
  if (Array.isArray(value)) value.forEach((item) => collectFaqs(item, out));
  else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.question === "string" && typeof record.answer === "string") {
      out.push({ question: record.question, answer: record.answer });
    }
    Object.values(record).forEach((item) => collectFaqs(item, out));
  }
  return out;
};

test("the detector catches Xeomin-only wording and passes the honest Botox and Xeomin copy (the test can fail)", () => {
  for (const falseClaim of [
    "Williamsburg Med Spa does not offer Botox® brand.",
    "We don't offer Botox.",
    "The clinic no longer offers Dysport or Botox®.",
    "Williamsburg Med Spa does not offer Dysport or Botox® brand.",
    "Xeomin, no Botox brand.",
    "Botox is not offered here.",
    "Botox® isn't available at Williamsburg Med Spa.",
    "| Botox® (not offered here) | Xeomin® (what we use) |",
    "Williamsburg Med Spa uses Xeomin, not Botox.",
    "Looking for Botox® for frown lines? We use Xeomin®.",
    "The clinic uses only Xeomin.",
    "Williamsburg Med Spa uses Xeomin only.",
    "We use Xeomin® only.",
    "A Botox alternative in Williamsburg, VA: we use Xeomin®",
    "The clinic's only wrinkle relaxer is Xeomin.",
    "Xeomin, our wrinkle relaxer, addresses lines.",
    "Xeomin, the clinic's wrinkle relaxer (a Botox® alternative), relaxes muscles.",
    'question: "Do you offer Botox®?",\n        answer:\n          "No. We use Xeomin®.',
  ]) {
    assert.ok(findFalseBotoxClaims("sample", falseClaim).length > 0, `detector missed: ${falseClaim}`);
  }
  for (const honest of [
    "Williamsburg Med Spa offers Botox® and Xeomin®, priced the same. Jenny helps you choose.",
    "Do you offer Botox®? Yes. Williamsburg Med Spa offers Botox® Cosmetic and Xeomin®.",
    "Williamsburg Med Spa does not offer Dysport.",
    "No. Williamsburg Med Spa does not offer dermal fillers, including lip filler.",
    "Williamsburg Med Spa does not offer Hydrafacial, Kybella, Sculptra, or CoolSculpting.",
    "Botox® is a registered trademark of Allergan, Inc., an AbbVie company. Williamsburg Med Spa is not affiliated with Allergan or Merz.",
    "Botox and Xeomin, our wrinkle relaxers, address lines caused by movement.",
    "Never write that the clinic does not offer Botox or uses only Xeomin.",
    "Update 2026-11-20: this reverses PR #155's Xeomin-only change.",
  ]) {
    assert.deepEqual(findFalseBotoxClaims("sample", honest), [], honest);
  }
});

test("rendered data never says the clinic does not offer Botox; every 'offer Botox?' FAQ answers Yes", () => {
  assert.deepEqual(findFalseBotoxClaims("rendered data", JSON.stringify(renderedData)), []);
  const botoxFaqs = collectFaqs(renderedData).filter(({ question }) => /\boffer Botox/i.test(question));
  assert.ok(botoxFaqs.length >= 5, `only ${botoxFaqs.length} "offer Botox" FAQs found`);
  for (const faq of botoxFaqs) assert.match(faq.answer, /^Yes\b/, faq.question);
});

test("served copy, source, and agent notes never say the clinic does not offer Botox or uses only Xeomin", () => {
  for (const note of HISTORICAL_NOTES) {
    const head = readFileSync(join(ROOT, note), "utf8").split("\n").slice(0, 6).join("\n");
    assert.ok(head.includes(BOTOX_BACK_LINE), `${note} is missing the 2026-11-20 update line at the top`);
  }
  const docsSeo = walk(join(ROOT, "docs/seo"), [".md"], false).filter(
    (file) => !HISTORICAL_NOTES.includes(relative(ROOT, file))
  );
  const problems = [...scannedFiles, ...docsSeo].flatMap((file) =>
    findFalseBotoxClaims(relative(ROOT, file), readFileSync(file, "utf8"))
  );
  assert.deepEqual(problems, []);
});

test("trademark notices name Allergan, say not affiliated, and never say Botox is not offered", () => {
  const botoxPage = procedures.find((procedure) => procedure.slug === "botox");
  const notes = [
    botoxPage && "trademarkNote" in botoxPage ? botoxPage.trademarkNote : "",
    XEOMIN_TRADEMARK_NOTE,
    readFileSync(join(ROOT, "src/markdown/botox-vs-xeomin-williamsburg-va.mdx"), "utf8"),
    readFileSync(join(ROOT, "src/app/terms/page.tsx"), "utf8"),
  ];
  for (const note of notes) {
    assert.match(note, /Botox® is a registered trademark of Allergan, Inc\., an AbbVie company/);
    assert.match(note, /not\s+affiliated with Allergan/);
  }
  assert.equal(
    botoxPage && "trademarkNote" in botoxPage ? botoxPage.trademarkNote : undefined,
    XEOMIN_TRADEMARK_NOTE,
    "the Botox page and the Xeomin pages share one trademark notice"
  );
});

test("/procedures/botox redirects keep working: /for/<concern> to the Xeomin concern page, the rest to /procedures/botox", () => {
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

test("/procedures/botox is the Botox page: Botox title and H1, sells the botox item, links Xeomin, label-based claims", () => {
  const page = procedures.find((procedure) => procedure.slug === "botox");
  assert.ok(page);
  assert.equal(page.name, "Botox");
  assert.equal(page.seo.title, "Botox in Williamsburg, VA | Botox & Xeomin from $250 Cash");
  assert.ok(page.seo.title.length <= 60, `title is ${page.seo.title.length} characters`);
  assert.ok("h1" in page.seo && page.seo.h1 === "Botox® in Williamsburg, VA");
  assert.match(page.seo.description, /Botox® and Xeomin®/);
  assert.match(page.seo.description, /\$250 cash per credit block \(\$257\.78 card\)/);
  assert.ok(page.seo.description.length <= 160, `meta is ${page.seo.description.length} characters`);
  assert.ok("catalogSlug" in page && page.catalogSlug === "botox");
  assert.equal(page.price, procedures.find((procedure) => procedure.slug === "xeomin")?.price);
  assert.equal(page.faqs[0].question, "Do you offer Botox®?");
  assert.match(page.faqs[0].answer, /^Yes\. Williamsburg Med Spa offers Botox® Cosmetic and Xeomin®/);
  assert.ok(page.faqs.some((faq) => /Botox or Xeomin/.test(faq.question)), "has a 'Botox or Xeomin' FAQ");

  // BOTOX Cosmetic label (DailyMed, revised 10/2024): glabellar, lateral canthal, forehead lines, platysma bands. Anything
  // else on the page is called off-label.
  assert.match(page.description, /frown lines, crow's feet, forehead lines, and vertical neck \(platysma\) bands/);
  assert.match(BOTOX_OFF_LABEL_NOTE, /frown lines, crow's feet, forehead lines, and vertical neck \(platysma\) bands/);
  const onLabel = new Set(["forehead-lines", "frown-lines", "crows-feet", "neck-band-softening"]);
  for (const ailment of page.ailments) {
    if (!onLabel.has(ailment.slug)) assert.match(ailment.description, /off-label/i, ailment.slug);
  }
  const allCopy = JSON.stringify(page);
  assert.doesNotMatch(allCopy, /sweat|hyperhidrosis|migraine/i, "therapeutic BOTOX uses are not cosmetic claims");
  assert.doesNotMatch(allCopy, /lasts? longer|works? faster|better than Xeomin/i, "no head-to-head outcome claims");

  const view = readFileSync(join(ROOT, "src/app/procedures/[slug]/page.tsx"), "utf8");
  assert.match(view, /procedure\.slug === "botox" && \(\s*<p[^>]*data-off-label-note>\s*\{BOTOX_OFF_LABEL_NOTE\}/);
  assert.match(view, /botox: \[\s*\{ href: "\/procedures\/xeomin", label: "Xeomin" \}/);

  const xeomin = procedures.find((procedure) => procedure.slug === "xeomin");
  assert.ok(xeomin);
  assert.equal(xeomin.seo.title, "Xeomin® in Williamsburg, VA | Wrinkle Relaxer from $250 Cash");
  assert.match(xeomin.description, /alongside Botox®/);
});

test("the botox catalog item is back, priced exactly like Xeomin", () => {
  const botox = getCatalogConfigBySlug("botox");
  const xeomin = getCatalogConfigBySlug("xeomin");
  assert.ok(botox && xeomin);
  assert.equal(botox.name, "Botox");
  assert.equal(botox.kind, "procedure");
  for (const field of ["pricingMode", "cashAmountCents", "unitAmountCents", "currency", "quantityLabel", "minQuantity", "maxQuantity", "displayPrice"] as const) {
    assert.deepEqual(botox[field], xeomin[field], field);
  }
  assert.equal(botox.cashAmountCents, 25000);
  assert.equal(botox.unitAmountCents, 25778);
  assert.equal(botox.stripeProductKey, "wms_procedure_botox");
  assert.equal(botox.stripePriceLookupKey, "wms_procedure_botox_block_250_v1");
  assert.ok(botox.imagePath && existsSync(join(ROOT, "public", botox.imagePath)), botox.imagePath);
  assert.match(botox.customerNote ?? "", /^Botox is prepaid online in \$250 credit blocks/);

  assert.deepEqual(normalizeCartItems([{ slug: "botox", kind: "procedure", quantity: 2 }]), [
    { slug: "botox", kind: "procedure", quantity: 2 },
  ]);
  assert.ok(getCartRecommendations(["botox"], 4).length > 0, "a Botox cart gets recommendations");
  // A cart that already holds one wrinkle relaxer is not pushed the other one, either way round.
  assert.equal(getCartRecommendations(["xeomin"], 10).some((item) => item.slug === "botox"), false);
  assert.equal(getCartRecommendations(["botox"], 10).some((item) => item.slug === "xeomin"), false);
  assert.equal(getCartRecommendations(["botox", "co2-lift"], 10).some((item) => item.slug === "xeomin"), false);
});

test("a retired (active: false) Mongo record is never used for checkout; legacy slugs still resolve", () => {
  const records = {
    botox: { active: false, stripePriceId: "price_archived" },
    "o-shot": { active: false, stripePriceId: "price_oshot" },
    xeomin: { active: true, stripePriceId: "price_xeomin" },
  };
  assert.equal(pickStripeRecord(records, "botox"), undefined);
  assert.equal(pickStripeRecord(records, "xeomin")?.stripePriceId, "price_xeomin");
  assert.equal(pickStripeRecord(records, "oh-shot", "o-shot")?.stripePriceId, "price_oshot");
});

test('consult offers "Botox" and "Xeomin" separately; the 2026-11 "Xeomin (Botox alternative)" label still maps', () => {
  const interests = FORM_INPUTS.find((input) => input.id === "interests")?.options ?? [];
  assert.equal(BOTOX_INTEREST, "Botox");
  assert.equal(XEOMIN_INTEREST, "Xeomin");
  assert.ok(interests.includes("Botox"));
  assert.ok(interests.includes("Xeomin"));
  assert.equal(interests.includes("Xeomin (Botox alternative)"), false);
  assert.deepEqual(getProcedureInterests("botox"), ["Botox"]);
  assert.deepEqual(getProcedureInterests("xeomin"), ["Xeomin"]);
  assert.deepEqual(normalizeConsultInterests(["Xeomin (Botox alternative)", "Xeomin", "PRP Facial", "O-Shot"]), [
    "Xeomin",
    "PRP Facial",
    "OH-Shot",
  ]);
  assert.deepEqual(allowedConsultInterests(["Botox", "Xeomin (Botox alternative)"]), ["Botox", "Xeomin"]);
});
