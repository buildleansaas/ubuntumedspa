import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { COMMERCE_CATALOG_BY_SLUG } from "./commerce-catalog";
import { OFFERS, OFFERS_TITLE, OFFERS_DESCRIPTION, getActiveOffers, isOfferActive } from "./offers";
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
  assert.match(sibling.terms, /\$140 cash or \$144\.50 by card, applied at the clinic; online checkout shows regular prices\./);
  assert.match(sibling.terms, /Ends December 31, 2026\.$/);
  assert.equal(sibling.endsOn, "2026-12-31");
  // Facts the site already states about ear piercing (src/data.ts).
  const data = read("src/data.ts");
  assert.match(data, /6 months or older/);
  assert.match(data, /Medical Plastic or titanium starter earrings/);
  assert.match(sibling.details.join(" "), /6 months or older with pediatrician guidance/);
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
    assert.match(html, /sms:/);
  } else {
    assert.match(html, /data-no-offers/);
  }
});

test("the header shows the highlighted Offers link (desktop and mobile); footer and sitemaps list /offers", () => {
  const header = read("src/components/header.tsx");
  assert.match(header, /<OffersNavLink \/>/);
  assert.match(header, /<OffersNavLink variant="compact" \/>/);
  const badge = read("src/components/offers-nav-link.tsx");
  assert.match(badge, /getActiveOffers\(\)\.length/);
  assert.match(badge, /if \(count === 0/);
  assert.match(read("src/components/footer.tsx"), /\{ href: "\/offers", label: "Offers" \}/);
  assert.match(read("src/app/sitemap.ts"), /"https:\/\/www\.williamsburgmedspa\.com\/offers"/);
  assert.match(read("src/app/html-sitemap/page.tsx"), /\{ href: "\/offers", label: "Offers" \}/);
  assert.match(read("src/app/procedures/[slug]/page.tsx"), /data-offer-callout=\{offer\.slug\}/);
});
