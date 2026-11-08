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
