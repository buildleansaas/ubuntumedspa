import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { pathToRegexp } from "next/dist/compiled/path-to-regexp";

import { procedures } from "../data";
import { cardPriceLabel, formatUsdShort } from "./price";
import {
  getHubSatelliteGroup,
  getSatelliteLinks,
  HYPERHIDROSIS_SIDE_EFFECTS,
  hubPath,
  PALM_WEAKNESS_NOTE,
  PENINSULA_DRIVE_TIME,
  SATELLITE_TEMPLATE_COPY,
  satellitePath,
  serviceSatellitePages,
  serviceSatellitePaths,
} from "./service-satellites";
// Plain ES module shared with scripts/verify-seo.mjs.
import { unsupportedPrpBreastClaimClasses } from "../../scripts/lib/prp-breast-claims.mjs";

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

const EXPECTED_PATHS = [
  "/procedures/hyperhidrosis-treatment/for/underarm-sweating",
  "/procedures/hyperhidrosis-treatment/for/sweaty-palms",
  "/procedures/hyperhidrosis-treatment/for/sweaty-feet",
  "/procedures/prp-breast-lift/near/newport-news-va",
  "/procedures/prp-breast-lift/near/yorktown-va",
  "/procedures/prp-face-lift/near/newport-news-va",
  "/procedures/prp-face-lift/near/yorktown-va",
];

const CASH = {
  "hyperhidrosis-treatment": { cash: formatUsdShort(100000), card: cardPriceLabel(100000) },
  "prp-breast-lift": { cash: formatUsdShort(180000), card: cardPriceLabel(180000) },
  "prp-face-lift": { cash: formatUsdShort(150000), card: cardPriceLabel(150000) },
} as const;

/** Every string a satellite page renders from its data, joined the way rendered HTML text runs together. */
const visibleCopy = (page: (typeof serviceSatellitePages)[number]) =>
  [
    page.eyebrow,
    page.h1,
    ...page.intro,
    page.ctaLabel,
    SATELLITE_TEMPLATE_COPY.hubButton(page.hubSlug),
    SATELLITE_TEMPLATE_COPY.pricingEyebrow,
    page.price.heading,
    page.price.label,
    page.price.body,
    ...page.sections.flatMap((section) => [
      section.heading,
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
      ...(section.steps ?? []).flatMap((step) => [step.title, step.description]),
    ]),
    page.safety?.heading ?? "",
    page.safety?.body ?? "",
    SATELLITE_TEMPLATE_COPY.faqHeading,
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
    SATELLITE_TEMPLATE_COPY.relatedHeading,
    ...getSatelliteLinks(page).map((link) => link.label),
    SATELLITE_TEMPLATE_COPY.bookHeading,
    SATELLITE_TEMPLATE_COPY.bookIntro,
    page.textMessage,
  ].join(" ");

test("the seven satellite URLs exist, once each", () => {
  assert.deepEqual([...serviceSatellitePaths].sort(), [...EXPECTED_PATHS].sort());
  assert.equal(new Set(serviceSatellitePaths).size, serviceSatellitePaths.length);
});

test("titles are at most 60 characters and metas at most 160, all unique and localized", () => {
  for (const page of serviceSatellitePages) {
    const path = satellitePath(page);
    assert.ok(page.metaTitle.length <= 60, `${path} title is ${page.metaTitle.length}: ${page.metaTitle}`);
    assert.ok(page.metaDescription.length <= 160, `${path} meta is ${page.metaDescription.length}: ${page.metaDescription}`);
    assert.ok(page.metaDescription.length >= 100, `${path} meta is short: ${page.metaDescription}`);
    const place = page.kind === "near" ? page.label : "Williamsburg";
    assert.match(page.metaTitle, new RegExp(place), `${path} title drops ${place}`);
    assert.match(page.h1, new RegExp(place), `${path} H1 drops ${place}`);
  }
  for (const field of ["metaTitle", "metaDescription", "h1"] as const) {
    const values = serviceSatellitePages.map((page) => page[field]);
    assert.equal(new Set(values).size, values.length, `duplicate ${field}`);
  }
  // Satellites must not take the hubs' titles.
  for (const hub of ["hyperhidrosis-treatment", "prp-breast-lift", "prp-face-lift"]) {
    const hubTitle = procedures.find((procedure) => procedure.slug === hub)?.seo.title;
    assert.ok(hubTitle);
    assert.equal(serviceSatellitePages.some((page) => page.metaTitle === hubTitle), false, hub);
  }
});

