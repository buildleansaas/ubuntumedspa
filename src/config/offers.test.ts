import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { COMMERCE_CATALOG_BY_SLUG } from "./commerce-catalog";
import { OFFERS, OFFERS_TITLE, OFFERS_DESCRIPTION, activeOfferMetaDescription, getActiveOffers, isOfferActive } from "./offers";
import { cardPriceCents } from "../lib/price";

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");
// tsconfig has jsx: "preserve", so tsx compiles JSX with the classic runtime and needs a global React.
(globalThis as { React?: typeof React }).React = React;
const unescape = (value: string) =>
  value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const sibling = OFFERS.find((offer) => offer.slug === "sibling-ear-piercing")!;

test("sibling offer (Austin 2026-11-05): 2 kids, both ears, $140 cash vs the catalog's $160, card by the checkout formula", () => {
  assert.ok(sibling);
  const piercing = COMMERCE_CATALOG_BY_SLUG["blomdahl-ear-piercing"];
  assert.equal(piercing.cashQuantityPriceBreaks?.[2], 4000);
  assert.equal(sibling.regularCashCents, 16000);
  assert.equal(sibling.offerCashCents, 14000);
  assert.equal(cardPriceCents(14000), 14450);
  assert.equal(sibling.title, "Sibling Ear Piercing: 2 Kids, Both Ears, $140");
  assert.ok(sibling.title.length <= 58, "Google offer titles are capped at 58 characters");
  // Austin 2026-11-05: the offer is booked by text or call; online purchases stay at the regular price (no refunds of the difference).
  assert.match(sibling.terms, /\$140 cash or \$144\.50 by card\. Book by text or call to get the sibling price; online purchases are at the regular price\./);
  assert.match(sibling.terms, /Ends December 31, 2026\.$/);
  assert.equal(sibling.endsOn, "2026-12-31");
  // Facts the site already states about ear piercing (src/data.ts).
  const data = read("src/data.ts");
  assert.match(data, /6 months or older/);
  assert.match(data, /Medical Plastic or titanium starter earrings/);
  assert.match(sibling.details.join(" "), /6 months or older with pediatrician guidance/);
});

test("clinicToday is the America/New_York calendar date in YYYY-MM-DD", () => {
  const { clinicToday } = require("./offers") as typeof import("./offers");
  assert.equal(clinicToday(new Date("2027-01-01T04:59:59Z")), "2026-12-31");
  assert.equal(clinicToday(new Date("2027-01-01T05:00:00Z")), "2027-01-01");
  assert.equal(clinicToday(new Date("2026-07-01T03:59:59Z")), "2026-06-30");
});

test("offers run from startsOn through endsOn (clinic time) and then disappear", () => {
  assert.equal(isOfferActive(sibling, "2026-11-04"), false);
  assert.equal(isOfferActive(sibling, "2026-11-05"), true);
  assert.equal(isOfferActive(sibling, "2026-12-31"), true);
  assert.equal(isOfferActive(sibling, "2027-01-01"), false);
  assert.deepEqual(getActiveOffers("2027-01-01"), []);
  assert.deepEqual(getActiveOffers("2026-12-01").map((offer) => offer.slug), ["sibling-ear-piercing"]);
});

