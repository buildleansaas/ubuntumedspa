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
// "dermal fillers williamsburg". Since the Tidewater redesign the three answers sit in the homepage Questions list
// (one question each, exact answer text, links inline) instead of three H2 blocks. Since 2026-11-08 the
// Botox-alternative links go to /procedures/botox, the owner. Checked on rendered HTML.
(globalThis as { React?: typeof React }).React = React;
const { getSearchAnswers } = require("../views/search-answers") as typeof import("../views/search-answers");
const { default: HomeQuestions, getHomeFaqs, homeFaqs } = require("../views/home-questions") as typeof import("../views/home-questions");
const { default: HomeHero, HOME_HERO_SENTENCE } = require("../views/home-hero") as typeof import("../views/home-hero");
const text = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, " ").replace(/ ([.,])/g, "$1").trim();
const renderQuestions = () => renderToStaticMarkup(createElement(HomeQuestions, { xeominCash: "$250", xeominCard: "$257.78" }));

test("homepage answers the Botox, Hydrafacial and dermal filler searches, and every FAQPage question is visible", () => {
  const html = renderQuestions();
  const visible = text(html);
  const faqs = getHomeFaqs("$250", "$257.78");
  // The schema list is the three search answers, then the homepage's own questions, in that order.
  assert.deepEqual(
    faqs.map((faq) => faq.question),
    [...getSearchAnswers("$250", "$257.78").map((item) => item.question), ...homeFaqs.map((faq) => faq.question)]
  );
  assert.deepEqual(faqs.map((faq) => faq.question).slice(0, 3), [
    "Do you offer Botox® in Williamsburg?",
    "Do you offer Hydrafacial in Williamsburg?",
    "Do you offer dermal fillers in Williamsburg?",
  ]);
  // Every FAQPage question in the schema is visible on the page, as a question heading, with its exact answer.
  const questions = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map((match) => text(match[1]));
  assert.deepEqual(questions, faqs.map((faq) => faq.question));
  for (const faq of faqs) assert.ok(visible.includes(text(faq.answer)), `answer not visible: ${faq.question}`);
  // The answers are in the server HTML (native <details>), not rendered only after a click.
  assert.equal(html.match(/<details\b/g)?.length, faqs.length);
  // The Hydrafacial answer and its follow-up sentence are the original FAQ copy, unchanged, with inline links.
  assert.ok(visible.includes("No. Williamsburg Med Spa does not offer Hydrafacial. For glow, texture, and skin quality, ask about PRP Facial."));
  assert.ok(visible.includes("PRP Facial is the in-office option to discuss. The Hydrafacial alternatives guide explains the difference."));
  assert.match(html, /<a[^>]*href="\/procedures\/prp-facial"[^>]*>PRP Facial<\/a>/);
  assert.match(html, /<a[^>]*href="\/blog\/hydrafacial-alternatives-in-williamsburg-va"[^>]*>Hydrafacial alternatives guide<\/a>/);
  assert.match(visible, /does not offer dermal fillers/);
  // The descriptive Xeomin owner link verify-seo looks for stays on the homepage.
  assert.match(html, /<a[^>]*href="\/procedures\/xeomin"[^>]*>Xeomin in Williamsburg<\/a>/);
  // page.tsx feeds the FAQPage schema and the visible list from the same prices.
  const home = readFileSync("src/app/page.tsx", "utf8");
  assert.match(home, /<StructuredData type="FAQ" faqs=\{getHomeFaqs\(XEOMIN_CASH, XEOMIN_CARD\)\} \/>/);
  assert.match(home, /<HomeQuestions xeominCash=\{XEOMIN_CASH\} xeominCard=\{XEOMIN_CARD\} \/>/);
});

test("the hero has the one H1, the one-sentence summary, catalog prices (cash) and no catalog import", () => {
  const html = renderToStaticMarkup(createElement(HomeHero, { xeominCash: "$250", piercingCash: "$45" }));
  assert.equal(html.match(/<h1\b/g)?.length, 1);
  assert.equal(text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)![1]), "Nurse Practitioner Led Medical Spa in Williamsburg, VA");
  const after = text(html.slice(html.indexOf("</h1>")));
  assert.ok(after.startsWith(HOME_HERO_SENTENCE), after.slice(0, 200));
  assert.match(after, /Xeomin from \$250 cash · Ear piercing \$45 per ear, cash/);
  assert.match(html, /<a[^>]*href="\/consult"[^>]*>Book a visit<\/a>/);
  assert.match(html, /<a[^>]*href="\/prices"[^>]*>See prices<\/a>/);
  const source = readFileSync("src/views/home-hero.tsx", "utf8");
  assert.doesNotMatch(source, /commerce-catalog/);
  // The page has exactly one H1: the hero's. No other homepage section renders one.
  for (const file of ["src/app/page.tsx", "src/views/home-chooser.tsx", "src/views/home-questions.tsx"]) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /<h1\b/, file);
  }
});

test("homepage prices come from the catalog: no typed dollar amounts, cash before card", () => {
  for (const file of ["src/app/page.tsx", "src/views/home-hero.tsx", "src/views/home-chooser.tsx", "src/views/home-questions.tsx"]) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /\$\d/, `${file} has a typed dollar amount`);
  }
  const home = readFileSync("src/app/page.tsx", "utf8");
  const rowCash = home.indexOf("{row.cash} cash");
  const rowCard = home.indexOf("{row.card} by card or online");
  assert.ok(rowCash > 0 && rowCash < rowCard, "price rows show cash before card");
  assert.match(home, /COMMERCE_CATALOG_BY_SLUG/);
});

test("the homepage chooser tiles are real links to the treatment owner pages", () => {
  const home = readFileSync("src/app/page.tsx", "utf8");
  for (const href of [
    "/procedures/xeomin",
    "/procedures/hyperhidrosis-treatment",
    "/procedures/blomdahl-ear-piercing",
    "/procedures/prp-facial",
    "/procedures/prp-hair-restoration",
    "/procedures/oh-shot",
  ]) {
    assert.ok(home.includes(`href: "${href}"`), href);
  }
  assert.match(readFileSync("src/views/home-chooser.tsx", "utf8"), /<Link\s+href=\{tile\.href\}/);
});

test("three pages that showed for the Botox search link to /procedures/botox, the owner", () => {
  assert.equal(XEOMIN_OWNER_LINK_ANCHOR, "Botox alternative in Williamsburg, VA");
  assert.match(readFileSync("src/components/home-owner-link.tsx", "utf8"), /<Link href=\{XEOMIN_HUB_PATH\}/);
  assert.equal(XEOMIN_HUB_PATH, "/procedures/botox");
  for (const page of ["events", "locations/williamsburg-va", "locations/yorktown-va"]) {
    assert.match(readFileSync(`src/app/${page}/page.tsx`, "utf8"), /<XeominHubLink\b/, `/${page} is missing the link to /procedures/botox`);
  }
  assert.match(renderQuestions(), /<a[^>]*href="\/procedures\/botox"[^>]*>Botox alternative in Williamsburg, VA<\/a>/);
});
