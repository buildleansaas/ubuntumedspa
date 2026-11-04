import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { procedures } from "../data";
import { publishedEarPiercingIntentPages } from "../lib/ear-piercing-intents";
import { cardQuantityBreakLineCents, formatUsdShort } from "../lib/price";
import { GOOGLE_REVIEW_URL } from "../lib/seo";
import { COMMERCE_CATALOG } from "./commerce-catalog";
import { GBP_HOLIDAYS, GBP_POSTS, GBP_TEMPLATES } from "./gbp-posts";

const SITE_HOST = "www.williamsburgmedspa.com";
const MARKDOWN_DIR = join(process.cwd(), "src", "markdown");
const STATIC_PAGES = new Set([
  "/",
  "/consult",
  "/blog",
  "/procedures",
  "/products",
  "/staff/jenny-brady",
  "/locations",
  "/locations/williamsburg-va",
  "/events",
]);

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const postText = (post: (typeof GBP_POSTS)[number]) =>
  [post.title, post.subtitle, post.kicker ?? "", post.priceLine ?? "", post.body].join("\n");

test("there are 12 weekly posts from Mon Nov 9, 2026 through Mon Jan 25, 2027", () => {
  assert.equal(GBP_POSTS.length, 12);
  assert.equal(GBP_POSTS[0].publishOn, "2026-11-09");
  assert.equal(GBP_POSTS[GBP_POSTS.length - 1].publishOn, "2027-01-25");
});

