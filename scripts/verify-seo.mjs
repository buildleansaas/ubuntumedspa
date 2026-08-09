#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

const targetArg = process.argv.slice(2).find((argument) => !argument.startsWith("-"));
const baseUrl = new URL(targetArg || process.env.SEO_BASE_URL || "http://127.0.0.1:3000");
const canonicalOrigin = "https://www.williamsburgmedspa.com";
const expectedClinicGeo = { latitude: 37.2729739, longitude: -76.7635887 };
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

const unsupportedPrpBreastClaimClasses = [
  {
    name: "blood-source or blood-component assertion",
    expression:
      /\b(?:uses?|using|contains?|made|prepared|derived|drawn)\b.{0,60}\b(?:your|a person's|the patient's|patient's|their)\s+(?:own\s+)?blood(?:\s+components?)?\b|\b(?:your|a person's|the patient's|patient's|their)\s+(?:own\s+)?blood(?:\s+components?)?\b.{0,60}\b(?:used|component|preparation|derived|prepared|drawn|processed|converted)\b|\b(?:plasma|platelets?|treatment|preparation)\s+(?:comes?|is|are)\s+from\s+(?:your|a person's|the patient's|patient's|their)\s+(?:own\s+)?blood\b|\bautologous\s+(?:blood|plasma|platelets?|platelet[- ]rich plasma)\b|\b(?:plasma|platelets?|platelet[- ]rich plasma)\b.{0,50}\b(?:blood draw|blood sample|sample of (?:the patient's|your|their) blood)\b/i,
    fixtures: [
      "This treatment uses components drawn from your blood.",
      "The preparation is derived from the patient's own blood components.",
      "The plasma comes from your own blood.",
      "Your blood is processed into the treatment.",
      "Autologous plasma is collected from a small blood sample.",
      "Platelet-rich plasma is prepared after a blood draw.",
    ],
    allowedFixtures: ["Ask the clinic to explain the current preparation before you decide."],
  },
  {
    name: "delivery-method presupposition",
    expression:
      /\b(?:injection|injections|injected)\b.{0,50}\b(?:method|steps?|used|for this service)\b|\b(?:is|are|will be)\s+(?:delivered|administered|injected)\s+(?:by|through|via|using)\b|\b(?:procedure|treatment|service)\s+(?:involves?|uses?|includes?)\b.{0,30}\b(?:injection|injections|needle|needle-based)\b|\bneedle-based\s+(?:method|technique|approach)\b.{0,40}\b(?:used|for this service)\b|\b(?:placed|delivered|administered)\b.{0,45}\b(?:breast tissue|breast area|treatment area)\b.{0,30}\b(?:needle|injection|injections)\b|\b(?:injectable|injection-based|needle-based)\s+(?:plan|treatment|procedure|service|approach)\b/i,
    fixtures: [
      "Ask the clinic to confirm the injection method used for this service.",
      "The treatment is delivered via injection.",
      "This procedure involves injections.",
      "Confirm the needle-based technique used for this service.",
      "The preparation is placed into breast tissue with a fine needle.",
      "Review whether an injectable plan may fit.",
    ],
    allowedFixtures: ["Ask the clinic whether and how this service is delivered."],
  },
  {
    name: "favorable cosmetic-outcome implication",
    expression:
      /\b(?:natural[- ]looking|subtle|modest|realistic)\s+(?:cosmetic\s+)?(?:result|results|outcome|outcomes|change|changes|improvement|improvements)\b|\b(?:cosmetic|appearance)\s+(?:improvement|improvements|change|changes)\s+(?:is|are|may be)\s+(?:achievable|realistic|expected|likely)\b|\b(?:visible|noticeable)\s+lift\b.{0,30}\b(?:may|can|could|will)\s+(?:occur|happen|result)\b|\b(?:treatment|procedure|service)\s+(?:may|can|could|will)\s+(?:improve|enhance|lift)\b.{0,40}\b(?:breast|appearance|contour|skin)\b|\bfuller[- ]looking\s+(?:breasts?|appearance|contour)?\b|\b(?:firmer\s*(?:,|and)\s*perkier|perkier\s*(?:,|and)\s*firmer)\b|\blifted\s+(?:breast\s+)?appearance\b/i,
    fixtures: [
      "Our PRP care is tailored for natural-looking outcomes.",
      "Ask whether a modest cosmetic improvement is achievable.",
      "A visible lift may occur.",
      "The treatment can improve breast appearance.",
      "The service can create fuller-looking breasts.",
      "Expect firmer, perkier breasts.",
      "A lifted appearance is possible.",
    ],
    allowedFixtures: ["Any cosmetic change, if one occurs, is uncertain."],
  },
];

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
  assertSourceContract("PRP Breast Lift owner data", ownerDataSource, "12036496067bc17536ea0d1775a19e8b65c0c2f09f02890c8e867ca33d896506");
  assertSourceContract("PRP Breast Lift route copy", routeOwnerSource, "472712ce62938c1f2386335e7055f690046c3494a7d24ebe0cc617003f60db6b");
  assertSourceContract("shared footer clinical copy", sharedFooterContractSource, "9a254fb69945627b989dec2c688c7c7c37fd0655408afe49e7da703bc387d9ec");
  const ownerSourceTargets = [
    ["PRP Breast Lift owner data", ownerDataSource],
    ["procedure route source", routeOwnerSource || ""],
    ["shared footer source", sharedFooterContractSource || ""],
  ];

  for (const [sourceName, source] of ownerSourceTargets) {
    for (const claimClass of unsupportedPrpBreastClaimClasses) {
      if (claimClass.expression.test(source)) {
        fail(`${sourceName} contains unsupported ${claimClass.name}`);
      }
    }
  }
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
if (/Quick read|Popular searches|Easy internal links/.test(newportNews)) {
  fail("Newport News owner exposes operator-facing SEO language");
}
if (!newportNews.includes("How do I choose between Botox/Xeomin and dermal filler?")) {
  fail("Newport News owner is missing the visible Botox/filler decision answer");
}
if (!newportNews.includes('"@type":"FAQPage"')) {
  fail("Newport News owner is missing server-rendered FAQPage schema");
}

