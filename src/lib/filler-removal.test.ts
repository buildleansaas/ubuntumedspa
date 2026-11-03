import assert from "node:assert/strict";
import test from "node:test";

import { getCartRecommendations } from "../config/cart-recommendations";
import { COMMERCE_CATALOG, getCatalogConfigBySlug } from "../config/commerce-catalog";
import {
  REMOVED_FILLER_BLOG_PATHS,
  REMOVED_URL_REDIRECT_CHECKS,
  REMOVED_URL_REDIRECTS,
} from "../config/removed-redirects.mjs";
import { FORM_INPUTS, procedures } from "../data";
import { normalizeCartItems } from "./cart-items";
import { resolveCart } from "./catalog";
import { getProcedureInterests } from "./consult-procedure-interests";
import { localInjectableServicePages } from "./local-injectable-service-pages";

// Dermal filler (including lip filler) was removed from the site on 2026-11-03 (issue #147).

test("filler is gone from the catalog, procedures, local pages, and the consult form", () => {
  assert.equal(getCatalogConfigBySlug("filler"), null);
  assert.equal(COMMERCE_CATALOG.some((item) => /filler/i.test(`${item.slug} ${item.name}`)), false);
  assert.equal(procedures.some((procedure) => procedure.slug === "filler"), false);
  assert.equal(localInjectableServicePages.some((page) => (page.procedureSlug as string) === "filler"), false);
  const interests = FORM_INPUTS.find((input) => input.id === "interests")?.options ?? [];
  assert.equal(interests.some((option) => /filler/i.test(option)), false);
  assert.equal(getProcedureInterests("filler"), undefined);
});

test("cart recommendations never suggest filler", () => {
  const everySlug = COMMERCE_CATALOG.map((item) => item.slug);
  for (const slug of [...everySlug, "filler"]) {
    const recommendations = getCartRecommendations([slug], 10);
    assert.equal(recommendations.some((item) => item.slug === "filler"), false, `recommended filler for ${slug}`);
  }
  assert.equal(getCartRecommendations([], 10).some((item) => item.slug === "filler"), false);
});

test("a stale saved cart drops filler and keeps the other items", () => {
  const items = normalizeCartItems([
    { slug: "filler", kind: "procedure", quantity: 2 },
    { slug: "botox", kind: "procedure", quantity: 1 },
  ]);
  assert.deepEqual(items, [{ slug: "botox", kind: "procedure", quantity: 1 }]);
  assert.deepEqual(normalizeCartItems([{ slug: "filler", kind: "procedure", quantity: 1 }]), []);
});

test("resolveCart rejects filler with a clear message before reaching the database", async () => {
  const previousMongoUri = process.env.MONGO_URI;
  delete process.env.MONGO_URI;
  try {
    // With MONGO_URI unset, any database call would fail with "MONGO_URI is required." instead.
    await assert.rejects(resolveCart([{ slug: "filler", kind: "procedure", quantity: 1 }]), {
      message: '"filler" is no longer available online. Remove it from your cart to continue.',
    });
  } finally {
    if (previousMongoUri !== undefined) process.env.MONGO_URI = previousMongoUri;
  }
});

test("every removed URL has an explicit redirect source and a non-filler destination (verify-seo checks status and destination at runtime)", () => {
  const sources = new Set(REMOVED_URL_REDIRECTS.map(([source]) => source));
  for (const required of [
    "/staff/jenny-coleman",
    "/procedures/filler",
    "/procedures/filler/:path*",
    "/procedures/filler/near/:areaSlug",
    "/blog/dermal-fillers-in-williamsburg-va-lips-cheeks-under-eyes",
    "/blog/how-long-do-dermal-fillers-last-in-williamsburg-va",
    "/blog/get-your-dream-lips-with-dermal-fillers",
  ]) {
    assert.ok(sources.has(required), `missing redirect for ${required}`);
  }
  // Blog redirects are explicit slugs only, so a future post with "filler" in its slug is never caught.
  for (const source of sources) {
    if (source.startsWith("/blog/")) {
      assert.ok(REMOVED_FILLER_BLOG_PATHS.includes(source), `unexpected blog redirect ${source}`);
      assert.equal(/[:(*]/.test(source), false, `blog redirect must not be a pattern: ${source}`);
    }
  }
  for (const [, destination] of [...REMOVED_URL_REDIRECTS, ...REMOVED_URL_REDIRECT_CHECKS]) {
    assert.equal(/filler|coleman/i.test(destination), false, `redirect lands on a removed URL: ${destination}`);
  }
});
