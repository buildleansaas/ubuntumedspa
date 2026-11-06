import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CartProvider } from "../components/cart-provider";
import { getCatalogConfigBySlug } from "../config/commerce-catalog";
import { procedures } from "../data";
import XeominClusterPageView from "../views/xeomin-cluster-page";
import { findDisallowedBotox } from "./botox-honesty.test";
import {
  XEOMIN_HYPERHIDROSIS_OFF_LABEL,
  XEOMIN_OFF_LABEL_NOTE,
  XEOMIN_CLUSTER_REDIRECTS,
  XEOMIN_HUB_ANCHOR,
  XEOMIN_HUB_PATH,
  XEOMIN_LIP_FLIP_OFF_LABEL,
  XEOMIN_PRODUCT_PATH,
  XEOMIN_SEEK_HELP,
  XEOMIN_SIDE_EFFECTS,
  xeominClusterPages,
  xeominConcernPages,
  xeominCostPage,
} from "./xeomin-concerns";

// The project compiles JSX with the classic runtime (jsx: preserve), so the views expect a global React.
(globalThis as { React?: typeof React }).React = React;

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

const render = (page: (typeof xeominClusterPages)[number]) =>
  renderToStaticMarkup(React.createElement(CartProvider, null, React.createElement(XeominClusterPageView, { page })));

const visibleText = (html: string) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");

const EXPECTED = {
  "/procedures/xeomin/for/frown-lines": {
    title: "Xeomin for Frown Lines in Williamsburg, VA | From $250 Cash",
    description:
      "Looking for Botox® for frown lines (11s)? We use Xeomin® in Williamsburg, VA. $250 cash per credit block ($257.78 card). Nurse-led, conservative dosing.",
    h1: "Xeomin for Frown Lines (11s) in Williamsburg, VA",
  },
  "/procedures/xeomin/for/forehead-lines": {
    title: "Xeomin for Forehead Lines in Williamsburg, VA | From $250 Cash",
    description:
      "Looking for Botox® for forehead lines? We use Xeomin® in Williamsburg, VA. $250 cash per credit block ($257.78 card). Planned around your brows.",
    h1: "Xeomin for Forehead Lines in Williamsburg, VA",
  },
  "/procedures/xeomin/for/crows-feet": {
    title: "Xeomin for Crow's Feet in Williamsburg, VA | From $250 Cash",
    description:
      "Looking for Botox® for crow's feet? We use Xeomin® in Williamsburg, VA. $250 cash per credit block ($257.78 card). Planned to keep a natural smile.",
    h1: "Xeomin for Crow's Feet in Williamsburg, VA",
  },
  "/procedures/xeomin/for/lip-flip": {
    title: "Xeomin Lip Flip in Williamsburg, VA | From $250 Cash",
    description:
      "Looking for Botox® for a lip flip? We use Xeomin® in Williamsburg, VA. Consult first: it does not add volume. $250 cash per credit block ($257.78 card).",
    h1: "Xeomin Lip Flip in Williamsburg, VA",
  },
  "/procedures/xeomin/cost": {
    title: "Xeomin Cost in Williamsburg, VA | $250 Cash per Credit Block",
    description:
      "Xeomin cost in Williamsburg, VA: $250 cash per credit block ($257.78 card). Your total depends on areas and dosing. Unused credit stays on your account.",
    h1: "Xeomin Cost in Williamsburg, VA",
  },
} as const;

test("the cluster is the four concern pages plus the cost page, at the expected URLs", () => {
  assert.deepEqual(
    xeominClusterPages.map((page) => page.path),
    Object.keys(EXPECTED)
  );
  assert.deepEqual(
    xeominConcernPages.map((page) => page.slug),
    ["frown-lines", "forehead-lines", "crows-feet", "lip-flip"]
  );
  assert.equal(xeominCostPage.path, "/procedures/xeomin/cost");
});

