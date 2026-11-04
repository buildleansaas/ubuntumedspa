#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

import { REMOVED_FILLER_BLOG_PATHS, REMOVED_URL_REDIRECT_CHECKS } from "../src/config/removed-redirects.mjs";
import { unsupportedPrpBreastClaimClasses } from "./lib/prp-breast-claims.mjs";

const targetArg = process.argv.slice(2).find((argument) => !argument.startsWith("-"));
const baseUrl = new URL(targetArg || process.env.SEO_BASE_URL || "http://127.0.0.1:3000");
const canonicalOrigin = "https://www.williamsburgmedspa.com";
const expectedClinicGeo = { latitude: 37.2729739, longitude: -76.7635887 };
const failures = [];
const warnings = [];

const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const consultInterestSource = readFileSync(new URL("../src/lib/consult-procedure-interests.ts", import.meta.url), "utf8");
if (!/"prp-hair-restoration"\s*:\s*\["Hair Restoration"\]/.test(consultInterestSource)) {
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
  value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
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

for (const claimClass of unsupportedPrpBreastClaimClasses) {
  for (const fixture of claimClass.fixtures) {
    if (!claimClass.expression.test(fixture)) {
      fail(`PRP Breast Lift claim detector missed ${claimClass.name} fixture: ${fixture}`);
    }
  }
  for (const fixture of claimClass.allowedFixtures) {
    if (claimClass.expression.test(fixture)) {
      fail(`PRP Breast Lift claim detector rejected allowed ${claimClass.name} fixture: ${fixture}`);
    }
  }
}

const sourceContractHash = (value) => createHash("sha256").update(value.replace(/\r\n/g, "\n").trim()).digest("hex");
const extractMarkedSource = (source, startMarker, endMarker) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start === -1 || end === -1) return null;
  return source.slice(start + startMarker.length, end);
};
const assertSourceContract = (name, source, expectedHash) => {
  if (source === null) {
    fail(`${name} markers are missing`);
    return;
  }
  const actualHash = sourceContractHash(source);
  if (actualHash !== expectedHash) fail(`${name} changed outside its reviewed clinical copy contract (${actualHash})`);
};