test("every slug is unique and URL-safe", () => {
  const slugs = GBP_POSTS.map((post) => post.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test("every publish date is a Monday, in ascending order, one week apart", () => {
  let previous: number | undefined;
  for (const post of GBP_POSTS) {
    assert.match(post.publishOn, /^\d{4}-\d{2}-\d{2}$/, post.slug);
    const date = new Date(`${post.publishOn}T00:00:00Z`);
    assert.equal(date.toISOString().slice(0, 10), post.publishOn, `${post.slug} has a real date`);
    assert.equal(date.getUTCDay(), 1, `${post.slug} (${post.publishOn}) is a Monday`);
    if (previous !== undefined) {
      assert.equal(date.getTime() - previous, 7 * 24 * 60 * 60 * 1000, `${post.slug} is one week after the previous post`);
    }
    previous = date.getTime();
  }
});

test("templates, holidays, types, and CTAs are known", () => {
  for (const post of GBP_POSTS) {
    assert.ok((GBP_TEMPLATES as readonly string[]).includes(post.template), `${post.slug} template`);
    assert.ok(["update", "offer", "event"].includes(post.type), `${post.slug} type`);
    assert.ok(["BOOK", "LEARN_MORE", "CALL", "ORDER"].includes(post.cta), `${post.slug} cta`);
    if (post.template === "holiday") {
      assert.ok(post.holiday && (GBP_HOLIDAYS as readonly string[]).includes(post.holiday), `${post.slug} holiday`);
    } else {
      assert.equal(post.holiday, undefined, `${post.slug} only holiday templates set a holiday`);
    }
  }
});

test("every body is 150-300 words, under 1,500 characters, plain text, and names Williamsburg, VA", () => {
  for (const post of GBP_POSTS) {
    const count = words(post.body);
    assert.ok(count >= 150 && count <= 300, `${post.slug} has ${count} words`);
    assert.ok(post.body.length < 1500, `${post.slug} has ${post.body.length} characters`);
    assert.ok(post.body.includes("Williamsburg, VA"), `${post.slug} names Williamsburg, VA`);
    assert.doesNotMatch(post.body, /[*_#`>]|\[[^\]]*\]\(|https?:\/\//, `${post.slug} body has no markdown or links`);
  }
});

test("no banned wording in any post", () => {
  const banned = /\b(fees?|surcharges?|best|guarantee[ds]?|guaranteeing|painless|results?)\b|before[- ]and[- ]after|before\/after/i;
  for (const post of GBP_POSTS) {
    const match = postText(post).match(banned);
    assert.equal(match, null, `${post.slug} uses banned wording "${match?.[0]}"`);
  }
});

test("Botox® and Xeomin® always carry the ®", () => {
  for (const post of GBP_POSTS) {
    const text = postText(post);
    assert.doesNotMatch(text, /\bBotox(?!®)/i, `${post.slug} writes Botox without ®`);
    assert.doesNotMatch(text, /\bXeomin(?!®)/i, `${post.slug} writes Xeomin without ®`);
  }
});

test("holiday greeting cards carry no price and no treatment names", () => {
  for (const post of GBP_POSTS.filter((p) => p.template === "holiday" && !p.priceLine)) {
    assert.doesNotMatch(post.body, /\$|Botox|Xeomin|filler|PRP|inject|treatment/i, `${post.slug} stays a greeting`);
  }
});

test("the reviews post quotes no reviews and offers no incentive", () => {
  const post = GBP_POSTS.find((p) => p.slug === "thank-you-for-your-reviews");
  assert.ok(post);
  assert.doesNotMatch(post.body, /["“”]/, "no quoted review text");
  assert.match(post.body, /no discount or reward/i);
});

test("every URL is on www.williamsburgmedspa.com and maps to an existing route", () => {
  const procedureSlugs = new Set(
    procedures.filter((p) => !("published" in p) || p.published !== false).map((p) => p.slug)
  );
  const intentSlugs = new Set(publishedEarPiercingIntentPages.map((page) => page.slug));

  for (const post of GBP_POSTS) {
    if (post.url === GOOGLE_REVIEW_URL) {
      assert.equal(post.slug, "thank-you-for-your-reviews", `${post.slug}: only the reviews post links to the review form`);
      continue;
    }
    const url = new URL(post.url);
    assert.equal(url.protocol, "https:", post.slug);
    assert.equal(url.host, SITE_HOST, post.slug);
    const path = url.pathname;

    if (STATIC_PAGES.has(path)) continue;

    const blog = path.match(/^\/blog\/([a-z0-9-]+)$/);
    if (blog) {
      const file = join(MARKDOWN_DIR, `${blog[1]}.mdx`);
      assert.ok(existsSync(file), `${post.slug}: ${path} has no src/markdown/${blog[1]}.mdx`);
      assert.doesNotMatch(readFileSync(file, "utf8"), /published:\s*false/, `${post.slug}: ${path} is unpublished`);
      continue;
    }

    const intent = path.match(/^\/procedures\/blomdahl-ear-piercing\/for\/([a-z0-9-]+)$/);
    if (intent) {
      assert.ok(intentSlugs.has(intent[1]), `${post.slug}: ${path} is not a published intent page`);
      continue;
    }

    const procedure = path.match(/^\/procedures\/([a-z0-9-]+)$/);
    assert.ok(procedure && procedureSlugs.has(procedure[1]), `${post.slug}: ${path} is not a known route`);
  }
});

test("every $ amount equals a price derived from the catalog helpers", () => {
  const allowed = new Set<string>();
  for (const item of COMMERCE_CATALOG) {
    allowed.add(formatUsdShort(item.cashAmountCents));
    allowed.add(formatUsdShort(item.unitAmountCents));
    for (const [quantity, cashUnitCents] of Object.entries(item.cashQuantityPriceBreaks ?? {})) {
      allowed.add(formatUsdShort(cashUnitCents * Number(quantity)));
      allowed.add(formatUsdShort(cardQuantityBreakLineCents(cashUnitCents, Number(quantity))));
    }
  }

  let checked = 0;
  for (const post of GBP_POSTS) {
    for (const amount of postText(post).match(/\$\d[\d,]*(?:\.\d{2})?/g) ?? []) {
      assert.ok(allowed.has(amount), `${post.slug} states ${amount}, which is not a catalog price`);
      checked += 1;
    }
  }
  assert.ok(checked > 0, "at least one price is checked");
});

test("price chips put the cash price first and the card price second", () => {
  for (const post of GBP_POSTS.filter((p) => p.priceLine)) {
    assert.match(post.priceLine ?? "", /^\$[\d,.]+\+? cash · \$[\d,.]+\+? card/, post.slug);
  }
});

test("body prices name the cash price before the card price", () => {
  for (const post of GBP_POSTS) {
    for (const sentence of post.body.split(/(?<=\.)\s+/).filter((part) => /\bcash\b/.test(part) && /\bcard\b/.test(part))) {
      assert.ok(sentence.indexOf("cash") < sentence.indexOf("card"), `${post.slug}: cash first in "${sentence}"`);
    }
  }
});

test("posts use the current provider name, drop filler, and carry no phone numbers in the text", () => {
  for (const post of GBP_POSTS) {
    const text = postText(post);
    assert.doesNotMatch(text, /Coleman/, `${post.slug} uses the old surname`);
    assert.doesNotMatch(text, /filler/i, `${post.slug} mentions filler, which is no longer offered`);
    assert.doesNotMatch(text, /\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/, `${post.slug} has a phone number in the text`);
  }
});

test("the hyperhidrosis post names no product", () => {
  const post = GBP_POSTS.find((p) => p.slug === "hyperhidrosis-treatment");
  assert.ok(post);
  assert.doesNotMatch(postText(post), /Botox|Xeomin|Dysport|botulinum/i);
});

test("posts that name Botox® or Xeomin® state the side effects", () => {
  for (const post of GBP_POSTS.filter((p) => /Botox|Xeomin/.test(p.body) && p.template !== "trust")) {
    assert.match(post.body, /side effects/i, `${post.slug} has no risk line`);
  }
});
