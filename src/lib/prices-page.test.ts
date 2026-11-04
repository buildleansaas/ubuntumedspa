import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { COMMERCE_CATALOG } from "../config/commerce-catalog";
import { procedures, products } from "../data";
import { CASH_CARD_NOTE, cardPriceSchemaValue, formatUsdShort } from "./price";
import {
  PRICES_DESCRIPTION,
  PRICES_FAQS,
  PRICES_TITLE,
  buildPricesOfferCatalog,
  catalogItemHref,
  getPriceGroups,
} from "./prices-page";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "./seo";

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");
const PAGE_SOURCE = read("src/app/prices/page.tsx");
const LIB_SOURCE = read("src/lib/prices-page.ts");
// tsconfig has jsx: "preserve", so tsx compiles JSX with the classic runtime and needs a global React.
(globalThis as { React?: typeof React }).React = React;
const { default: PricesPage, metadata: pricesMetadata } = require("../app/prices/page") as typeof import("../app/prices/page");
const { metadata: homeMetadata } = require("../app/page") as typeof import("../app/page");
const html = renderToStaticMarkup(createElement(PricesPage));
const unescape = (value: string) =>
  value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const visibleText = unescape(html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
const cash = (slug: string) => formatUsdShort(COMMERCE_CATALOG.find((item) => item.slug === slug)!.cashAmountCents);

test("every catalog item is on /prices, once, with its catalog displayPrice and a link to its page", () => {
  const rows = getPriceGroups().flatMap((group) => group.rows);
  assert.deepEqual(rows.map((row) => row.slug).sort(), COMMERCE_CATALOG.map((item) => item.slug).sort());
  assert.equal(getPriceGroups().some((group) => group.id === "other"), false, "every catalog item has a named group");

  for (const item of COMMERCE_CATALOG) {
    const rowMatch = html.match(new RegExp(`<li[^>]*data-price-slug="${item.slug}"[^>]*>([\\s\\S]*?)</li>`));
    assert.ok(rowMatch, `${item.slug} row missing`);
    const row = unescape(rowMatch[1]);
    assert.ok(row.includes(item.displayPrice), `${item.slug} row lacks "${item.displayPrice}"`);
    assert.ok(row.includes(`href="${catalogItemHref(item)}"`), `${item.slug} row lacks its link`);
    assert.ok(row.includes(item.name), `${item.slug} row lacks its name`);
    // Cash leads every price.
    assert.ok(item.displayPrice.indexOf("cash") < item.displayPrice.indexOf("card/online"), item.displayPrice);
  }
});

test("each row links to a published page that exists", () => {
  const procedureSlugs = new Set(
    procedures.filter((procedure) => !("published" in procedure) || procedure.published !== false).map((p) => p.slug)
  );
  const productSlugs = new Set(
    products.filter((product) => !("published" in product) || product.published !== false).map((p) => p.slug)
  );
  for (const item of COMMERCE_CATALOG) {
    assert.ok((item.kind === "product" ? productSlugs : procedureSlugs).has(item.slug), `${item.slug} has no page`);
  }
});

test("the groups are the ones the page promises", () => {
  assert.deepEqual(
    getPriceGroups().map((group) => group.name),
    ["Wrinkle relaxer", "PRP treatments", "Sexual wellness", "Ear piercing", "Injections", "Skincare products"]
  );
});

test("the cosmetic gels sit with skincare products, never with OH-Shot or Pe-Shot", () => {
  const groups = getPriceGroups();
  const groupOf = (slug: string) => groups.find((group) => group.rows.some((row) => row.slug === slug))?.id;
  assert.equal(groupOf("co2-v-lift-for-women"), "skincare-products");
  for (const slug of ["co2-v-lift-for-women", "co2-lift"]) {
    assert.notEqual(groupOf(slug), groupOf("oh-shot"), slug);
    assert.notEqual(groupOf(slug), groupOf("pe-shot"), slug);
  }
});

test("the Co2 V Lift gel row is not described as intimate care on /prices", () => {
  assert.doesNotMatch(visibleText, /intimate/i);
  assert.equal(COMMERCE_CATALOG.find((item) => item.slug === "co2-v-lift-for-women")?.shortDescription, "Pickup-only cosmetic gel.");
});

test("title, meta, H1, cash/card note", () => {
  assert.equal(PRICES_TITLE, "Med Spa Prices in Williamsburg, VA | Cash and Card Prices");
  assert.ok(PRICES_TITLE.length <= 60, `title is ${PRICES_TITLE.length}`);
  assert.ok(PRICES_DESCRIPTION.length <= 160, `meta is ${PRICES_DESCRIPTION.length}`);
  assert.equal(
    PRICES_DESCRIPTION,
    `Every price posted: Xeomin® from ${cash("xeomin")} cash per credit block, ear piercing ${cash("blomdahl-ear-piercing")}, B-12 ${cash(
      "b12-injections"
    )}, PRP facial ${cash("prp-facial")}. Cash price first, card/online price shown.`
  );
  assert.equal(pricesMetadata.title, PRICES_TITLE);
  assert.equal(pricesMetadata.description, PRICES_DESCRIPTION);
  assert.equal(pricesMetadata.alternates?.canonical, "/prices");
  assert.match(html, /<h1[^>]*>Williamsburg Med Spa Prices<\/h1>/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(visibleText.includes(CASH_CARD_NOTE));
});

test("no fee or surcharge wording anywhere on the page or in its JSON-LD", () => {
  assert.doesNotMatch(unescape(html), /\bfees?\b|surcharge/i);
  assert.doesNotMatch(PRICES_DESCRIPTION + PRICES_TITLE, /\bfees?\b|surcharge/i);
});

test("no hand-typed dollar amounts in the prices page source", () => {
  for (const [file, source] of [
    ["src/app/prices/page.tsx", PAGE_SOURCE],
    ["src/lib/prices-page.ts", LIB_SOURCE],
  ] as const) {
    assert.doesNotMatch(source, /\$\s?\d/, `${file} has a typed dollar amount`);
    // Bare 3+ digit numbers (cents, dollars, phone digits); Tailwind tokens like "base-300" are not numbers.
    assert.doesNotMatch(source, /(?<![\w-])\d{3,}(?!\w)/, `${file} has a numeric literal that looks like a price or phone number`);
  }
});

test("FAQ is visible and in FAQPage schema; booking answer names Jenny's number and the consult", () => {
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1])
  );
  const faqPage = schemas.find((schema) => schema["@type"] === "FAQPage");
  assert.ok(faqPage);
  assert.deepEqual(
    faqPage.mainEntity.map((entry: { name: string }) => entry.name),
    ["Why are card prices higher?", "How do I book?"]
  );
  for (const faq of PRICES_FAQS) {
    assert.ok(visibleText.includes(faq.question) && visibleText.includes(faq.answer), faq.question);
  }
  assert.equal(
    PRICES_FAQS[1].answer,
    "For most services you can pay online, then text or call Jenny at (804) 738-9483 to pick a time. Some treatments, such as PRP hair restoration, start with a consultation first."
  );
  assert.equal(PRICES_FAQS.length, 2);
  assert.doesNotMatch(JSON.stringify(PRICES_FAQS) + unescape(html), /insurance/i);
  assert.match(html, /href="\/consult"/);
  assert.match(PRICES_FAQS[0].answer, /cash price is the base price/i);
  assert.ok(schemas.some((schema) => schema["@type"] === "BreadcrumbList"));
});