const procedureDataSource = unescapeHtml(readFileSync(new URL("../src/data.ts", import.meta.url), "utf8"));
const procedureRouteSource = unescapeHtml(readFileSync(new URL("../src/app/procedures/[slug]/page.tsx", import.meta.url), "utf8"));
const sharedFooterSource = unescapeHtml(readFileSync(new URL("../src/components/footer.tsx", import.meta.url), "utf8"));
const ownerDataStart = procedureDataSource.indexOf('name: "PRP Breast Lift"');
const ownerDataEnd = procedureDataSource.indexOf('name: "PRP Hair Restoration"', ownerDataStart + 1);
if (ownerDataStart === -1 || ownerDataEnd === -1) {
  fail("could not isolate the PRP Breast Lift owner-data source contract");
} else {
  const ownerDataSource = procedureDataSource.slice(ownerDataStart, ownerDataEnd);
  const routeOwnerSource = extractMarkedSource(
    procedureRouteSource,
    "PRP_BREAST_OWNER_COPY_CONTRACT_START",
    "PRP_BREAST_OWNER_COPY_CONTRACT_END"
  );
  const sharedFooterContractSource = extractMarkedSource(
    sharedFooterSource,
    "PRP_BREAST_SHARED_COPY_CONTRACT_START",
    "PRP_BREAST_SHARED_COPY_CONTRACT_END"
  );
  assertSourceContract("PRP Breast Lift owner data", ownerDataSource, "067e63cd409c31183e7f828410c13109b5dafdebaaa84502b79b93bdefbcf482");
  assertSourceContract("PRP Breast Lift route copy", routeOwnerSource, "34e180bb63489dabb2f4ec23086266cacdea75b8a2124c8135f6f35d92905c56");
  assertSourceContract("shared footer clinical copy", sharedFooterContractSource, "aa96d5b0cca7dadcc9fb2e42bdf88c90839424fcc8118c2a1c9a956d98fbeec5");
}

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
  } else {
    const renderedCanonical = unescapeHtml(canonicalMatches[0]);
    const expectedCanonical = `${canonicalOrigin}${expectedPath}`;
    // Next 15 renders the root canonical as the bare origin (no trailing slash); Google treats both as the same URL.
    const acceptedCanonicals = expectedPath === "/" ? [expectedCanonical, canonicalOrigin] : [expectedCanonical];
    if (!acceptedCanonicals.includes(renderedCanonical)) {
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
      const medicalBusinesses = schemas.filter((schema) => schema?.["@type"] === "MedicalBusiness");
      medicalBusinessBlocks += medicalBusinesses.length;
      for (const medicalBusiness of medicalBusinesses) {
        const latitude = Number(medicalBusiness?.geo?.latitude);
        const longitude = Number(medicalBusiness?.geo?.longitude);
        if (latitude !== expectedClinicGeo.latitude || longitude !== expectedClinicGeo.longitude) {
          fail(`${canonicalUrl} MedicalBusiness geo is ${latitude},${longitude}; expected ${expectedClinicGeo.latitude},${expectedClinicGeo.longitude}`);
        }
      }
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
for (const owner of ["/procedures/botox", "/procedures/xeomin", "/procedures/blomdahl-ear-piercing"]) {
  const pattern = new RegExp(`href=["']${owner.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
  if (!pattern.test(home)) fail(`homepage does not directly link to query owner ${owner}`);
}
const homeTitle = getVisibleText(home.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i)?.[1] || "");
if (/filler/i.test(homeTitle)) {
  fail("homepage title still lists filler, which the clinic no longer offers");
}
if (homeTitle !== "Medical Spa Williamsburg VA | Xeomin (Botox Alternative) & PRP") {
  fail(`homepage title competes or drifted: ${JSON.stringify(homeTitle)}`);
}
if (/ear piercing/i.test(homeTitle)) fail("homepage title still competes for the ear piercing head term");
const homeLinks = [...home.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => ({
  attributes: getTagAttributes(`<a ${match[1]}>`),
  text: getVisibleText(match[2]),
}));
const homeXeominChip = homeLinks.some(
  (link) => link.attributes.href === "/procedures/xeomin" && /xeomin in williamsburg/i.test(link.text)
);
if (!homeXeominChip) {
  fail("homepage drops the descriptive Xeomin in Williamsburg link to the Xeomin service owner");
}
const homeDescriptionTag = (home.match(/<meta\b[^>]*>/gi) || []).find(
  (tag) => getTagAttributes(tag).name?.toLowerCase() === "description"
);
const homeDescription = homeDescriptionTag ? getTagAttributes(homeDescriptionTag).content || "" : "";
const expectedHomeDescription =
  "Nurse-led med spa on Powhatan Pkwy. Xeomin® wrinkle relaxer (a Botox® alternative) from $250 cash, PRP, and Blomdahl ear piercing.";
if (homeDescription !== expectedHomeDescription) {
  fail(`homepage meta description is ${JSON.stringify(homeDescription)}`);
}
if (homeDescription.length > 160) fail(`homepage meta description is ${homeDescription.length} characters`);
if (!/Xeomin/.test(homeDescription) || !/Botox® alternative/.test(homeDescription) || !/Blomdahl ear piercing/.test(homeDescription)) {
  fail("homepage meta drops Xeomin, the Botox-alternative framing, or Blomdahl ear piercing");
}
// The clinic uses only Xeomin; Botox may appear only as the searched-for term or a comparison.
const homeBotoxAlternativeLink = homeLinks.some(
  (link) => link.attributes.href === "/procedures/botox" && /botox alternative in williamsburg/i.test(link.text)
);
if (!homeBotoxAlternativeLink) fail('homepage drops the "Botox alternative in Williamsburg" link');
if (/filler/i.test(homeDescription)) fail("homepage meta includes filler language");

const readSnippet = (html) => {
  const title = getVisibleText(html.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i)?.[1] || "");
  const descriptionTag = (html.match(/<meta\b[^>]*>/gi) || []).find(
    (tag) => getTagAttributes(tag).name?.toLowerCase() === "description"
  );
  const description = descriptionTag ? getTagAttributes(descriptionTag).content || "" : "";
  const h1 = getVisibleText(html.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i)?.[1] || "");
  return { title, description, h1 };
};

const snippetExpectations = {
  "/procedures/blomdahl-ear-piercing": {
    title: "Ear Piercing Williamsburg VA | Blomdahl Pediatric NP",
    description:
      "Sterile, hypoallergenic Blomdahl ear piercing in Williamsburg, VA by a pediatric NP. $45 per ear in cash or $46.66 online by card.",
    h1: "Ear Piercing in Williamsburg, VA",
  },
  "/blog/blomdahl-medical-plastic-vs-titanium-earrings": {
    title: "Blomdahl Earrings Review: Medical Plastic vs Titanium",
    description:
      "Blomdahl earrings review: Medical Plastic vs titanium in Williamsburg. Compare starter jewelry, then book the ear piercing hub.",
  },
};
for (const [path, expectation] of Object.entries(snippetExpectations)) {
  const page = pages.find((candidate) => normalizePath(candidate.canonicalUrl) === path);
  if (!page) {
    fail(`snippet page missing from sitemap: ${path}`);
    continue;
  }
  const snippet = readSnippet(page.html);
  if (snippet.title !== expectation.title) {
    fail(`${path} title is ${JSON.stringify(snippet.title)}, expected ${JSON.stringify(expectation.title)}`);
  }
  if (snippet.description !== expectation.description) {
    fail(`${path} meta description is ${JSON.stringify(snippet.description)}`);
  }
  if (snippet.description.length > 160) fail(`${path} meta description is ${snippet.description.length} characters`);
  if (expectation.h1 && snippet.h1 !== expectation.h1) {
    fail(`${path} H1 is ${JSON.stringify(snippet.h1)}, expected ${JSON.stringify(expectation.h1)}`);
  }
}
const reviewPage = pages.find(
  (candidate) => normalizePath(candidate.canonicalUrl) === "/blog/blomdahl-medical-plastic-vs-titanium-earrings"
);
if (reviewPage && !/href=["']\/procedures\/blomdahl-ear-piercing["']/.test(reviewPage.html)) {
  fail("Blomdahl earrings review does not link to the ear piercing hub");
}

if (!home.includes('id="blomdahl-callout"')) fail("homepage is missing #blomdahl-callout");
if (!home.includes('id="oh-shot-callout"')) fail("homepage dropped the OH-Shot callout");
if (!home.includes("Cellular Medicine Association-trained and certified OH-Shot provider.")) {
  fail("homepage dropped the OH-Shot CMA credential strip");
}
const homepagePiercingBooking =
  "/consult?procedure=blomdahl-ear-piercing&amp;utm_source=website&amp;utm_medium=homepage_callout&amp;utm_campaign=ear_piercing_homepage";
if (!home.includes(`href="${homepagePiercingBooking}"`)) {
  fail("homepage Blomdahl callout is missing its booking campaign");
}
for (const href of ["/procedures/blomdahl-ear-piercing", "/procedures/blomdahl-ear-piercing/for/children"]) {
  if (!new RegExp(`href=["']${href}["']`).test(home)) fail(`homepage Blomdahl callout is missing ${href}`);
}
const piercingHub = pages.find((page) => normalizePath(page.canonicalUrl) === "/procedures/blomdahl-ear-piercing");
const childrenPiercing = pages.find(
  (page) => normalizePath(page.canonicalUrl) === "/procedures/blomdahl-ear-piercing/for/children"
);
if (
  piercingHub &&
  !piercingHub.html.includes(
    "/consult?procedure=blomdahl-ear-piercing&amp;utm_source=website&amp;utm_medium=procedure_page&amp;utm_campaign=ear_piercing\""
  )
) {
  fail("Blomdahl hub booking path dropped the ear_piercing campaign");
}
if (
  childrenPiercing &&
  !childrenPiercing.html.includes(
    "/consult?procedure=blomdahl-ear-piercing&amp;intent=children&amp;utm_source=website&amp;utm_medium=intent_page&amp;utm_campaign=ear_piercing_children"
  )
) {
  fail("children ear piercing page dropped the ear_piercing_children campaign");
}

const williamsburgPiercingVisit = pages.find(
  (page) => normalizePath(page.canonicalUrl) === "/procedures/blomdahl-ear-piercing/near/williamsburg-va"
);
if (williamsburgPiercingVisit) {
  const visitSnippet = readSnippet(williamsburgPiercingVisit.html);
  if (visitSnippet.title === "Medical Ear Piercing in Williamsburg, VA | Blomdahl") {
    fail("Williamsburg piercing visit page title still uses the hub head term");
  }
  if (visitSnippet.h1 === "Medical Ear Piercing in Williamsburg, VA") {
    fail("Williamsburg piercing visit page H1 still uses the hub head term");
  }
  if (!/3900 Powhatan Parkway/.test(williamsburgPiercingVisit.html)) {
    fail("Williamsburg piercing visit page does not name the clinic address");
  }
  if (!/href=["']\/procedures\/blomdahl-ear-piercing["']/.test(williamsburgPiercingVisit.html)) {
    fail("Williamsburg piercing visit page does not link to the hub");
  }
}
if (piercingHub && !piercingHub.html.includes("Does Blomdahl use a needle or a piercing gun?")) {
  fail("Blomdahl hub is missing the cassette versus gun FAQ");
}
if (piercingHub && !/href=["']\/blog\/medical-ear-piercing-vs-mall-piercing["']/.test(piercingHub.html)) {
  fail("Blomdahl hub does not link to the medical versus mall guide");
}
for (const path of [
  "/locations/williamsburg-va",
  "/locations/yorktown-va",
  "/locations/newport-news-va",
  "/locations/james-city-county-va",
]) {
  const locationPage = pages.find((page) => normalizePath(page.canonicalUrl) === path);
  if (!locationPage) {
    fail(`location page missing from sitemap: ${path}`);
    continue;
  }
  if (!/href=["']\/procedures\/blomdahl-ear-piercing["']/.test(locationPage.html)) {
    fail(`${path} does not link to the Blomdahl hub`);
  }
  if (!/href=["']\/procedures\/blomdahl-ear-piercing\/for\/children["']/.test(locationPage.html)) {
    fail(`${path} does not link to children's ear piercing`);
  }
  const locationTitle = readSnippet(locationPage.html).title;
  if (/& Piercing/.test(locationTitle) || /Ear Piercing in Williamsburg/i.test(locationTitle)) {
    fail(`${path} title still competes for the piercing head term: ${locationTitle}`);
  }
}

const childrenPage = pages.find(
  (page) => normalizePath(page.canonicalUrl) === "/procedures/blomdahl-ear-piercing/for/children"
);
if (childrenPage && !/pediatric ear piercing/i.test(getVisibleText(childrenPage.html))) {
  fail("children ear piercing page does not say pediatric ear piercing");
}
if (childrenPage && !/6 months/.test(childrenPage.html)) {
  fail("children ear piercing page dropped the 6-month guidance");
}
const sensitivePage = pages.find(
  (page) => normalizePath(page.canonicalUrl) === "/procedures/blomdahl-ear-piercing/for/sensitive-ears"
);
for (const heading of ["Hypoallergenic starter earrings", "Nickel-free Medical Plastic", "Medical Grade Titanium"]) {
  if (sensitivePage && !sensitivePage.html.includes(heading)) fail(`sensitive-ears page is missing heading ${heading}`);
}
const repiercePage = pages.find(
  (page) => normalizePath(page.canonicalUrl) === "/procedures/blomdahl-ear-piercing/for/re-piercing"
);
if (repiercePage && !/Do not force jewelry/.test(repiercePage.html)) {
  fail("re-piercing page dropped the do-not-reopen guidance");
}
if (repiercePage && !/3900 Powhatan Parkway/.test(repiercePage.html)) {
  fail("re-piercing page does not name the Williamsburg clinic");
}
const mallBlog = pages.find(
  (page) => normalizePath(page.canonicalUrl) === "/blog/medical-ear-piercing-vs-mall-piercing"
);
if (mallBlog) {
  const mallSnippet = readSnippet(mallBlog.html);
  if (mallSnippet.description.length > 160) fail(`mall piercing blog meta is ${mallSnippet.description.length} characters`);
  if (!/mall gun/i.test(mallSnippet.description) || !/Williamsburg/.test(mallSnippet.description)) {
    fail("mall piercing blog meta dropped the gun contrast or Williamsburg");
  }
  if (!/href=["']\/procedures\/blomdahl-ear-piercing["']/.test(mallBlog.html)) {
    fail("mall piercing blog does not link to the hub");
  }
}
const aftercareBlog = pages.find(
  (page) => normalizePath(page.canonicalUrl) === "/blog/ear-piercing-aftercare-williamsburg-va"
);
if (aftercareBlog) {
  const aftercareSnippet = readSnippet(aftercareBlog.html);
  if (!/Williamsburg/.test(aftercareSnippet.title) || !/Blomdahl/.test(aftercareSnippet.title)) {
    fail("aftercare title is not localized to Williamsburg and Blomdahl");
  }
  if (!/utm_campaign=ear_piercing_aftercare/.test(aftercareBlog.html)) {
    fail("aftercare post is missing the hub booking link");
  }
}
for (const [path, locationPath, proof] of [
  ["/procedures/blomdahl-ear-piercing/near/yorktown-va", "/locations/yorktown-va", "Tabb"],
  ["/procedures/blomdahl-ear-piercing/near/newport-news-va", "/locations/newport-news-va", "Oyster Point"],
]) {
  const areaPage = pages.find((page) => normalizePath(page.canonicalUrl) === path);
  if (!areaPage) {
    fail(`piercing area page missing from sitemap: ${path}`);
    continue;
  }
  if (!areaPage.html.includes(proof)) fail(`${path} is missing local proof ${proof}`);
  if (!/3900 Powhatan Parkway/.test(areaPage.html)) fail(`${path} does not name the Williamsburg clinic`);
  if (!new RegExp(`href=["']${locationPath}["']`).test(areaPage.html)) {
    fail(`${path} does not link to ${locationPath}`);
  }
  if (!/href=["']\/procedures\/blomdahl-ear-piercing["']/.test(areaPage.html)) {
    fail(`${path} does not link to the hub`);
  }
}
if (
  pages.some((page) => normalizePath(page.canonicalUrl) === "/procedures/blomdahl-ear-piercing/near/newport-news-va") &&
  /Newport News, VA 23/.test(
    pages.find((page) => normalizePath(page.canonicalUrl) === "/procedures/blomdahl-ear-piercing/near/newport-news-va")?.html || ""
  )
) {
  fail("Newport News piercing page invented a Newport News street address");
}

const newportNews = pages.find((page) => normalizePath(page.canonicalUrl) === "/locations/newport-news-va")?.html || "";
for (const owner of [
  "/procedures/botox",
  "/procedures/xeomin",
  "/procedures/prp-facial",
  "/procedures/microneedling-with-prp",
  "/procedures/blomdahl-ear-piercing/near/newport-news-va",
  "/consult",
  "/locations/williamsburg-va",
]) {
  const pattern = new RegExp(`href=["']${owner.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
  if (!pattern.test(newportNews)) fail(`Newport News owner does not directly link to ${owner}`);
}
if (/Quick read|Popular searches|Easy internal links/.test(newportNews)) {
  fail("Newport News owner exposes operator-facing SEO language");
}
if (!newportNews.includes("Do you offer Botox for Newport News patients?")) {
  fail("Newport News owner is missing the visible Botox/Xeomin answer");
}
if (!/Botox alternative in Williamsburg/.test(newportNews)) {
  fail('Newport News owner is missing the "Botox alternative in Williamsburg" link');
}
if (!newportNews.includes('"@type":"FAQPage"')) {
  fail("Newport News owner is missing server-rendered FAQPage schema");
}

const ownerPageExpectations = {
  "/procedures/b12-injections": {
    title: "Vitamin B-12 Injections in Williamsburg, VA | $25 Cash",
    description:
      "Vitamin B-12 injections in Williamsburg, VA: $25 each in cash or $26.06 online by card. Nurse-led by Jenny Brady, who reviews your health history first.",
    h1: "Vitamin B-12 Injections in Williamsburg, VA",
    required: [
      "$25 per injection cash · $26.06 card/online",
      "B-12 injections are not a weight-loss treatment.",
      "Jenny sets the schedule based on your history and any lab results.",
      "including to cobalt or cobalamin",
      "text or call Jenny",
    ],
    forbidden: ["energy boost", "boost your energy", "metabolism", "immunity", "anti-aging", "lose weight", "cyanocobalamin", "methylcobalamin"],
    requiredConsultHref:
      "/consult?procedure=b12-injections&utm_source=website&utm_medium=procedure_page&utm_campaign=b12_injections",
    offer: { name: "Vitamin B-12 Injections", price: "26.06", currency: "USD" },
  },
  "/procedures/prp-breast-lift": {
    title: "Breast Lift Williamsburg VA | PRP, Not Surgery",
    description:
      "Breast lift in Williamsburg, VA: the PRP visit ($1,800 in cash or $1,854.07 online by card) is not surgery and does not promise a cosmetic result.",
    h1: "PRP Breast Lift in Williamsburg, VA",
    required: [
      "What a PRP Breast Lift can and cannot do",
      "does not document the clinic's current method",
      "does not promise a cosmetic result",
      "mastopexy, implants, or fat transfer",
      "$1,800 cash · $1,854.07 card/online",
      "Full upfront payment for one treatment visit",
      "Book a Private PRP Breast Consultation",
    ],
    forbidden: [
      "even a lifetime",
      "safe and effective way",
      "stimulating the growth of new blood vessels and fatty tissue",
      "expected change is much subtler",
      "injected according to the plan you make with Jenny",
      "Jenny reviews the selected areas, comfort plan, and injection approach",
      "Jenny will review activity and aftercare guidance",
      "Jenny reviews progress and any follow-up plan",
      "Candidacy review should cover pregnancy",
      "After Jenny confirms the treatment fits your goals",
      "platelet-rich plasma is delivered by injection",
      "The treatment uses injections rather than implants",
      "PRP procedures generally involve a blood draw",
      "blood-draw, PRP-preparation, and injection steps used for this service",
      "injection risks, and alternatives to PRP breast treatment",
      "prepared from a person's own blood",
      "your own blood components",
      "our PRP treatments are personalized, natural-looking",
      "realistic changes",
      "a subtle appearance change is realistic",
      "Published medical literature describes different PRP preparations",
      "Published evidence for cosmetic breast benefits is limited",
      "Confirm candidacy first",
      "qualified clinician reviewing candidacy",
      "screening or imaging history",
      "tenderness, swelling, bruising",
      "method-specific risk information applies",
      "verified project sources",
      "project sources",
      "owner page",
      "protected query",
      "🩸",
    ],
    requiredHtml: [/href=["']\/consult\?procedure=prp-breast-lift&amp;utm_source=website&amp;utm_medium=procedure_page&amp;utm_campaign=prp_breast_lift["']/],
    requiredConsultHref:
      "/consult?procedure=prp-breast-lift&utm_source=website&utm_medium=procedure_page&utm_campaign=prp_breast_lift",
    forbiddenHtml: [/id=["']prp-breast-lift-quantity["']/],
    offer: { name: "PRP Breast Lift", price: "1854.07", currency: "USD" },
  },
  "/procedures/prp-hair-restoration": {
    title: "Hair Transplant Williamsburg VA | PRP Is Not Surgery",
    description:
      "Female hair transplant or hairline transplant in Williamsburg? PRP does not move follicles. Ask when a specialist fits.",
    h1: "PRP Hair Restoration in Williamsburg, VA",
    required: [
      "Is PRP a reasonable fit for your hair-loss pattern?",
      "female hair transplant",
      "hairline transplant in Williamsburg",
      "this visit is not that surgery",
      "Research suggests platelet-rich plasma may improve hair density for some people with pattern hair loss",
      "does not create new follicles in a bald area",
      "Medical evaluation may come first",
      "$600 per treatment cash · $618.23 card/online",
      "purchase one session and choose one appointment time after checkout",
      "For patients cleared to proceed",
      "Book a PRP Hair Consultation",
    ],
    forbidden: ["guaranteed regrowth", "creates new hair follicles", "permanent hair restoration", "little to no downtime"],
    requiredHtml: [/href=["']\/consult\?procedure=prp-hair-restoration&amp;utm_source=website&amp;utm_medium=procedure_page&amp;utm_campaign=prp_hair_restoration["']/],
    requiredConsultHref:
      "/consult?procedure=prp-hair-restoration&utm_source=website&utm_medium=procedure_page&utm_campaign=prp_hair_restoration",
    forbiddenHtml: [/id=["']prp-hair-restoration-quantity["']/],
    offer: { name: "PRP Hair Restoration", price: "618.23", currency: "USD" },
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
      /href=["']\/procedures\/prp-hair-restoration["']/,
      /href=["']\/procedures\/hyperhidrosis-treatment["']/,
      /href=["']\/procedures\/blomdahl-ear-piercing["']/,
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
  if (path === "/procedures/prp-breast-lift") {
    for (const claimClass of unsupportedPrpBreastClaimClasses) {
      if (claimClass.expression.test(text)) {
        fail(`${path} rendered text contains unsupported ${claimClass.name}`);
      }
    }
  }
  const title = getVisibleText(page.html.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i)?.[1] || "");
  const descriptionTag = (page.html.match(/<meta\b[^>]*>/gi) || []).find(
    (tag) => getTagAttributes(tag).name?.toLowerCase() === "description"
  );
  const description = descriptionTag ? getTagAttributes(descriptionTag).content || "" : "";
  const h1 = getVisibleText(page.html.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i)?.[1] || "");
  if (expectation.title && title !== expectation.title) fail(`${path} title is ${JSON.stringify(title)}, expected ${JSON.stringify(expectation.title)}`);
  if (expectation.description && description !== expectation.description) {
    fail(`${path} meta description is ${JSON.stringify(description)}, expected ${JSON.stringify(expectation.description)}`);
  }
  if (expectation.h1 && h1 !== expectation.h1) fail(`${path} H1 is ${JSON.stringify(h1)}, expected ${JSON.stringify(expectation.h1)}`);
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
  if (expectation.requiredConsultHref) {
    const consultationCtas = [...page.html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
      .map((match) => ({ attributes: getTagAttributes(`<a ${match[1]}>`), text: getVisibleText(match[2]) }))
      .filter(({ text }) => /book.*consultation/i.test(text));
    if (!consultationCtas.length) fail(`${path} has no consultation CTA links`);
    for (const { attributes, text: linkText } of consultationCtas) {
      if (unescapeHtml(attributes.href || "") !== expectation.requiredConsultHref) {
        fail(`${path} consultation CTA ${JSON.stringify(linkText)} drops procedure attribution: ${attributes.href || "(missing href)"}`);
      }
    }
  }

  const schemas = extractAll(page.html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
    .map((raw) => JSON.parse(unescapeHtml(raw)))
    .flatMap((schema) => (Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema]));
  const serviceSchemas = schemas.filter((schema) => schema?.["@type"] === "Service");
  if (path === "/procedures/prp-breast-lift") {
    if (serviceSchemas.length !== 1 || serviceSchemas[0]?.name !== "PRP Breast Lift") {
      fail(`${path} must expose exactly one PRP Breast Lift Service schema`);
    }
  }
  if (path === "/procedures/prp-hair-restoration") {
    if (serviceSchemas.length !== 1 || serviceSchemas[0]?.name !== "PRP Hair Restoration") {
      fail(`${path} must expose exactly one PRP Hair Restoration Service schema`);
    }
  }
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

// 2026-11 service satellites (src/lib/service-satellites.ts): hyperhidrosis concern pages and PRP Breast Lift / PRP Face Lift
// area pages. Each is in the sitemap, links to its hub (and area pages to their /locations page), renders FAQPage schema,
// and is linked from its hub. The PRP Breast Lift area pages pass the same claim detectors as the hub.
const hyperhidrosisSideEffects = "Temporary injection-site tenderness, bruising, or localized weakness can happen.";
const serviceSatelliteExpectations = [
  ["/procedures/hyperhidrosis-treatment/for/underarm-sweating", "Underarm Sweating Treatment Williamsburg VA | From $1,000", "Underarm Sweating Treatment in Williamsburg, VA", [hyperhidrosisSideEffects, "$1,000 cash · $1,030.18 card/online"]],
  ["/procedures/hyperhidrosis-treatment/for/sweaty-palms", "Sweaty Palms Treatment Williamsburg VA | From $1,000", "Sweaty Palms Treatment in Williamsburg, VA", [hyperhidrosisSideEffects, "$1,000 cash · $1,030.18 card/online"]],
  ["/procedures/hyperhidrosis-treatment/for/sweaty-feet", "Sweaty Feet Treatment Williamsburg VA | From $1,000", "Sweaty Feet Treatment in Williamsburg, VA", [hyperhidrosisSideEffects, "$1,000 cash · $1,030.18 card/online"]],
  ["/procedures/prp-breast-lift/near/newport-news-va", "PRP Breast Lift Newport News VA | Not Surgery, $1,800 Cash", "PRP Breast Lift near Newport News, VA", ["is not mastopexy, implants, or fat transfer", "does not promise a cosmetic result", "typically 25–35 minutes", "$1,800 cash · $1,854.07 card/online"]],
  ["/procedures/prp-breast-lift/near/yorktown-va", "PRP Breast Lift Yorktown VA | Not Surgery, $1,800 Cash", "PRP Breast Lift near Yorktown, VA", ["is not mastopexy, implants, or fat transfer", "does not promise a cosmetic result", "typically 25–35 minutes", "$1,800 cash · $1,854.07 card/online"]],
  ["/procedures/prp-face-lift/near/newport-news-va", "PRP Face Lift Newport News VA | $1,500 Cash, Non-Surgical", "PRP Face Lift near Newport News, VA", ["not a surgical face lift", "typically 25–35 minutes", "$1,500 cash · $1,545.11 card/online"]],
  ["/procedures/prp-face-lift/near/yorktown-va", "PRP Face Lift Yorktown VA | $1,500 Cash, Non-Surgical", "PRP Face Lift near Yorktown, VA", ["not a surgical face lift", "typically 25–35 minutes", "$1,500 cash · $1,545.11 card/online"]],
];
for (const [path, expectedTitle, expectedH1, required] of serviceSatelliteExpectations) {
  const page = pages.find((candidate) => normalizePath(candidate.canonicalUrl) === path);
  if (!page) {
    fail(`service satellite missing from sitemap: ${path}`);
    continue;
  }
  const snippet = readSnippet(page.html);
  if (snippet.title !== expectedTitle) fail(`${path} title is ${JSON.stringify(snippet.title)}, expected ${JSON.stringify(expectedTitle)}`);
  if (snippet.title.length > 60) fail(`${path} title is ${snippet.title.length} characters`);
  if (snippet.description.length > 160) fail(`${path} meta description is ${snippet.description.length} characters`);
  if (snippet.h1 !== expectedH1) fail(`${path} H1 is ${JSON.stringify(snippet.h1)}, expected ${JSON.stringify(expectedH1)}`);
  const text = getVisibleText(page.html);
  for (const copy of required) if (!text.includes(copy)) fail(`${path} is missing ${copy}`);
  const hub = path.split("/").slice(0, 3).join("/");
  if (!new RegExp(`href=["']${hub}["']`).test(page.html)) fail(`${path} does not link to its hub ${hub}`);
  if (path.includes("/near/")) {
    const location = `/locations/${path.split("/").pop()}`;
    if (!new RegExp(`href=["']${location}["']`).test(page.html)) fail(`${path} does not link to ${location}`);
  }
  if (!page.html.includes('"@type":"FAQPage"')) fail(`${path} is missing FAQPage schema`);
  if (path.startsWith("/procedures/prp-breast-lift/")) {
    for (const claimClass of unsupportedPrpBreastClaimClasses) {
      if (claimClass.expression.test(text)) fail(`${path} rendered text contains unsupported ${claimClass.name}`);
    }
  }
  const hubPage = pages.find((candidate) => normalizePath(candidate.canonicalUrl) === hub);
  if (hubPage && !new RegExp(`href=["']${path}["']`).test(hubPage.html)) fail(`${hub} does not link to its satellite ${path}`);
}
const hyperhidrosisHub = pages.find((page) => normalizePath(page.canonicalUrl) === "/procedures/hyperhidrosis-treatment");
if (hyperhidrosisHub && !hyperhidrosisHub.html.includes("Does insurance cover hyperhidrosis treatment?")) {
  fail("hyperhidrosis hub is missing the insurance and prior authorization FAQ");
}
const prpFacialHub = pages.find((page) => normalizePath(page.canonicalUrl) === "/procedures/prp-facial");
if (prpFacialHub && !/href=["']\/blog\/hydrafacial-alternatives-in-williamsburg-va["'][^>]*>HydraFacial alternatives in Williamsburg</.test(prpFacialHub.html)) {
  fail("PRP Facial hub does not link to the HydraFacial alternatives guide");
}
const hydrafacialGuide = pages.find(
  (page) => normalizePath(page.canonicalUrl) === "/blog/hydrafacial-alternatives-in-williamsburg-va"
);
if (!hydrafacialGuide) fail("HydraFacial alternatives guide missing from sitemap");
if (hydrafacialGuide && !/href=["']\/procedures\/prp-facial["'][^>]*>PRP Facial in Williamsburg</.test(hydrafacialGuide.html)) {
  fail('HydraFacial alternatives guide does not link to PRP Facial with "PRP Facial in Williamsburg"');
}
if (hydrafacialGuide && /noindex/i.test(hydrafacialGuide.html)) fail("HydraFacial alternatives guide is noindexed");

const consolidatedRedirects = [
  ["/blog/baby-ear-piercing-williamsburg-va", "/procedures/blomdahl-ear-piercing/for/children"],
  ["/blog/ear-piercing-cost-williamsburg-va", "/procedures/blomdahl-ear-piercing"],
  ["/blog/medical-ear-piercing-in-williamsburg-va-blohmdahl", "/procedures/blomdahl-ear-piercing"],
  ["/procedures/blomdahl-ear-piercing/near/fords-colony-va", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
  ["/locations/toano-va", "/locations/williamsburg-va"],
  ["/locations/fords-colony-va", "/locations/williamsburg-va"],
  ["/procedures/botox/near/williamsburg-va", "/procedures/botox"],
  ["/procedures/botox/for/crows-feet", "/procedures/botox"],
  ["/procedures/hyperhidrosis-treatment/for/facial-sweating", "/procedures/hyperhidrosis-treatment"],
  ["/procedures/feminine-intimacy-prp-protocols/for/urinary-incontinence", "/procedures/oh-shot"],
  ["/procedures/o-shot", "/procedures/oh-shot"],
  ["/procedures/o-shot/for/urinary-incontinence", "/procedures/oh-shot"],
  ["/procedures/oh-shot/for/urinary-incontinence", "/procedures/oh-shot"],
  ["/blog/o-shot-for-vaginal-dryness-what-to-know", "/blog/oh-shot-for-vaginal-dryness-what-to-know"],
  ["/blog/o-shot-for-urinary-incontinence-williamsburg-va", "/blog/oh-shot-for-urinary-incontinence-williamsburg-va"],
  ["/procedures/p-shot", "/procedures/pe-shot"],
  ["/procedures/p-shot/for/erectile-dysfunction", "/procedures/pe-shot"],
  ["/procedures/male-intimacy-prp-protocols", "/procedures/pe-shot"],
  // Issue #147: removed filler URLs and the old staff slug.
  ...REMOVED_URL_REDIRECT_CHECKS,
];
const assetRedirects = [
  ["/procedure/o-shot/womens-intimate-wellness-lifestyle.webp", "/procedure/oh-shot/womens-intimate-wellness-lifestyle.webp"],
  ["/blog/o-shot/urinary-incontinence-confidence.png", "/blog/oh-shot/urinary-incontinence-confidence.png"],
  ["/procedure/pshot-consultation-confidence.webp", "/procedure/pe-shot-consultation-confidence.webp"],
];
for (const [source, destination] of [...consolidatedRedirects, ...assetRedirects]) {
  const response = await fetchLocal(source, { redirect: "manual" });
  const location = response.headers.get("location");
  if (![301, 308].includes(response.status) || !location || normalizePath(location) !== destination) {
    fail(`${source} should permanently redirect to ${destination} (got ${response.status} ${location ?? "no location"})`);
  }
}
for (const [, destination] of consolidatedRedirects) {
  if (!sitemapUrls.some((url) => normalizePath(url) === destination)) {
    fail(`redirect destination missing from sitemap: ${destination}`);
  }
}

// Issue #147: dermal filler is no longer offered and the provider is now Jenny Brady.
const isRemovedPath = (path) =>
  /^\/procedures\/filler(?:\/|$)/.test(path) ||
  REMOVED_FILLER_BLOG_PATHS.includes(path) ||
  /^\/staff\/jenny-coleman(?:\/|$)/.test(path);
for (const url of sitemapUrls) {
  if (isRemovedPath(normalizePath(url))) fail(`sitemap still lists removed URL ${url}`);
}
for (const path of internalPaths) {
  if (isRemovedPath(path)) fail(`a rendered page still links to removed URL ${path}`);
}
for (const page of pages) {
  if (/"name":"Filler"/.test(page.html)) fail(`${page.canonicalUrl} still renders a Filler Service or Offer schema`);
  // The old surname is allowed in exactly one place: a Person JSON-LD "alternateName" (approved by Austin).
  // It must never appear in visible text, meta tags, or any other schema field. Inside scripts the same
  // field also appears escaped in the React flight payload that carries the JSON-LD, so both forms are allowed.
  const htmlWithoutAllowedAlternateName = page.html.replace(
    /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi,
    (_, open, body, close) => `${open}${body.replace(/\\*"alternateName\\*":\\*"Jenny Coleman\\*"/g, "")}${close}`
  );
  if (/Jenny\s+Coleman/i.test(htmlWithoutAllowedAlternateName)) {
    fail(`${page.canonicalUrl} still names Jenny Coleman outside the Person alternateName`);
  }
  if (/Coleman/i.test(getVisibleText(page.html))) fail(`${page.canonicalUrl} shows the old surname in visible text`);
}
const staffPage = pages.find((page) => normalizePath(page.canonicalUrl) === "/staff/jenny-brady");
const staffPersons = [...(staffPage?.html || "").matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => JSON.parse(unescapeHtml(match[1])))
  .flatMap((schema) => (Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema]))
  .filter((schema) => schema?.["@type"] === "Person" && schema?.name === "Jenny Brady");
if (!staffPersons.length) fail("/staff/jenny-brady is missing Jenny Brady Person schema");
if (!staffPersons.some((person) => person.alternateName === "Jenny Coleman")) {
  fail('/staff/jenny-brady Person schema is missing alternateName "Jenny Coleman"');
}

const priorityPaths = [
  "/",
  "/procedures/botox",
  "/procedures/xeomin",
  "/procedures/blomdahl-ear-piercing",
  "/procedures/blomdahl-ear-piercing/for/children",
  "/procedures/blomdahl-ear-piercing/for/sensitive-ears",
  "/procedures/hyperhidrosis-treatment",
  "/procedures/microneedling-with-prp",
  "/procedures/prp-breast-lift",
  "/procedures/prp-hair-restoration",
  "/procedures/b12-injections",
  "/events",
  "/events/botox-party",
  "/locations/williamsburg-va",
  "/locations/newport-news-va",
  "/locations/james-city-county-va",
  "/blog",
  "/consult",
];
for (const path of priorityPaths) {
  if (!sitemapUrls.some((url) => normalizePath(url) === path)) fail(`priority route missing from sitemap: ${path}`);
}

const botoxPage = pages.find((page) => normalizePath(page.canonicalUrl) === "/procedures/botox");
if (botoxPage) {
  const botoxSnippet = readSnippet(botoxPage.html);
  if (botoxSnippet.h1 !== "A Botox Alternative in Williamsburg, VA: We Use Xeomin®") {
    fail(`Botox-alternative H1 changed: ${JSON.stringify(botoxSnippet.h1)}`);
  }
  if (botoxSnippet.title !== "Botox Alternative in Williamsburg, VA | Xeomin® from $250 Cash") {
    fail(`Botox-alternative title changed: ${JSON.stringify(botoxSnippet.title)}`);
  }
  if (!/We use Xeomin®/.test(botoxSnippet.description) || !/\$250 cash/.test(botoxSnippet.description)) {
    fail("Botox-alternative meta dropped Xeomin or the cash price");
  }
  if (!botoxPage.html.includes("Botox® is a registered trademark of Allergan, Inc., an AbbVie company. Williamsburg Med Spa is not affiliated with Allergan and does not offer Botox® brand.")) {
    fail("Botox-alternative page is missing the trademark disclaimer");
  }
  // The Botox-alternative page sells the Xeomin item; the "botox" catalog item was removed.
  if (!/id=["']xeomin-quantity["']/.test(botoxPage.html) || /id=["']botox-quantity["']/.test(botoxPage.html)) {
    fail("Botox-alternative page purchase panel is not the Xeomin item");
  }
}
const eventsPage = pages.find((page) => normalizePath(page.canonicalUrl) === "/events");
if (eventsPage) {
  const eventsTitle = readSnippet(eventsPage.html).title;
  if (eventsTitle === "Botox Parties in Williamsburg, VA | Private Med Spa Events") {
    fail("events title still competes for Botox Williamsburg");
  }
  if (!/href=["']\/procedures\/xeomin["']/.test(eventsPage.html)) fail("events page does not link to the Xeomin owner");
}
const botoxParty = pages.find((page) => normalizePath(page.canonicalUrl) === "/events/botox-party");
if (botoxParty && readSnippet(botoxParty.html).title.startsWith("Botox Parties in Williamsburg")) {
  fail("Botox party title still competes for Botox Williamsburg");
}
if (botoxParty && !/href=["']\/procedures\/xeomin["']/.test(botoxParty.html)) {
  fail("wrinkle relaxer party page does not link to the Xeomin owner");
}
if (botoxParty && /free Botox|Botox party/i.test(getVisibleText(botoxParty.html))) {
  fail("wrinkle relaxer party page still offers Botox");
}
const newportNewsSnippet = readSnippet(newportNews);
if (newportNewsSnippet.title !== "Med Spa Newport News | Xeomin, a Botox Alternative") {
  fail(`Newport News title is ${JSON.stringify(newportNewsSnippet.title)}`);
}
if (!/25–35 minute drive from Newport News/.test(getVisibleText(newportNews))) {
  fail("Newport News wrinkle-relaxer section drive time drifted from the 25–35 minutes on /locations");
}
if (!/There is no Newport News street address/.test(newportNews)) {
  fail("Newport News page does not say there is no Newport News street address");
}
if (!/Med spa Newport News/i.test(newportNewsSnippet.description) || !/Botox/.test(newportNewsSnippet.description) || !/typically drive 25–35 minutes/.test(newportNewsSnippet.description)) {
  fail('Newport News meta does not target med spa and Botox, or drops "typically drive 25–35 minutes" (the drive time on /locations)');
}
if (!/does not offer Hydrafacial/.test(home)) fail("homepage does not disambiguate Hydrafacial");
if (!/href=["']\/procedures\/prp-facial["']/.test(home)) fail("homepage Hydrafacial note does not link to PRP Facial");
if (!/href=["']\/blog\/hydrafacial-alternatives-in-williamsburg-va["']/.test(home)) {
  fail("homepage Hydrafacial note does not link to the alternatives guide");
}
const ohShot = pages.find((page) => normalizePath(page.canonicalUrl) === "/procedures/oh-shot");
if (!ohShot) fail("OH-Shot owner missing from sitemap");
if (ohShot && !readSnippet(ohShot.html).title.includes("OH-Shot")) fail("OH-Shot title dropped the OH-Shot name");
if (ohShot && !/Cellular Medicine Association/.test(ohShot.html)) fail("OH-Shot page dropped CMA credential copy");
if (sitemapUrls.some((url) => /\/procedures\/o-shot(?:\/|$)/.test(new URL(url).pathname))) {
  fail("sitemap still contains a legacy o-shot URL");
}
const jennyPage = pages.find((page) => normalizePath(page.canonicalUrl) === "/staff/jenny-brady");
if (!jennyPage) fail("Jenny Brady page missing from sitemap");
if (jennyPage) {
  const jennyMain = jennyPage.html.match(/<main\b[\s\S]*?<footer\b/i)?.[0] || jennyPage.html;
  const jennyWords = getVisibleText(jennyMain).split(/\s+/).filter(Boolean);
  if (jennyWords.length < 180) fail(`Jenny Brady page has ${jennyWords.length} visible words; minimum is 180`);
}
if (sitemapUrls.some((url) => normalizePath(url) === "/locations/fords-colony-va")) {
  fail("Ford's Colony location URL is still in the sitemap");
}

const reviewsSource = readFileSync(new URL("../src/data/published-reviews.ts", import.meta.url), "utf8");
const reviewsEmpty = /export const publishedReviews: PublishedReview\[\] = \[\];/.test(reviewsSource);
if (reviewsEmpty && /Clinic reviews|Blomdahl Ear Piercing reviews/.test(home)) {
  fail("empty review file still rendered a reviews heading on the homepage");
}
if (/AggregateRating/.test(home)) fail("homepage includes an AggregateRating");
const piercingHubForReviews = pages.find((page) => normalizePath(page.canonicalUrl) === "/procedures/blomdahl-ear-piercing");
if (reviewsEmpty && piercingHubForReviews && /Blomdahl Ear Piercing reviews/.test(piercingHubForReviews.html)) {
  fail("empty review file still rendered reviews on the ear piercing hub");
}
for (const path of ["/terms", "/html-sitemap"]) {
  if (!sitemapUrls.some((url) => normalizePath(url) === path)) fail(`${path} missing from sitemap`);
}
const termsPage = pages.find((page) => normalizePath(page.canonicalUrl) === "/terms");
if (!termsPage) fail("terms page missing from rendered sitemap pages");
if (termsPage) {
  const termsText = getVisibleText(termsPage.html);
  for (const required of [
    "3900 Powhatan Parkway, Williamsburg, VA 23188",
    "(804) 738-9483",
    "not a diagnosis",
    "does not add a cancellation fee",
    "OH-Shot",
    "Pe-Shot",
  ]) {
    if (!termsText.includes(required)) fail(`terms page missing ${required}`);
  }
  if (/HIPAA certified|binding arbitration|you waive/i.test(termsText)) {
    fail("terms page includes an unapproved legal claim");
  }
}
const htmlSitemap = pages.find((page) => normalizePath(page.canonicalUrl) === "/html-sitemap");
if (!htmlSitemap) fail("HTML sitemap missing from rendered pages");
if (htmlSitemap) {
  for (const href of [
    "/procedures/botox",
    "/procedures/blomdahl-ear-piercing",
    "/locations/williamsburg-va",
    "/staff/jenny-brady",
    "/privacy",
    "/terms",
    "/sitemap.xml",
  ]) {
    if (!new RegExp(`href=["']${href}["']`).test(htmlSitemap.html)) fail(`HTML sitemap missing ${href}`);
  }
}
if (!home.includes('loading="lazy"')) fail("clinic map iframe is not lazy-loaded");
if (!home.includes("Map of Williamsburg Med Spa, 3900 Powhatan Parkway, Williamsburg, VA 23188")) {
  fail("clinic map iframe is missing an accessible title");
}
if (!/Williamsburg%20Med%20Spa/.test(home) || !/3900%20Powhatan%20Parkway/.test(home) || !/output=embed/.test(home)) {
  fail("clinic map is not keyed to the business name and street address");
}
if (!home.includes("(804) 738-9483") && !home.includes("+1 (804) 738-9483")) {
  fail("footer dropped the clinic phone number");
}
if (!/href=["']\/html-sitemap["']/.test(home) || !/href=["']\/terms["']/.test(home)) {
  fail("footer is missing the HTML sitemap or terms link");
}
const personBlocks = [...home.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => JSON.parse(unescapeHtml(match[1])))
  .flatMap((schema) => (Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema]))
  .filter((schema) => schema?.["@type"] === "Person" && schema?.name === "Jenny Brady");
if (!personBlocks.length) fail("homepage is missing Jenny Brady Person schema");
for (const person of personBlocks) {
  const credentialNames = (person.hasCredential || []).map((credential) => credential.name);
  if (!credentialNames.includes("Cellular Medicine Association-certified OH-Shot provider")) {
    fail("Jenny Person schema dropped the CMA OH-Shot credential");
  }
  if (!credentialNames.includes("Certified Blomdahl provider")) {
    fail("Jenny Person schema dropped the Blomdahl credential");
  }
  const knows = (person.knowsAbout || []).map((topic) => topic.name);
  for (const topic of ["Botulinum toxin", "Platelet-rich plasma", "Ear piercing", "Hyperhidrosis"]) {
    if (!knows.includes(topic)) fail(`Jenny Person schema is missing knowsAbout ${topic}`);
  }
  if (person.alumniOf) fail("Jenny Person schema invented alumniOf");
  if (person.memberOf) fail("Jenny Person schema invented memberOf");
  if (/filler/i.test(JSON.stringify(person))) fail("Jenny Person schema mentions filler");
}
if (/facebook\.com|instagram\.com|youtube\.com|linkedin\.com|tiktok\.com/i.test(home)) {
  fail("homepage links a social profile that has not been confirmed");
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
