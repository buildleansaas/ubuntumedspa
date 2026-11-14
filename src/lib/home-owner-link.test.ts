import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  HOME_OWNER_ANCHOR,
  HOME_OWNER_LINK_POSTS,
  HOME_OWNER_LINK_PROCEDURES,
  XEOMIN_OWNER_LINK_ANCHOR,
} from "../components/home-owner-link";
import { XEOMIN_HUB_PATH } from "./xeomin-concerns";

// ScaleSleek finding f_majveah6ld: pages that split "med spa williamsburg va" link to / with those words.
const STATIC_PAGES = [
  "events",
  "consult",
  "locations",
  "locations/williamsburg-va",
  "locations/yorktown-va",
  "locations/james-city-county-va",
  "locations/newport-news-va",
  "procedures",
  "products",
  "blog",
];

test("home owner link uses the exact search as its text", () => {
  assert.equal(HOME_OWNER_ANCHOR, "med spa williamsburg va");
  const source = readFileSync("src/components/home-owner-link.tsx", "utf8");
  assert.match(source, /<Link href="\/"/);
});

test("every competing static page renders the home owner link", () => {
  for (const page of STATIC_PAGES) {
    const source = readFileSync(`src/app/${page}/page.tsx`, "utf8");
    assert.match(source, /<HomeOwnerLink\b/, `/${page} is missing the link to /`);
  }
});

test("competing procedure and blog pages render the home owner link", () => {
  assert.deepEqual([...HOME_OWNER_LINK_PROCEDURES].sort(), ["blomdahl-ear-piercing", "botox", "xeomin"]);
  assert.deepEqual([...HOME_OWNER_LINK_POSTS].sort(), [
    "coolsculpting-alternatives-in-williamsburg-va",
    "kybella-alternatives-in-williamsburg-va",
  ]);
  for (const slug of HOME_OWNER_LINK_POSTS) {
    readFileSync(`src/markdown/${slug}.mdx`, "utf8");
  }
  assert.match(readFileSync("src/app/procedures/[slug]/page.tsx", "utf8"), /HOME_OWNER_LINK_PROCEDURES\.has\(procedure\.slug\) && <HomeOwnerLink/);
  assert.match(readFileSync("src/app/blog/[slug]/page.tsx", "utf8"), /HOME_OWNER_LINK_POSTS\.has\(params\.slug\) && <HomeOwnerLink/);
});

// ScaleSleek finding f_vh33afabed: the homepage answers "botox williamsburg", "hydrafacial williamsburg va" and
// "dermal fillers williamsburg" under their own H2s and answers the Botox search in the hero. Since 2026-11-08 the
// Botox-alternative links (three pages and the homepage H2 answer) go to /procedures/botox, the owner. Checked on rendered HTML.
(globalThis as { React?: typeof React }).React = React;
const { default: SearchAnswers, getSearchAnswers } = require("../views/search-answers") as typeof import("../views/search-answers");
const { default: Jumbotron } = require("../views/jumbotron") as typeof import("../views/jumbotron");
const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, " ");

test("homepage answers the Botox, Hydrafacial and dermal filler searches under H2s that say what is offered", () => {
  const html = renderToStaticMarkup(createElement(SearchAnswers, { xeominCash: "$250", xeominCard: "$257.78" }));
  const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((match) => text(match[1]));
  assert.deepEqual(h2s, [
    "A Botox alternative in Williamsburg, VA: we use Xeomin®",
    "Hydrafacial in Williamsburg, VA? We offer PRP Facial instead",
    "Dermal fillers in Williamsburg, VA: not offered here",
  ]);
  // Every FAQPage question in the schema is visible on the page, with its answer.
  for (const item of getSearchAnswers("$250", "$257.78")) {
    assert.ok(text(html).includes(`${item.question} ${item.answer}`), `not visible: ${item.question}`);
  }
  // The Hydrafacial answer and its follow-up sentence are the original FAQ copy, unchanged.
  assert.ok(text(html).includes("No. Williamsburg Med Spa does not offer Hydrafacial. For glow, texture, and skin quality, ask about PRP Facial."));
  assert.ok(text(html).includes("PRP Facial is the in-office option to discuss. The Hydrafacial alternatives guide explains the difference."));
  assert.match(text(html), /does not offer dermal fillers/);
  const home = readFileSync("src/app/page.tsx", "utf8");
  assert.match(home, /<SearchAnswers xeominCash=\{XEOMIN_CASH\} xeominCard=\{XEOMIN_CARD\} \/>/);
  assert.match(home, /faqs=\{\[\.\.\.getSearchAnswers\(XEOMIN_CASH, XEOMIN_CARD\), \.\.\.homeFaqs\]\}/);
});

