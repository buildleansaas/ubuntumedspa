#!/usr/bin/env node

import { URL } from "node:url";

const targetArg = process.argv.slice(2).find((argument) => !argument.startsWith("-"));
const baseUrl = new URL(targetArg || process.env.SEO_BASE_URL || "http://127.0.0.1:3000");
const canonicalOrigin = "https://www.williamsburgmedspa.com";
const failures = [];
const warnings = [];

const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
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
  const h1Count = (html.match(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi) || []).length;
  if (h1Count !== 1) fail(`${canonicalUrl} has ${h1Count} H1 elements`);

  const canonicalMatches = extractAll(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/gi);
  if (canonicalMatches.length !== 1) {
    fail(`${canonicalUrl} has ${canonicalMatches.length} canonical links`);
  } else {
    const renderedCanonical = unescapeHtml(canonicalMatches[0]);
    const expectedCanonical = `${canonicalOrigin}${expectedPath}`;
    if (renderedCanonical !== expectedCanonical) {
      fail(`${canonicalUrl} canonical points to ${renderedCanonical}, expected ${expectedCanonical}`);
    }
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

const newportNews = pages.find((page) => normalizePath(page.canonicalUrl) === "/locations/newport-news-va")?.html || "";
for (const owner of [
  "/procedures/botox",
  "/procedures/filler",
  "/procedures/prp-facial",
  "/procedures/blomdahl-ear-piercing/near/newport-news-va",
  "/consult",
  "/locations/williamsburg-va",
]) {
  const pattern = new RegExp(`href=["']${owner.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
  if (!pattern.test(newportNews)) fail(`Newport News owner does not directly link to ${owner}`);
}
if (/Popular searches|Easy internal links/.test(newportNews)) {
  fail("Newport News owner exposes operator-facing SEO language");
}
if (!newportNews.includes("How do I choose between Botox/Xeomin and dermal filler?")) {
  fail("Newport News owner is missing the visible Botox/filler decision answer");
}
if (!newportNews.includes('"@type":"FAQPage"')) {
  fail("Newport News owner is missing server-rendered FAQPage schema");
}

const priorityPaths = [
  "/",
  "/procedures/botox",
  "/procedures/filler",
  "/procedures/blomdahl-ear-piercing",
  "/procedures/blomdahl-ear-piercing/for/sensitive-ears",
  "/procedures/hyperhidrosis-treatment",
  "/procedures/microneedling-with-prp",
  "/events",
  "/events/botox-party",
  "/locations/williamsburg-va",
  "/locations/newport-news-va",
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