test("no financing claim anywhere in offers (the clinic has no financing provider)", () => {
  for (const file of ["src/config/offers.ts", "src/app/offers/page.tsx", "src/components/offers-nav-link.tsx"]) {
    const source = read(file).replace(/\/\*[\s\S]*?\*\//g, "");
    assert.doesNotMatch(source, /financ|pay over time|monthly payments|afterpay|affirm|klarna|cherry/i, file);
  }
  assert.doesNotMatch(JSON.stringify(OFFERS), /financ/i);
});

test("no hand-typed dollar amounts or fee wording in the offers page and badge", () => {
  for (const file of ["src/app/offers/page.tsx", "src/components/offers-nav-link.tsx"]) {
    const source = read(file);
    assert.doesNotMatch(source, /\$\s?\d/, file);
    assert.doesNotMatch(source, /\bfees?\b|surcharge/i, file);
  }
  assert.doesNotMatch(JSON.stringify(OFFERS) + OFFERS_TITLE + OFFERS_DESCRIPTION, /\bfees?\b|surcharge/i);
  assert.ok(OFFERS_TITLE.length <= 60 && OFFERS_DESCRIPTION.length <= 160);
});

test("/offers renders one H1, cash before card, the terms, and a text-Jenny CTA", () => {
  const { default: OffersPage } = require("../app/offers/page") as typeof import("../app/offers/page");
  const html = unescape(renderToStaticMarkup(createElement(OffersPage)));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  if (getActiveOffers().length) {
    const block = html.match(/data-offer-price[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "";
    assert.ok(block.indexOf("$140 cash") >= 0 && block.indexOf("$140 cash") < block.indexOf("$144.50 card"), block);
    assert.match(html, /data-offer-terms/);
    assert.match(html, /Regular cash price <\/span><s>\$160<\/s>/);
    assert.match(html, /sms:/);
  } else {
    assert.match(html, /data-no-offers/);
  }
});

test("the header shows the highlighted Offers link (desktop and mobile); footer and sitemaps list /offers", () => {
  const header = read("src/components/header.tsx");
  assert.match(header, /<OffersNavLink initialCount=\{offerCount\} \/>/);
  assert.match(header, /<OffersNavLink initialCount=\{offerCount\} variant="compact" \/>/);
  assert.match(header, /const offerCount = getActiveOffers\(\)\.length;/);
  const badge = read("src/components/offers-nav-link.tsx");
  // The first client render must match the server HTML (no hydration mismatch): seed from the prop, recount after mount.
  assert.match(badge, /useState\(initialCount\)/);
  assert.doesNotMatch(badge, /useState\(\(\) => getActiveOffers/);
  assert.match(badge, /useEffect\(\(\) => \{\s*setCount\(getActiveOffers\(\)\.length\);/);
  assert.match(badge, /if \(count === 0/);
  assert.match(read("src/components/footer.tsx"), /\{ href: "\/offers", label: "Offers" \}/);
  assert.match(read("src/app/sitemap.ts"), /\.\.\.\(getActiveOffers\(\)\.length \? \[\{\s*url: "https:\/\/www\.williamsburgmedspa\.com\/offers",?\s*\}\] : \[\]\)/);
  assert.match(read("src/app/offers/page.tsx"), /getActiveOffers\(\)\.length \? metadata : \{ \.\.\.metadata, robots: \{ index: false, follow: true \} \}/);
  assert.match(read("src/app/html-sitemap/page.tsx"), /\{ href: "\/offers", label: "Offers" \}/);
  assert.match(read("src/app/procedures/[slug]/page.tsx"), /data-offer-callout=\{offer\.slug\}/);
});

test("the holiday piercing post shows the sibling offer only while it runs, from config, with a tagged /offers link", () => {
  const { default: OfferCallout, offerEndsLabel, offerCalloutHref } =
    require("../components/offer-callout") as typeof import("../components/offer-callout");
  assert.equal(offerEndsLabel("2026-12-31"), "December 31, 2026");
  assert.equal(
    offerCalloutHref(sibling, "holiday_sibling_offer"),
    "/offers?utm_source=website&utm_medium=blog&utm_campaign=holiday_sibling_offer#sibling-ear-piercing"
  );
  const render = (initialActive: boolean) =>
    unescape(
      renderToStaticMarkup(
        createElement(OfferCallout, { slug: "sibling-ear-piercing", campaign: "holiday_sibling_offer", initialActive })
      )
    );
  const html = render(true);
  assert.match(html, /Sibling Ear Piercing: 2 Kids, Both Ears, \$140, through December 31, 2026\./);
  assert.match(html, /\$140 cash instead of \$160/);
  assert.match(html, /By card it is \$144\.50\./);
  assert.match(html, /href="\/offers\?utm_source=website&utm_medium=blog&utm_campaign=holiday_sibling_offer#sibling-ear-piercing"/);
  assert.equal(render(false), "", "an inactive offer renders nothing");
  assert.equal(
    renderToStaticMarkup(createElement(OfferCallout, { slug: "no-such-offer", campaign: "x", initialActive: true })),
    ""
  );
  // Seeded from the server render, re-checked after mount (same pattern as the header badge).
  const callout = read("src/components/offer-callout.tsx");
  assert.match(callout, /useState\(initialActive\)/);
  assert.match(callout, /setActive\(offer \? isOfferActive\(offer\) : false\)/);
  assert.doesNotMatch(callout, /\$\d/, "no hand-typed dollar amounts");

  const post = read("src/markdown/planning-holiday-ear-piercing-williamsburg-va.mdx");
  assert.match(
    post,
    /<OfferCallout slug="sibling-ear-piercing" campaign="holiday_sibling_offer" initialActive=\{getActiveOffers\(\)\.some\(\(offer\) => offer\.slug === "sibling-ear-piercing"\)\} \/>/
  );
  // The offer stays out of the post's FAQ (and so its FAQPage JSON-LD), which outlives the offer.
  const faqs = post.slice(post.indexOf("faqs:"), post.indexOf("};"));
  assert.doesNotMatch(faqs, /sibling|offer|140/i);
  // Existing copy is kept apart from "the regular price", so the line stays true next to the offer.
  assert.match(post, /A holiday does not change the piercing system, the regular price, or the age guidance\./);
});

test("an offer's search snippet shows only while it runs, on the page it points to", () => {
  const sibling = OFFERS.find((offer) => offer.slug === "sibling-ear-piercing");
  assert.ok(sibling?.metaDescription);
  const hub = sibling.learnMoreHref;
  assert.equal(activeOfferMetaDescription(hub, sibling.startsOn), sibling.metaDescription);
  assert.equal(activeOfferMetaDescription(hub, sibling.endsOn), sibling.metaDescription);
  assert.equal(activeOfferMetaDescription(hub, "2027-01-01"), undefined, "gone the day after it ends");
  assert.equal(activeOfferMetaDescription("/procedures/xeomin", sibling.startsOn), undefined, "only on its own page");
  for (const offer of OFFERS.filter((item) => item.metaDescription)) {
    const text = offer.metaDescription ?? "";
    assert.ok(text.length <= 160, `${offer.slug}: snippet is ${text.length} characters`);
    const cash = text.indexOf(" cash");
    const card = text.indexOf(" card");
    assert.ok(cash > 0 && card > cash, `${offer.slug}: cash price before card price`);
    assert.doesNotMatch(text, /botox/i);
  }
  const verifier = readFileSync(join(process.cwd(), "scripts", "verify-seo.mjs"), "utf8");
  assert.ok(verifier.includes(sibling.metaDescription), "verify:seo expects the same snippet text");
  assert.ok(verifier.includes(`endsOn: "${sibling.endsOn}"`), "verify:seo uses the same end date");
  assert.ok(verifier.includes(`startsOn: "${sibling.startsOn}"`), "verify:seo uses the same start date");
  const endsLabel = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric" }).format(
    new Date(`${sibling.endsOn}T00:00:00Z`)
  );
  assert.ok(sibling.metaDescription.includes(`through ${endsLabel}:`), "the snippet's end date is the offer's endsOn");
});