test("OfferCatalog JSON-LD lists every catalog item at its card price (what checkout charges)", () => {
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1])
  );
  const catalog = schemas.find((schema) => schema["@type"] === "OfferCatalog");
  assert.deepEqual(catalog, JSON.parse(JSON.stringify(buildPricesOfferCatalog())));
  const offers = catalog.itemListElement.flatMap((group: { itemListElement: unknown[] }) => group.itemListElement);
  assert.equal(offers.length, COMMERCE_CATALOG.length);
  for (const item of COMMERCE_CATALOG) {
    const offer = offers.find((entry: { name: string }) => entry.name === item.name);
    assert.ok(offer, item.slug);
    assert.equal(offer.price, cardPriceSchemaValue(item.cashAmountCents));
    assert.equal(offer.priceCurrency, "USD");
    assert.equal(offer.url, `https://www.williamsburgmedspa.com${catalogItemHref(item)}`);
  }
});

test("homepage snippet CTR test (2026-11-04): title and meta", () => {
  assert.equal(DEFAULT_TITLE, "Medical Spa Williamsburg VA | Nurse-Led, Prices Posted");
  assert.ok(DEFAULT_TITLE.startsWith("Medical Spa Williamsburg VA"));
  assert.ok(DEFAULT_TITLE.length <= 60, `title is ${DEFAULT_TITLE.length}`);
  assert.equal(
    DEFAULT_DESCRIPTION,
    `Nurse practitioner-led med spa on Powhatan Pkwy: Xeomin® (a Botox® alternative) from ${cash("xeomin")} cash, Blomdahl ear piercing ${cash(
      "blomdahl-ear-piercing"
    )}, B-12 ${cash("b12-injections")}, PRP. See all prices.`
  );
  assert.equal(
    DEFAULT_DESCRIPTION,
    "Nurse practitioner-led med spa on Powhatan Pkwy: Xeomin® (a Botox® alternative) from $250 cash, Blomdahl ear piercing $45, B-12 $25, PRP. See all prices."
  );
  assert.ok(DEFAULT_DESCRIPTION.length <= 160, `meta is ${DEFAULT_DESCRIPTION.length}`);
  assert.doesNotMatch(DEFAULT_DESCRIPTION + DEFAULT_TITLE, /\bfees?\b|surcharge|filler/i);
  assert.equal(homeMetadata.title, DEFAULT_TITLE);
  assert.equal(homeMetadata.description, DEFAULT_DESCRIPTION);
  // The meta says "See all prices": the homepage links /prices.
  assert.match(read("src/app/page.tsx"), /href: "\/prices"/);
});

test("/prices is linked from the footer and /procedures and is in both sitemaps", () => {
  assert.match(read("src/components/footer.tsx"), /\{ href: "\/prices", label: "Prices" \}/);
  assert.match(read("src/app/procedures/page.tsx"), /href="\/prices"/);
  assert.match(read("src/app/sitemap.ts"), /"https:\/\/www\.williamsburgmedspa\.com\/prices"/);
  assert.match(read("src/app/html-sitemap/page.tsx"), /href: "\/prices"/);
});