test("titles, metas, and H1s are exact, within limits, exact-match first, and cash before card", () => {
  for (const page of xeominClusterPages) {
    const expected = EXPECTED[page.path as keyof typeof EXPECTED];
    assert.equal(page.metaTitle, expected.title, page.path);
    assert.equal(page.metaDescription, expected.description, page.path);
    assert.equal(page.h1, expected.h1, page.path);
    assert.ok(page.metaTitle.length <= 65, `${page.path} title is ${page.metaTitle.length} characters`);
    assert.ok(page.metaDescription.length <= 160, `${page.path} meta is ${page.metaDescription.length} characters`);
    assert.match(page.metaTitle, /^Xeomin .+ in Williamsburg, VA \| /);
    assert.ok(page.metaDescription.indexOf("$250 cash") >= 0, `${page.path} meta has no cash price`);
    assert.ok(page.metaDescription.indexOf("$250 cash") < page.metaDescription.indexOf("$257.78"), `${page.path} meta is not cash first`);
    assert.doesNotMatch(`${page.metaTitle} ${page.metaDescription}`, /\bfee\b|surcharge/i);
  }
});

test("prices come from the Xeomin catalog item ($250 cash, $257.78 card)", () => {
  const item = getCatalogConfigBySlug("xeomin");
  assert.ok(item);
  assert.equal(item.cashAmountCents, 25000);
  assert.equal(item.unitAmountCents, 25778);
});

test("concern pages say we use Xeomin for the Botox® search, and lip flip stays consult-led", () => {
  for (const page of xeominConcernPages) {
    assert.match(page.botoxLine, /^Looking for Botox® for .+\? We use Xeomin®/);
    assert.ok(page.faqs.length >= 4 && page.faqs.length <= 6, `${page.path} has ${page.faqs.length} FAQs`);
  }
  const lipFlip = xeominConcernPages.find((page) => page.slug === "lip-flip");
  assert.ok(lipFlip);
  assert.equal(lipFlip.areaTag, "uncommon");
  const lipCopy = JSON.stringify(lipFlip);
  assert.match(lipCopy, /less common area/i);
  assert.match(lipCopy, /does not add volume/);
  assert.match(lipCopy, /consultation/);
});

test("copy makes no outcome promises and no before/after claims", () => {
  const copy = JSON.stringify(xeominClusterPages);
  assert.doesNotMatch(copy, /guarantee|before[- ]and[- ]after|before\/after|risk-free|painless|permanent|best results|no side effects/i);
  assert.match(xeominCostPage.sections.map((section) => JSON.stringify(section)).join(" "), /units are not interchangeable/);
  assert.match(JSON.stringify(xeominCostPage), /any unused value remains as account credit/);
});

test("lip flip is labeled off-label in the intro and in an FAQ", () => {
  const lipFlip = xeominConcernPages.find((page) => page.slug === "lip-flip");
  assert.ok(lipFlip);
  assert.ok(lipFlip.intro.startsWith(XEOMIN_LIP_FLIP_OFF_LABEL));
  assert.ok(lipFlip.faqs.some(({ answer }) => /off-label/.test(answer)));
  for (const page of xeominClusterPages.filter((candidate) => candidate.slug !== "lip-flip")) {
    assert.doesNotMatch(JSON.stringify(page), /off-label/, page.path);
  }
});

test("the cost page keeps only sourced pricing facts and does not copy the hub's cost FAQ", () => {
  const copy = JSON.stringify(xeominCostPage);
  assert.doesNotMatch(copy, /not a (?:fixed|set) number of units|different plan from|sold as treatment credit/);
  assert.match(copy, /Each block adds \$250 of treatment credit/);
  assert.match(copy, /Your total depends on the areas treated, muscle strength, and your dosing plan/);
  assert.match(copy, /unused value remains as account credit/);
  assert.match(copy, /Xeomin and Botox® units are not interchangeable/);
  const hub = procedures.find((procedure) => procedure.slug === "botox");
  assert.ok(hub);
  for (const hubFaq of hub.faqs) {
    for (const faq of xeominCostPage.faqs) {
      assert.notEqual(faq.question, hubFaq.question);
      assert.notEqual(faq.answer, hubFaq.answer);
    }
  }
});

test("the /procedures/xeomin page agrees with the cluster on duration (about 3 to 4 months)", () => {
  const copy = JSON.stringify(procedures.find((procedure) => procedure.slug === "xeomin"));
  assert.doesNotMatch(copy, /3 to 6 months|3-6 months/);
  assert.match(copy, /about 3 to 4 months/);
});

