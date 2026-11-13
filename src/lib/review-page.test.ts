import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { metadata } from "../app/review/page";
import { trackReviewClick, type AnalyticsEventCall } from "./analytics";
import { GOOGLE_REVIEW_URL, ORIGIN, REVIEW_PAGE_URL } from "./seo";

// Google review policy and the FTC rule on reviews (16 CFR 465): no incentive of any kind, no asking only for
// positive or top ratings, and no review gating. These tests read the page source so new copy cannot slip one in.

const ROOT = process.cwd();
const PAGE_SOURCE = readFileSync(join(ROOT, "src/app/review/page.tsx"), "utf8");
const BUTTON_SOURCE = readFileSync(join(ROOT, "src/app/review/review-button.tsx"), "utf8");

/** Source with comments removed, so the policy notes in comments do not count as copy. */
const stripComments = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const BANNED_COPY = /discount|% off|\$\d+ off|gift|free|reward|giveaway|entry|5[- ]star|five[- ]star|only if|happy|loved?|great experience|satisf|enjoyed/i;

test("review URLs", () => {
  assert.equal(GOOGLE_REVIEW_URL, "https://g.page/r/Cde-gEi21QPUEBM/review");
  assert.equal(REVIEW_PAGE_URL, `${ORIGIN}/review`);
});

test("the review button links to GOOGLE_REVIEW_URL in a new tab and tracks the click", () => {
  assert.match(BUTTON_SOURCE, /import \{ GOOGLE_REVIEW_URL \} from "lib\/seo"/);
  assert.match(BUTTON_SOURCE, /href=\{GOOGLE_REVIEW_URL\}/);
  assert.match(BUTTON_SOURCE, /target="_blank"/);
  assert.match(BUTTON_SOURCE, /rel="noopener[^"]*"/);
  assert.match(BUTTON_SOURCE, /onClick=\{\(\) => trackReviewClick\("review_page"\)\}/);
  assert.match(BUTTON_SOURCE, />\s*Leave a Google Review\s*</);
  assert.match(PAGE_SOURCE, /<ReviewButton \/>/);
});

test("no review gating: the button is rendered unconditionally and is the only review link", () => {
  const code = stripComments(PAGE_SOURCE);
  assert.equal((code.match(/<ReviewButton \/>/g) ?? []).length, 1);
  // No conditional around the button (a ternary or && right before it).
  assert.doesNotMatch(code, /(\?|&&)\s*\(?\s*<ReviewButton/);
  assert.equal((stripComments(BUTTON_SOURCE).match(/href=/g) ?? []).length, 1);
  assert.doesNotMatch(code, /g\.page|google\.com/i);
});

test("copy has no incentive, rating request, or gating language", () => {
  for (const [file, source] of [
    ["page.tsx", PAGE_SOURCE],
    ["review-button.tsx", BUTTON_SOURCE],
  ] as const) {
    const match = stripComments(source).match(BANNED_COPY);
    assert.equal(match, null, `${file} contains "${match?.[0]}"`);
  }
  assert.match(PAGE_SOURCE, /Thank you for visiting Williamsburg Med Spa/);
  assert.match(PAGE_SOURCE, /Your honest review helps other families in Williamsburg find a nurse-led clinic\./);
  assert.match(PAGE_SOURCE, /Questions or concerns\? Text or call Jenny at/);
});

test("the page is noindex, follow, with its own title and canonical", () => {
  assert.equal(metadata.title, "Leave a Review | Williamsburg Med Spa");
  assert.deepEqual(metadata.robots, { index: false, follow: true });
  assert.equal(metadata.alternates?.canonical, "/review");
});

test("robots.txt disallows /review like /gbp, and the sitemap leaves it out", () => {
  const robots = readFileSync(join(ROOT, "src/app/robots.txt/route.ts"), "utf8");
  assert.match(robots, /^Disallow: \/gbp$/m);
  assert.match(robots, /^Disallow: \/review$/m);
  for (const file of ["src/app/sitemap.ts", "src/lib/sitemap-pages.ts"]) {
    assert.doesNotMatch(readFileSync(join(ROOT, file), "utf8"), /["'`]\/review/);
  }
});

test("trackReviewClick sends review_click with only the CTA location", () => {
  const calls: AnalyticsEventCall[] = [];
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { gtag: (...args: AnalyticsEventCall) => calls.push(args) },
    writable: true,
  });
  try {
    trackReviewClick("review_page");
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
  assert.deepEqual(calls, [["event", "review_click", { cta_location: "review_page" }]]);
});