test("the hero answers the Botox search right under the one H1, before the background", () => {
  const html = renderToStaticMarkup(createElement(Jumbotron, { xeominCash: "$250", xeominCard: "$257.78" }));
  assert.equal(html.match(/<h1\b/g)?.length, 1);
  const after = text(html.slice(html.indexOf("</h1>")));
  assert.ok(
    after.startsWith(
      "Looking for Botox in Williamsburg, VA? We use Xeomin®, a wrinkle relaxer in the same category as Botox®, for frown lines, forehead lines, and crow's feet. From $250 cash ($257.78 by card or online).A local med spa with Jenny Brady"
    ),
    after.slice(0, 300)
  );
  assert.doesNotMatch(readFileSync("src/views/jumbotron.tsx", "utf8"), /commerce-catalog/);
});

test("three pages that showed for the Botox search link to /procedures/botox, the owner", () => {
  assert.equal(XEOMIN_OWNER_LINK_ANCHOR, "Botox alternative in Williamsburg, VA");
  assert.match(readFileSync("src/components/home-owner-link.tsx", "utf8"), /<Link href=\{XEOMIN_HUB_PATH\}/);
  assert.equal(XEOMIN_HUB_PATH, "/procedures/botox");
  for (const page of ["events", "locations/williamsburg-va", "locations/yorktown-va"]) {
    assert.match(readFileSync(`src/app/${page}/page.tsx`, "utf8"), /<XeominHubLink\b/, `/${page} is missing the link to /procedures/botox`);
  }
  const html = renderToStaticMarkup(createElement(SearchAnswers, { xeominCash: "$250", xeominCard: "$257.78" }));
  assert.match(html, /<a[^>]*href="\/procedures\/botox"[^>]*>Botox alternative in Williamsburg, VA<\/a>/);
});

// Tidewater homepage: the homepage's own FAQs render visibly (main's list, each question an H3 with its answer), and
// the FAQPage schema is the search answers plus these, matching what's on the page.
const { homeFaqs } = require("../views/home-questions") as typeof import("../views/home-questions");