test("the side-effects line is the one already used on the site", () => {
  assert.ok(read("src/markdown/botox-vs-xeomin-williamsburg-va.mdx").includes(XEOMIN_SIDE_EFFECTS.replace(/^Temporary/, "temporary")));
  assert.ok(read("src/config/gbp-posts.ts").includes(XEOMIN_SIDE_EFFECTS));
});

for (const page of xeominClusterPages) {
  test(`${page.path} renders one H1, hub and product links, siblings, cash-first price, and FAQ schema = visible FAQs`, () => {
    const html = render(page);
    const text = visibleText(html);

    const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((match) => visibleText(match[1]).trim());
    assert.deepEqual(h1s, [page.h1]);

    // Hub link with the descriptive anchor, and the product page.
    const hubAnchors = [...html.matchAll(new RegExp(`<a[^>]+href="${XEOMIN_HUB_PATH}"[^>]*>([\\s\\S]*?)</a>`, "g"))].map((match) =>
      visibleText(match[1]).trim()
    );
    assert.ok(hubAnchors.includes(XEOMIN_HUB_ANCHOR), `${page.path} hub anchors: ${JSON.stringify(hubAnchors)}`);
    assert.match(html, new RegExp(`href="${XEOMIN_PRODUCT_PATH}"`));
    for (const sibling of xeominClusterPages.filter((candidate) => candidate.slug !== page.slug)) {
      assert.match(html, new RegExp(`href="${sibling.path}"`), `${page.path} does not link to ${sibling.path}`);
    }
    assert.doesNotMatch(html, new RegExp(`href="${page.path}"`), `${page.path} links to itself`);

    // Cash first, everywhere the price block appears.
    assert.ok(text.includes("$250 cash per credit block"), `${page.path} has no cash-first price line`);
    assert.ok(text.indexOf("$250 cash") < text.indexOf("$257.78"), `${page.path} shows the card price first`);
    assert.ok(text.includes(XEOMIN_SIDE_EFFECTS), `${page.path} is missing the side-effects line`);
    assert.ok(text.includes(XEOMIN_SEEK_HELP), `${page.path} is missing the get-medical-help line`);
    assert.ok(text.indexOf(XEOMIN_SEEK_HELP) > text.indexOf(XEOMIN_SIDE_EFFECTS), `${page.path} shows the get-medical-help line before the side effects`);

    // No sentence repeats on the page.
    const sentences = text
      .split(/(?<=[.?!])\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length >= 40);
    const repeated = sentences.filter((sentence, index) => sentences.indexOf(sentence) !== index);
    assert.deepEqual(repeated, [], `${page.path} repeats sentences`);
    assert.match(html, /href="sms:\+18047389483\?&amp;body=/);

    // FAQ schema only for FAQs that are visible on the page.
    const faqSchemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]))
      .filter((schema) => schema["@type"] === "FAQPage");
    assert.equal(faqSchemas.length, 1);
    const schemaQuestions = faqSchemas[0].mainEntity.map((entry: { name: string }) => entry.name);
    const visibleQuestions = [...html.matchAll(/<div data-faq-question="true"><dt[^>]*>([\s\S]*?)<\/dt>/g)].map((match) =>
      visibleText(match[1]).trim()
    );
    assert.equal(visibleQuestions.length, page.faqs.length);
    assert.deepEqual(schemaQuestions, visibleQuestions);
    for (const { answer } of page.faqs) assert.ok(text.includes(answer), `${page.path} hides an FAQ answer`);

    // The honesty allowlist holds over the rendered page, not only the source.
    assert.deepEqual(findDisallowedBotox(page.path, text), []);
  });
}

