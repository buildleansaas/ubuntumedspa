#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { URL } from "node:url";

const targetArg = process.argv.slice(2).find((argument) => !argument.startsWith("-"));
const baseUrl = new URL(targetArg || process.env.SEO_BASE_URL || "http://127.0.0.1:3000");
const canonicalOrigin = "https://www.williamsburgmedspa.com";
const failures = [];
const warnings = [];

const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const consultFormSource = await readFile(new URL("../src/app/consult/consult-form.tsx", import.meta.url), "utf8");
if (!/"prp-hair-restoration"\s*:\s*\["Hair Restoration"\]/.test(consultFormSource)) {
  fail("consult form does not map procedure=prp-hair-restoration to the Hair Restoration interest");
}
const normalizePath = (value) => {
  const url = new URL(value, canonicalOrigin);
  const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
  return `${path}${url.search}`;
};
const fetchLocal = (value, options) => {
  const requested = new URL(value, canonicalOrigin);
  const local = new URL(`${requested.pathname}${requested.search}`, baseUrl);
  return fetch(local, options);
};
const extractAll = (html, expression) => [...html.matchAll(expression)].map((match) => match[1]);
const unescapeHtml = (value) =>
  value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const getTagAttributes = (tag) => {
  const attributes = {};
  const source = tag.replace(/^<\w+\s*|\/?>$/g, "");
  for (const match of source.matchAll(/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    attributes[match[1].toLowerCase()] = unescapeHtml(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
};
const getVisibleText = (html) =>
  unescapeHtml(
    html
      .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  ).replace(/\s+/g, " ");

const robotsResponse = await fetch(new URL("/robots.txt", baseUrl));
if (!robotsResponse.ok) fail(`/robots.txt returned ${robotsResponse.status}`);
const robots = await robotsResponse.text();
if (!robots.includes(`${canonicalOrigin}/sitemap.xml`)) fail("robots.txt does not advertise the canonical sitemap URL");

const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl));
if (!sitemapResponse.ok) fail(`/sitemap.xml returned ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = extractAll(sitemapXml, /<loc>([^<]+)<\/loc>/g).map(unescapeHtml);
const duplicateSitemapUrls = sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index);
if (duplicateSitemapUrls.length) fail(`duplicate sitemap URLs: ${[...new Set(duplicateSitemapUrls)].join(", ")}`);

for (const expected of [`${canonicalOrigin}/events`, `${canonicalOrigin}/events/botox-party`]) {
  if (!sitemapUrls.includes(expected)) fail(`sitemap missing ${expected}`);
}
if (sitemapUrls.some((url) => normalizePath(url) === "/affiliates")) fail("retired /affiliates route is present in sitemap");

for (const block of extractAll(sitemapXml, /<url>([\s\S]*?)<\/url>/g)) {
  const loc = unescapeHtml(block.match(/<loc>([^<]+)<\/loc>/)?.[1] || "");
  if (/<lastmod>/.test(block) && !new URL(loc).pathname.startsWith("/blog/")) {
    fail(`non-article sitemap row has synthetic lastmod: ${loc}`);
  }
}

const pages = [];
for (let index = 0; index < sitemapUrls.length; index += 8) {
  const batch = sitemapUrls.slice(index, index + 8);
  const results = await Promise.all(
    batch.map(async (canonicalUrl) => {
      const response = await fetchLocal(canonicalUrl);
      return { canonicalUrl, response, html: await response.text() };
    })
  );
  pages.push(...results);
}

const internalPaths = new Set();
const imagePaths = new Set();
let jsonLdBlocks = 0;
for (const { canonicalUrl, response, html } of pages) {
  const expectedPath = normalizePath(canonicalUrl);
  if (response.status !== 200) {
    fail(`${canonicalUrl} returned ${response.status}`);
    continue;
  }

  const titleCount = (html.match(/<title(?:\s[^>]*)?>[\s\S]*?<\/title>/gi) || []).length;
  if (titleCount !== 1) fail(`${canonicalUrl} has ${titleCount} title elements`);
  const viewportTags = (html.match(/<meta\b[^>]*>/gi) || []).filter(
    (tag) => getTagAttributes(tag).name?.toLowerCase() === "viewport"
  );
  if (viewportTags.length !== 1) {
    fail(`${canonicalUrl} has ${viewportTags.length} viewport meta tags`);
  } else {
    const content = (getTagAttributes(viewportTags[0]).content || "").toLowerCase();
    const directives = Object.fromEntries(
      content
        .split(",")
        .map((part) => part.trim().split("=").map((value) => value.trim()))
        .filter(([key, value]) => key && value)
    );
    const maximumScale = directives["maximum-scale"] ? Number(directives["maximum-scale"]) : undefined;
    if (
      directives.width !== "device-width" ||
      Number(directives["initial-scale"]) !== 1 ||
      directives["user-scalable"] === "no" ||
      (maximumScale !== undefined && maximumScale < 5)
    ) {
      fail(`${canonicalUrl} has invalid viewport metadata: ${content}`);
    }
  }
  const h1Count = (html.match(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi) || []).length;
  if (h1Count !== 1) fail(`${canonicalUrl} has ${h1Count} H1 elements`);

  const canonicalMatches = extractAll(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/gi);
  if (canonicalMatches.length !== 1) {
    fail(`${canonicalUrl} has ${canonicalMatches.length} canonical links`);
  } else if (normalizePath(unescapeHtml(canonicalMatches[0])) !== expectedPath) {
    fail(`${canonicalUrl} canonical points to ${canonicalMatches[0]}`);
  }

  const jsonLd = extractAll(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (!jsonLd.length) fail(`${canonicalUrl} has no server-rendered JSON-LD`);
  let medicalBusinessBlocks = 0;
  for (const raw of jsonLd) {
    try {
      const parsed = JSON.parse(unescapeHtml(raw));
      const schemas = Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
      medicalBusinessBlocks += schemas.filter((schema) => schema?.["@type"] === "MedicalBusiness").length;
      for (const faqSchema of schemas.filter((schema) => schema?.["@type"] === "FAQPage")) {
        const questions = (faqSchema.mainEntity || []).map((entry) => entry?.name).filter(Boolean);
        if (new Set(questions).size !== questions.length) fail(`${canonicalUrl} has duplicate FAQ schema questions`);
      }
      jsonLdBlocks += 1;
    } catch (error) {
      fail(`${canonicalUrl} has invalid JSON-LD: ${error.message}`);
    }
  }
  if (medicalBusinessBlocks !== 1) fail(`${canonicalUrl} has ${medicalBusinessBlocks} MedicalBusiness schema blocks`);

  for (const rawSrc of extractAll(html, /<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    const src = unescapeHtml(rawSrc);
    if (/^(?:data:|blob:)/i.test(src)) continue;
    const resolved = new URL(src, baseUrl);
    if (resolved.origin === baseUrl.origin) imagePaths.add(`${resolved.pathname}${resolved.search}`);
  }

  for (const rawHref of extractAll(html, /<a[^>]+href=["']([^"']+)["'][^>]*>/gi)) {
    const href = unescapeHtml(rawHref);
    if (/^(?:mailto:|tel:|sms:|javascript:|#)/i.test(href)) continue;
    const resolved = new URL(href, canonicalOrigin);
    if (resolved.hostname === "williamsburgmedspa.com") fail(`${canonicalUrl} links to apex host: ${href}`);
    if (resolved.hostname !== "www.williamsburgmedspa.com") continue;
    if (resolved.protocol !== "https:") fail(`${canonicalUrl} uses non-HTTPS internal URL: ${href}`);
    const path = normalizePath(resolved);
    if (path.startsWith("/affiliates")) fail(`${canonicalUrl} still links to retired affiliate route: ${href}`);
    internalPaths.add(path);
  }
}

for (const path of internalPaths) {
  const response = await fetchLocal(path, { redirect: "manual" });
  if (response.status >= 400) fail(`internal link ${path} returned ${response.status}`);
}

for (const path of imagePaths) {
  const response = await fetch(new URL(path, baseUrl));
  if (!response.ok) {
    fail(`rendered image ${path} returned ${response.status}`);
    continue;
  }
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) fail(`rendered image ${path} returned ${contentType || "no content type"}`);
}

const affiliateResponse = await fetch(new URL("/affiliates", baseUrl), { redirect: "manual" });
if (![301, 302, 307, 308].includes(affiliateResponse.status)) {
  fail(`/affiliates should redirect but returned ${affiliateResponse.status}`);
} else {
  const location = affiliateResponse.headers.get("location") || "";
  if (normalizePath(location) !== "/consult") fail(`/affiliates redirects to ${location}, expected /consult`);
}

const home = pages.find((page) => normalizePath(page.canonicalUrl) === "/")?.html || "";
for (const owner of ["/procedures/botox", "/procedures/filler", "/procedures/blomdahl-ear-piercing"]) {
  const pattern = new RegExp(`href=["']${owner.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
  if (!pattern.test(home)) fail(`homepage does not directly link to query owner ${owner}`);
}

const ownerPageExpectations = {
  "/procedures/prp-breast-lift": {
    required: [
      "What a PRP Breast Lift can and cannot do",
      "Prepared from your own blood",
      "Published evidence for cosmetic breast benefits is limited",
      "does not replace a surgical breast lift or breast augmentation",
      "$1,800",
      "Full upfront payment for one treatment visit",
      "Book a Private PRP Breast Consultation",
    ],
    forbidden: ["even a lifetime", "safe and effective way", "stimulating the growth of new blood vessels and fatty tissue"],
    requiredHtml: [/href=["']\/consult\?procedure=prp-breast-lift&amp;utm_source=website&amp;utm_medium=procedure_page&amp;utm_campaign=prp_breast_lift["']/],
    forbiddenHtml: [/id=["']prp-breast-lift-quantity["']/],
    offer: { name: "PRP Breast Lift", price: "1800", currency: "USD" },
  },
  "/procedures/prp-hair-restoration": {
    required: [
      "Is PRP a reasonable fit for your hair-loss pattern?",
      "Research suggests platelet-rich plasma may improve hair density for some people with pattern hair loss",
      "does not create new follicles in a bald area",
      "Medical evaluation may come first",
      "$600 per treatment",
      "purchase one session and choose one appointment time after checkout",
      "For patients cleared to proceed",
      "Book a PRP Hair Consultation",
    ],
    forbidden: ["guaranteed regrowth", "creates new hair follicles", "permanent hair restoration", "little to no downtime"],
    requiredHtml: [/href=["']\/consult\?procedure=prp-hair-restoration&amp;utm_source=website&amp;utm_medium=procedure_page&amp;utm_campaign=prp_hair_restoration["']/],
    forbiddenHtml: [/id=["']prp-hair-restoration-quantity["']/],
    offer: { name: "PRP Hair Restoration", price: "600", currency: "USD" },
  },
  "/locations/james-city-county-va": {
    required: [
      "Med Spa Near James City County, VA",
      "Choose the right treatment starting point",
      "Consultation-led care close to James City County",
      "3900 Powhatan Parkway, Williamsburg, VA 23188",
      "James City County med spa visit FAQs",
      "Book a Consultation",
    ],
    forbidden: ["search for a med spa near me", "page should answer", "pages tied to James City County intent"],
    requiredHtml: [
      /href=["']\/consult\?utm_source=website&amp;utm_medium=location_page&amp;utm_campaign=james_city_county["']/,
      /href=["']\/procedures\/botox["']/,
      /href=["']\/procedures\/xeomin["']/,
      /href=["']\/procedures\/filler["']/,
      /href=["']\/procedures\/prp-hair-restoration["']/,
      /href=["']\/procedures\/hyperhidrosis-treatment["']/,
      /href=["']\/procedures\/blomdahl-ear-piercing\/near\/james-city-county-va["']/,
    ],
    requiredSchemas: ["FAQPage"],
  },
};
for (const [path, expectation] of Object.entries(ownerPageExpectations)) {
  const page = pages.find((candidate) => normalizePath(candidate.canonicalUrl) === path);
  if (!page) {
    fail(`owner page missing from sitemap: ${path}`);
    continue;
  }
  const text = getVisibleText(page.html);
  for (const required of expectation.required) {
    if (!text.includes(required)) fail(`${path} missing required owner-page copy: ${required}`);
  }
  for (const forbidden of expectation.forbidden) {
    if (text.includes(forbidden)) fail(`${path} contains unsupported owner-page copy: ${forbidden}`);
  }
  for (const requiredHtml of expectation.requiredHtml || []) {
    if (!requiredHtml.test(page.html)) fail(`${path} missing required owner-page HTML: ${requiredHtml}`);
  }
  for (const forbiddenHtml of expectation.forbiddenHtml || []) {
    if (forbiddenHtml.test(page.html)) fail(`${path} contains forbidden owner-page HTML: ${forbiddenHtml}`);
  }

  const schemas = extractAll(page.html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
    .map((raw) => JSON.parse(unescapeHtml(raw)))
    .flatMap((schema) => (Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema]));
  const serviceSchemas = schemas.filter((schema) => schema?.["@type"] === "Service");
  for (const requiredSchema of expectation.requiredSchemas || []) {
    if (!schemas.some((schema) => schema?.["@type"] === requiredSchema)) {
      fail(`${path} is missing required ${requiredSchema} schema`);
    }
  }
  if (expectation.offer) {
    const matchingServices = serviceSchemas.filter((schema) => schema?.name === expectation.offer.name);
    if (matchingServices.length !== 1) {
      fail(`${path} must render exactly one ${expectation.offer.name} Service schema; found ${matchingServices.length}`);
    }
    const offer = matchingServices[0]?.offers;
    if (String(offer?.price) !== expectation.offer.price || offer?.priceCurrency !== expectation.offer.currency) {
      fail(`${path} ${expectation.offer.name} Service schema is missing the ${expectation.offer.price} ${expectation.offer.currency} offer`);
    }
  }
}

const priorityPaths = [
  "/",
  "/procedures/botox",
  "/procedures/filler",
  "/procedures/blomdahl-ear-piercing",
  "/procedures/blomdahl-ear-piercing/for/sensitive-ears",
  "/procedures/hyperhidrosis-treatment",
  "/procedures/microneedling-with-prp",
  "/procedures/prp-breast-lift",
  "/procedures/prp-hair-restoration",
  "/events",
  "/events/botox-party",
  "/locations/williamsburg-va",
  "/locations/james-city-county-va",
  "/blog",
  "/consult",
];
for (const path of priorityPaths) {
  if (!sitemapUrls.some((url) => normalizePath(url) === path)) fail(`priority route missing from sitemap: ${path}`);
}

if (warnings.length) {
  console.warn(`SEO verification warnings (${warnings.length}):`);
  warnings.forEach((message) => console.warn(`- ${message}`));
}
if (failures.length) {
  console.error(`SEO verification failed (${failures.length}):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  `SEO verification passed: ${sitemapUrls.length} sitemap URLs, ${internalPaths.size} internal paths, ${imagePaths.size} rendered image URLs, ${jsonLdBlocks} server-rendered JSON-LD blocks, 0 failures.`
);