test("price shows cash first, from the catalog, in the price block, title or meta", () => {
  for (const page of serviceSatellitePages) {
    const path = satellitePath(page);
    const { cash, card } = CASH[page.hubSlug];
    for (const [label, text] of [
      ["price label", page.price.label],
      ["price body", page.price.body],
      ["meta", page.metaDescription],
    ] as const) {
      const cashAt = text.indexOf(cash);
      const cardAt = text.indexOf(card);
      assert.ok(cashAt >= 0 && cardAt >= 0, `${path} ${label} is missing ${cash} or ${card}: ${text}`);
      assert.ok(cashAt < cardAt, `${path} ${label} puts card before cash: ${text}`);
      assert.doesNotMatch(text, /\bfees?\b|surcharge/i, `${path} ${label}`);
    }
    assert.ok(page.metaTitle.includes(cash), `${path} title drops the cash price`);
    assert.match(page.price.label, /cash · .* card\/online/);
  }
});

test("each satellite links to its hub and its siblings; near pages link to their location page", () => {
  for (const page of serviceSatellitePages) {
    const path = satellitePath(page);
    const hrefs = getSatelliteLinks(page).map((link) => link.href);
    assert.ok(hrefs.includes(hubPath(page.hubSlug)), `${path} does not link to its hub`);
    assert.equal(hrefs.includes(path), false, `${path} links to itself`);
    for (const sibling of serviceSatellitePages.filter((other) => other.hubSlug === page.hubSlug && other !== page)) {
      assert.ok(hrefs.includes(satellitePath(sibling)), `${path} does not link to sibling ${satellitePath(sibling)}`);
    }
    if (page.kind === "near") {
      assert.equal(page.locationHref, `/locations/${page.slug}`);
      assert.ok(hrefs.includes(`/locations/${page.slug}`), `${path} does not link to /locations/${page.slug}`);
    }
  }
  // The view renders exactly these links plus a hub button and breadcrumb.
  const view = read("src/views/service-satellite-page.tsx");
  assert.match(view, /getSatelliteLinks\(page\)/);
  assert.match(view, /href=\{hubPath\(page\.hubSlug\)\}/);
});

test("each hub links to all of its satellites", () => {
  for (const hub of ["hyperhidrosis-treatment", "prp-breast-lift", "prp-face-lift"]) {
    const group = getHubSatelliteGroup(hub);
    assert.ok(group, hub);
    const expected = serviceSatellitePages.filter((page) => page.hubSlug === hub).map(satellitePath);
    assert.deepEqual(group.links.map((link) => link.href).sort(), expected.sort(), hub);
  }
  assert.equal(getHubSatelliteGroup("xeomin"), null);
  const hubRoute = read("src/app/procedures/[slug]/page.tsx");
  assert.match(hubRoute, /getHubSatelliteGroup\(procedure\.slug\)/);
  assert.match(hubRoute, /satelliteGroup\.links\.map/);
});