test("sitemap.ts and the HTML sitemap source map every cluster page (source check, not rendered)", () => {
  const sitemap = read("src/app/sitemap.ts");
  assert.match(sitemap, /\.\.\.xeominClusterPages\.map\(\(page\) => \(\{\s*url: `https:\/\/www\.williamsburgmedspa\.com\$\{page\.path\}`/);
  assert.match(read("src/app/html-sitemap/page.tsx"), /\.\.\.xeominClusterPages\.map\(\(page\) => \(\{\s*href: page\.path/);
});

test("the procedure page source adds hero chips and the Xeomin by concern block for botox and xeomin (source check, not rendered)", () => {
  const procedurePage = read("src/app/procedures/[slug]/page.tsx");
  const blocks = procedurePage.match(/\(procedure\.slug === "botox" \|\| procedure\.slug === "xeomin"\) && \([\s\S]*?xeominClusterPages\.map/g) ?? [];
  assert.equal(blocks.length, 2, "expected hero chips and the Xeomin by concern section");
  assert.match(procedurePage, /Xeomin by concern/);
});

test("next.config.mjs lists each old concern URL redirect above the /procedures/botox/for catch-all (source check)", () => {
  const nextConfig = read("next.config.mjs");
  const catchAll = nextConfig.indexOf('["/procedures/botox/for/:ailmentSlug", "/procedures/botox"]');
  assert.ok(catchAll > 0);
  for (const [source, destination] of XEOMIN_CLUSTER_REDIRECTS) {
    const index = nextConfig.indexOf(`["${source}", "${destination}"]`);
    assert.ok(index > 0, `missing redirect ${source} -> ${destination}`);
    assert.ok(index < catchAll, `${source} must sit above the catch-all`);
  }
  assert.equal(XEOMIN_CLUSTER_REDIRECTS.length, 6);
});

test("#164: the Botox-alternative and Xeomin pages carry an off-label note for each listed non-label area they mention", () => {
  const route = readFileSync(join(process.cwd(), "src/app/procedures/[slug]/page.tsx"), "utf8");
  assert.match(route, /\(procedure\.slug === "botox" \|\| procedure\.slug === "xeomin"\) && \(\s*<p[^>]*data-off-label-note>\s*\{XEOMIN_OFF_LABEL_NOTE\}/);
  assert.match(XEOMIN_OFF_LABEL_NOTE, /frown lines, forehead lines, and crow's feet/);
  const offLabel: Array<[RegExp, RegExp]> = [
    [/lip[- ]flip/i, /lip flip/],
    [/bunny lines/i, /bunny lines/],
    [/gummy smile/i, /gummy smile/],
    [/chin dimpling/i, /chin dimpling/],
    [/neck bands?|platysm/i, /neck bands/],
    [/masseter|bruxism|jaw/i, /masseter/],
    [/lower-face/i, /jaw \(masseter\)/],
  ];
  // Sweating is covered by its own note, shown on the hyperhidrosis hub and the Xeomin hub.
  assert.match(JSON.stringify(procedures.find((procedure) => procedure.slug === "xeomin")), /hyperhidrosis/i);
  assert.match(route, /procedure\.slug === "xeomin"\) && \(\s*<p[^>]*data-off-label-note>\s*\{XEOMIN_HYPERHIDROSIS_OFF_LABEL\}/);
  for (const slug of ["botox", "xeomin"]) {
    const entry = procedures.find((procedure) => procedure.slug === slug);
    assert.ok(entry, slug);
    const rendered = JSON.stringify(entry);
    for (const [mention, covered] of offLabel) {
      if (mention.test(rendered)) assert.match(XEOMIN_OFF_LABEL_NOTE, covered, `${slug} mentions ${mention} but the note does not cover it`);
    }
  }
  assert.doesNotMatch(XEOMIN_OFF_LABEL_NOTE, /Botox/);
});

test("hyperhidrosis (not on Xeomin's label) is called off-label on the hub and every sweating satellite", async () => {
  const route = readFileSync(join(process.cwd(), "src/app/procedures/[slug]/page.tsx"), "utf8");
  // The Xeomin hub mentions "hyperhidrosis use" in its related guidance, so it carries the sweating note too.
  assert.match(route, /\(procedure\.slug === "hyperhidrosis-treatment" \|\| procedure\.slug === "xeomin"\) && \(\s*<p[^>]*data-off-label-note>\s*\{XEOMIN_HYPERHIDROSIS_OFF_LABEL\}/);
  const { serviceSatellitePages } = await import("./service-satellites");
  const sweating = serviceSatellitePages.filter((page) => page.hubSlug === "hyperhidrosis-treatment");
  assert.equal(sweating.length, 3);
  for (const page of sweating) assert.ok(page.safety?.body.includes(XEOMIN_HYPERHIDROSIS_OFF_LABEL), page.slug);
});