test("homepage renders every homeFaqs question and answer, and lists them in the FAQ schema", () => {
  const home = readFileSync("src/app/page.tsx", "utf8");
  assert.equal(homeFaqs.length, 3);
  assert.match(home, /\{homeFaqs\.map\(\(faq\) => \([\s\S]{0,400}\{faq\.question\}[\s\S]{0,300}\{faq\.answer\}/);
  assert.match(home, /faqs=\{\[\.\.\.getSearchAnswers\(XEOMIN_CASH, XEOMIN_CARD\), \.\.\.homeFaqs\]\}/);
  assert.doesNotMatch(home, /<details\b/, "FAQ answers are always visible");
});

const { CHOOSER_TILES, HOME_PRICE_ROWS, HOME_PRICE_INTRO } = require("../views/home-prices") as typeof import("../views/home-prices");
const { COMMERCE_CATALOG_BY_SLUG } = require("../config/commerce-catalog") as typeof import("../config/commerce-catalog");
const { CONSULT_CONCERN_LABELS } = require("./consult-concerns") as typeof import("./consult-concerns");
const { CARD_PRICE_SENTENCE, cardPriceLabel, formatUsdShort } = require("./price") as typeof import("./price");

test("homepage prices come from the catalog: no typed dollar amounts, cash before card", () => {
  for (const file of ["src/app/page.tsx", "src/views/home-prices.ts", "src/views/home-chooser.tsx", "src/views/home-questions.tsx", "src/views/jumbotron.tsx"]) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /\$\d/, `${file} has a typed dollar amount`);
  }
  const home = readFileSync("src/app/page.tsx", "utf8");
  const rowCash = home.indexOf("{row.cash} cash");
  const rowCard = home.indexOf("{row.card} by card or online");
  assert.ok(rowCash > 0 && rowCash < rowCard, "price rows show cash before card");
  assert.match(home, /intro=\{HOME_PRICE_INTRO\}/);
  assert.equal(HOME_PRICE_INTRO, `Cash price first. ${CARD_PRICE_SENTENCE}`);

  const cash = (slug: string) => formatUsdShort(COMMERCE_CATALOG_BY_SLUG[slug].cashAmountCents);
  const card = (slug: string) => cardPriceLabel(COMMERCE_CATALOG_BY_SLUG[slug].cashAmountCents);
  const rows = Object.fromEntries(HOME_PRICE_ROWS.map((row) => [row.href, row]));
  // A Xeomin credit block is exactly the block price: no "from".
  assert.deepEqual(rows["/procedures/xeomin"], {
    name: "Xeomin",
    href: "/procedures/xeomin",
    cash: cash("xeomin"),
    card: card("xeomin"),
    note: "per credit block",
  });
  // Hyperhidrosis is "from" the catalog price everywhere else on the site; the homepage says so too.
  assert.deepEqual(rows["/procedures/hyperhidrosis-treatment"], {
    name: "Hyperhidrosis treatment",
    href: "/procedures/hyperhidrosis-treatment",
    cash: `from ${cash("hyperhidrosis-treatment")}`,
    card: `from ${card("hyperhidrosis-treatment")}`,
    note: "per treatment",
  });
  const tiles = Object.fromEntries(CHOOSER_TILES.map((tile) => [tile.href, tile]));
  assert.equal(tiles["/procedures/hyperhidrosis-treatment"].price, `from ${cash("hyperhidrosis-treatment")} cash`);
  assert.equal(tiles["/procedures/xeomin"].price, `from ${cash("xeomin")} cash`);
});

test("the homepage chooser tiles are real links to the treatment owner pages, labelled with approved consult concerns", () => {
  assert.deepEqual(
    CHOOSER_TILES.map((tile) => [tile.concern, tile.href]),
    [
      ["Lines when I frown, raise my brows or smile", "/procedures/xeomin"],
      ["Heavy sweating (underarms, palms, feet)", "/procedures/hyperhidrosis-treatment"],
      ["My child's first earrings / ear piercing", "/procedures/blomdahl-ear-piercing"],
      ["Tired or uneven skin", "/procedures/prp-facial"],
      ["Thinning hair", "/procedures/prp-hair-restoration"],
      ["Intimate dryness or discomfort", "/procedures/oh-shot"],
    ]
  );
  for (const tile of CHOOSER_TILES) {
    assert.ok(CONSULT_CONCERN_LABELS.includes(tile.concern), `not a consult concern: ${tile.concern}`);
  }
  assert.match(readFileSync("src/app/page.tsx", "utf8"), /<HomeChooser tiles=\{CHOOSER_TILES\} \/>/);
  assert.match(readFileSync("src/views/home-chooser.tsx", "utf8"), /<Link\s+href=\{tile\.href\}/);
  assert.match(readFileSync("src/views/home-chooser.tsx", "utf8"), /\{tile\.concern\}/);
});