const ownerPageExpectations = {
  "/procedures/prp-breast-lift": {
    title: "PRP Breast Lift in Williamsburg, VA",
    description:
      "Learn about PRP Breast Lift consultation in Williamsburg, VA, including limited evidence, realistic limits, candidacy questions, and how it differs from surgery.",
    h1: "PRP Breast Lift in Williamsburg, VA",
    required: [
      "What a PRP Breast Lift can and cannot do",
      "Published medical literature describes different PRP preparations",
      "Published evidence for cosmetic breast benefits is limited",
      "does not replace a surgical breast lift or breast augmentation",
      "$1,800",
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
    ],
    requiredHtml: [/href=["']\/consult\?procedure=prp-breast-lift&amp;utm_source=website&amp;utm_medium=procedure_page&amp;utm_campaign=prp_breast_lift["']/],
    forbiddenHtml: [/id=["']prp-breast-lift-quantity["']/],
  },
};
for (const [path, expectation] of Object.entries(ownerPageExpectations)) {
  const page = pages.find((candidate) => normalizePath(candidate.canonicalUrl) === path);
  if (!page) {
    fail(`owner page missing from sitemap: ${path}`);
    continue;
  }
  const text = getVisibleText(page.html);
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

  const serviceSchemas = extractAll(page.html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
    .map((raw) => JSON.parse(unescapeHtml(raw)))
    .flatMap((schema) => (Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema]))
    .filter((schema) => schema?.["@type"] === "Service");
  if (path === "/procedures/prp-breast-lift") {
    if (serviceSchemas.length !== 1 || serviceSchemas[0]?.name !== "PRP Breast Lift") {
      fail(`${path} must expose exactly one PRP Breast Lift Service schema`);
    }
    const offer = serviceSchemas.find((schema) => schema?.name === "PRP Breast Lift")?.offers;
    if (String(offer?.price) !== "1800" || offer?.priceCurrency !== "USD") {
      fail(`${path} Service schema is missing the $1,800 USD offer`);
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