test("the sitemaps list every satellite, and the routes serve exactly those slugs", () => {
  const sitemap = read("src/app/sitemap.ts");
  assert.match(sitemap, /\.\.\.serviceSatellitePaths\.map\(\(path\) => \(\{\s*url: `https:\/\/www\.williamsburgmedspa\.com\$\{path\}`/);
  assert.match(read("src/app/html-sitemap/page.tsx"), /serviceSatellitePages\.map/);
  for (const [route, hub] of [
    ["src/app/procedures/hyperhidrosis-treatment/for/[concernSlug]/page.tsx", "hyperhidrosis-treatment"],
    ["src/app/procedures/prp-breast-lift/near/[areaSlug]/page.tsx", "prp-breast-lift"],
    ["src/app/procedures/prp-face-lift/near/[areaSlug]/page.tsx", "prp-face-lift"],
  ]) {
    const source = read(route);
    assert.match(source, new RegExp(`getSatellitesForHub\\("${hub}"\\)`), route);
    assert.match(source, /dynamicParams = false/, route);
    assert.match(source, /canonical: satellitePath\(page\)/, route);
    assert.doesNotMatch(source, /noindex|index: false/, route);
  }
});

test("hyperhidrosis /for/ redirect skips the three satellites and still folds the other slugs into the hub", async () => {
  const { default: config } = await import("../../next.config.mjs");
  const redirects: Array<{ source: string; destination: string; has?: unknown[] }> = await (config.redirects?.() ?? Promise.resolve([]));
  // Host-conditioned redirects (apex and vercel.app aliases to www) never fire on the www host.
  const pathRedirects = redirects.filter((redirect) => !redirect.has);
  const matching = (path: string) =>
    pathRedirects.filter((redirect) => pathToRegexp(redirect.source, [], { sensitive: false, delimiter: "/" }).test(path));
  for (const path of EXPECTED_PATHS) {
    assert.deepEqual(matching(path), [], `${path} is redirected`);
  }
  for (const slug of ["facial-sweating", "scalp-hyperhidrosis", "groin-hyperhidrosis", "back-hyperhidrosis", "anything-else"]) {
    const hits = matching(`/procedures/hyperhidrosis-treatment/for/${slug}`);
    assert.equal(hits.length, 1, slug);
    assert.equal(hits[0].destination, "/procedures/hyperhidrosis-treatment");
  }
});

test("FAQ schema matches the visible FAQs: one list feeds both, questions are unique", () => {
  const view = read("src/views/service-satellite-page.tsx");
  assert.equal((view.match(/<StructuredData type="FAQ" faqs=\{page\.faqs\} \/>/g) ?? []).length, 1);
  assert.equal((view.match(/page\.faqs\.map\(/g) ?? []).length, 1, "the accordion renders page.faqs");
  assert.doesNotMatch(view, /faqs=\{(?!page\.faqs\})/);
  for (const page of serviceSatellitePages) {
    const questions = page.faqs.map((faq) => faq.question);
    assert.ok(questions.length >= 4, satellitePath(page));
    assert.equal(new Set(questions).size, questions.length, `${satellitePath(page)} has duplicate FAQ questions`);
    for (const faq of page.faqs) assert.ok(faq.answer.trim().length > 20, faq.question);
  }
});

test("hyperhidrosis pages use the hub's side-effect wording and stay conservative", () => {
  assert.match(HYPERHIDROSIS_SIDE_EFFECTS, /^Temporary injection-site tenderness, bruising, or localized weakness can happen\./);
  for (const page of serviceSatellitePages.filter((item) => item.hubSlug === "hyperhidrosis-treatment")) {
    assert.ok(page.safety?.body.startsWith(HYPERHIDROSIS_SIDE_EFFECTS), satellitePath(page));
    // The hand-muscle weakness note is on the palms page only.
    assert.equal(visibleCopy(page).includes(PALM_WEAKNESS_NOTE), page.slug === "sweaty-palms", satellitePath(page));
    if (page.slug !== "sweaty-feet") assert.ok(visibleCopy(page).includes("your body can still sweat normally in other areas"), satellitePath(page));
    assert.doesNotMatch(visibleCopy(page), /still sweats normally|keeps sweating/, satellitePath(page));
    assert.doesNotMatch(visibleCopy(page), /one clinic location|confirm the price/i, satellitePath(page));
    assert.ok(page.faqs.some((faq) => faq.answer.startsWith(HYPERHIDROSIS_SIDE_EFFECTS)), satellitePath(page));
    const copy = visibleCopy(page);
    assert.doesNotMatch(copy, /\b(?:cure|cures|permanent|guarantee[ds]?|stop sweating|no more sweat|100%|eliminat)/i, satellitePath(page));
    assert.match(copy, /Hampton Roads/);
    assert.match(copy, /Xeomin®/);
  }
});

test("near pages use the /locations drive time and never invent a local office", () => {
  assert.match(read("src/app/locations/page.tsx"), /Typically 25–35 minutes/);
  for (const page of serviceSatellitePages.filter((item) => item.kind === "near")) {
    const copy = visibleCopy(page);
    assert.ok(copy.includes(PENINSULA_DRIVE_TIME), satellitePath(page));
    assert.ok(
      copy.includes("There is no Newport News street address.") || copy.includes("The clinic is in Williamsburg, not Yorktown."),
      satellitePath(page)
    );
    assert.ok(copy.includes("3900 Powhatan Parkway, Williamsburg, VA 23188"), satellitePath(page));
    assert.doesNotMatch(copy, new RegExp(`${page.label}, VA 23\\d{3}`), `${satellitePath(page)} invented a local address`);
  }
});

test("PRP Breast Lift near pages pass the hub's unsupported-claim detectors and keep the not-surgery framing", () => {
  type ClaimClass = { name: string; expression: { test: (value: string) => boolean } };
  const classes = unsupportedPrpBreastClaimClasses as ClaimClass[];
  assert.ok(classes.length >= 5);
  // The detectors can fail (sanity check on one known-bad sentence).
  assert.ok(classes.some((claim) => claim.expression.test("PRP is injected into breast tissue.")));
  for (const page of serviceSatellitePages.filter((item) => item.hubSlug === "prp-breast-lift")) {
    const copy = visibleCopy(page);
    for (const claim of classes) {
      assert.equal(claim.expression.test(copy), false, `${satellitePath(page)} contains unsupported ${claim.name}`);
    }
    assert.ok(copy.includes("is not mastopexy, implants, or fat transfer"), satellitePath(page));
    assert.ok(copy.includes("does not promise a cosmetic result"), satellitePath(page));
    assert.doesNotMatch(copy, /blood|plasma|platelet|inject|needle/i, satellitePath(page));
  }
  // The hub's satellite grid also renders on the breast hub.
  const group = getHubSatelliteGroup("prp-breast-lift");
  assert.ok(group);
  const gridCopy = [group.eyebrow, group.heading, group.intro, ...group.links.flatMap((link) => [link.label, link.description])].join(" ");
  for (const claim of classes) assert.equal(claim.expression.test(gridCopy), false, `breast hub grid: ${claim.name}`);
});

test("PRP Face Lift near pages describe Xeomin® plus the PRP Facial, non-surgical, results vary", () => {
  for (const page of serviceSatellitePages.filter((item) => item.hubSlug === "prp-face-lift")) {
    const copy = visibleCopy(page);
    assert.match(copy, /Xeomin® for movement lines and the PRP Facial/);
    assert.match(copy, /not a surgical face lift/);
    assert.match(copy, /results vary/i);
  }
});

test("facials: PRP Facial hub links the HydraFacial guide, and the guide links back and is indexable", () => {
  const hubRoute = read("src/app/procedures/[slug]/page.tsx");
  assert.match(
    hubRoute,
    /"prp-facial": \[[^\]]*\{ href: "\/blog\/hydrafacial-alternatives-in-williamsburg-va", label: "HydraFacial alternatives in Williamsburg" \}/
  );
  const post = read("src/markdown/hydrafacial-alternatives-in-williamsburg-va.mdx");
  assert.match(post, /\[PRP Facial in Williamsburg\]\(\/procedures\/prp-facial\)/);
  assert.match(post, /^\s*published: true,$/m);
  assert.doesNotMatch(post, /noindex/i);
  // Published posts are in the sitemap (sitemap.ts maps getPublishedBlogPosts) and indexable (robots only when unpublished).
  assert.match(read("src/app/sitemap.ts"), /\.\.\.articles\.map\(/);
  assert.match(read("src/app/blog/[slug]/page.tsx"), /robots: metadata\.published \? undefined : \{ index: false, follow: false \}/);
});

test("there is no insurance FAQ on the hyperhidrosis hub or its satellites", () => {
  const hub = procedures.find((procedure) => procedure.slug === "hyperhidrosis-treatment");
  assert.ok(hub);
  assert.doesNotMatch(JSON.stringify(hub), /insur/i);
  for (const page of serviceSatellitePages) assert.doesNotMatch(visibleCopy(page), /insur/i, satellitePath(page));
});

const sentences = (text: string) =>
  new Set(
    text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.replace(/Newport News|Yorktown|newport-news-va|yorktown-va/g, "AREA").trim())
      .filter((sentence) => sentence.length > 20)
  );

test("Newport News and Yorktown pages for each service are substantively distinct (< 60% shared sentences)", () => {
  for (const hub of ["prp-breast-lift", "prp-face-lift"] as const) {
    const [first, second] = serviceSatellitePages.filter((page) => page.hubSlug === hub);
    assert.ok(first && second, hub);
    const a = sentences(visibleCopy(first));
    const b = sentences(visibleCopy(second));
    const shared = [...a].filter((sentence) => b.has(sentence)).length;
    const ratio = shared / Math.min(a.size, b.size);
    assert.ok(ratio < 0.6, `${hub}: ${shared}/${Math.min(a.size, b.size)} sentences shared (${(ratio * 100).toFixed(0)}%)`);
    for (const page of [first, second]) {
      const other = page === first ? b : a;
      const own = sentences(visibleCopy(page));
      const uniqueWords = [...own].filter((sentence) => !other.has(sentence)).join(" ").split(/\s+/).length;
      assert.ok(uniqueWords >= 150, `${satellitePath(page)} has ${uniqueWords} unique words`);
    }
  }
});
