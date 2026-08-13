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

const splitClinicalClauses = (value) =>
  String(value)
    .split(/(?<=[.!?])\s+|\n+|;|\b(?:but|however|yet|although|while|nevertheless)\b/gi)
    .map((segment) => segment.trim())
    .filter(Boolean);
const isEvidenceLimitClause = (segment) =>
  /\b(?:unknown|uncertain|open question|not (?:been )?(?:established|demonstrated|proven|known)|does not (?:establish|promise)|do not (?:establish|promise)|cannot establish|evidence is insufficient|insufficient evidence|no\b.{0,100}\b(?:promised|guaranteed|established)|if (?:one|any) occurs?)\b/i.test(
    segment
  );

const isProtocolQuestionClause = (segment) =>
  /\b(?:ask|confirm)\b.{0,100}\b(?:if|whether)\b/i.test(segment) ||
  /^(?:can|does|do|is|are|how|what|whether)\b[^.!]*\?$/i.test(segment.trim());

const unsupportedPrpBreastClaimClasses = [
  {
    name: "blood-source or blood-component assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) {
            return false;
          }
          return (
            /\b(?:blood|bloodstream|venous|venipuncture|phlebotomy|centrifug(?:e|ed|es|ation)|specimen|plasma|platelets?|platelet[- ]rich plasma|autologous)\b/i.test(segment) ||
            /\b(?:sample|material|preparation)\b.{0,80}\b(?:spun|concentrated|processed|prepared|collected)\b|\b(?:spun|concentrated|processed|prepared|collected)\b.{0,80}\b(?:sample|material|preparation)\b/i.test(segment) ||
            /\b(?:cells?|growth factors?)\b.{0,80}\b(?:obtained|collected|isolated|patient sample)\b|\b(?:vial|sample)\b.{0,50}\b(?:arm|patient)\b/i.test(segment)
          );
        });
      },
    },
    fixtures: [
      "This treatment uses components drawn from your blood.",
      "The preparation is derived from the patient's own blood components.",
      "The plasma comes from your own blood.",
      "Your blood is processed into the treatment.",
      "Autologous plasma is collected from a small blood sample.",
      "Platelet-rich plasma is prepared after a blood draw.",
      "We collect a sample of the patient's blood for the procedure.",
      "A small amount of blood is collected from the patient before treatment.",
      "The clinician draws a small blood sample at the start of the visit.",
      "Blood is drawn from your arm before the service begins.",
      "The treatment starts by collecting blood from your arm.",
      "Platelets are separated from blood collected at the visit.",
      "Patient-sourced blood components form the preparation.",
      "PRP consists of components taken from the patient bloodstream.",
      "Patient blood supplies the components used in PRP.",
      "PRP is produced from a venous sample taken at the appointment.",
      "A centrifuge concentrates the collected specimen into PRP.",
      "The visit begins with venipuncture so the material can be prepared.",
      "The sample is spun down and concentrated before treatment.",
      "The material is processed into a concentrated preparation before use.",
      "The visit starts with phlebotomy before the material is prepared.",
      "The visit uses cells obtained from the patient.",
      "The service uses material collected from you.",
      "The service begins by collecting a vial from your arm.",
      "The treatment uses growth factors isolated from a patient sample.",
    ],
    allowedFixtures: [
      "Ask the clinic to explain the current preparation before you decide.",
      "Ask the clinic to explain whether any blood collection is part of its current protocol.",
      "Ask whether PRP comes from your blood.",
      "Does the clinic collect blood for this service?",
      "Ask the clinic if blood collection is part of its current protocol.",
    ],
  },
  {
    name: "delivery-method presupposition",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (
            isEvidenceLimitClause(segment) ||
            isProtocolQuestionClause(segment) ||
            (/\bwhether\b/i.test(segment) &&
              /\b(?:used|part of|delivered|administered|injected|performed|whether and how|how)\b/i.test(segment))
          ) {
            return false;
          }
          return /\b(?:inject(?:s|ed|ing|ion|ions|able)?|needles?|needle[- ]based|microneedl(?:e|es|ed|ing)|administer(?:s|ed|ing)?|deliver(?:s|ed|ing)?|appl(?:y|ies|ied|ying)|introduc(?:e|es|ed|ing)|insert(?:s|ed|ing)?|plac(?:e|es|ed|ing)|deposit(?:s|ed|ing)?|venipuncture)\b/i.test(
            segment
          );
        });
      },
    },
    fixtures: [
      "Ask the clinic to confirm the injection method used for this service.",
      "The treatment is delivered via injection.",
      "This procedure involves injections.",
      "Confirm the needle-based technique used for this service.",
      "The preparation is placed into breast tissue with a fine needle.",
      "Review whether an injectable plan may fit.",
      "The treatment is injected directly into breast tissue.",
      "This service is administered with a series of small needles.",
      "PRP is administered with needles.",
      "The clinician injects the preparation into breast tissue.",
      "Fine needles deliver the preparation to the breast area.",
      "Needles are used to administer this service.",
      "PRP goes into the breast with a fine needle.",
      "The clinician introduces PRP into breast tissue.",
      "A fine needle places PRP in the treatment area.",
      "The clinician applies PRP to the breast with microneedling.",
      "The page does not establish whether needles are used, but PRP is injected into tissue.",
      "PRP is placed beneath the skin of the breast.",
      "The clinician deposits the preparation into breast tissue.",
      "The page does not establish the method, although PRP is injected into tissue.",
      "It is unknown whether needles are used; the preparation is administered into breast tissue.",
    ],
    allowedFixtures: [
      "Ask the clinic whether and how this service is delivered.",
      "The page does not establish whether needles or injections are used.",
      "It is unknown whether injections are part of this service.",
      "Whether a needle is used remains an open question.",
      "Is the preparation injected or applied topically?",
      "How, if at all, is this service administered?",
    ],
  },
  {
    name: "favorable cosmetic-outcome implication",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment)) return false;
          const normalized = segment.replace(/\b(?:prp|surgical|traditional)?[- ]*breast[- ]lift\b/gi, " ");
          const hasOutcomeLanguage =
            /\b(?:natural[- ]looking|subtle|modest|realistic|visible|noticeable|gentle|youthful|younger|lifted|fuller|firmer|perkier|toned|improv(?:e|es|ed|ement|ements)|enhanc(?:e|es|ed|ement|ements)|lifts?|lifting|firms?|firmed|tightens?|tightened|refreshes?|refreshed)\b/i.test(
              normalized
            );
          const hasCosmeticContext =
            /\b(?:breasts?|chest|appearance|contour|skin|firmness|fullness|shape|tone|texture|results?|outcomes?|changes?|improvements?|lift|lifting effect)\b/i.test(
              normalized
            );
          return hasOutcomeLanguage && hasCosmeticContext;
        });
      },
    },
    fixtures: [
      "Our PRP care is tailored for natural-looking outcomes.",
      "Ask whether a modest cosmetic improvement is achievable.",
      "A visible lift may occur.",
      "The treatment can improve breast appearance.",
      "The service can create fuller-looking breasts.",
      "Expect firmer, perkier breasts.",
      "A lifted appearance is possible.",
      "A subtle lift may occur.",
      "The procedure may make the breasts look more youthful.",
      "The procedure can create a more youthful appearance.",
      "Patients may notice a gentle lifting effect.",
      "This can leave the breasts looking younger.",
      "A youthful appearance is possible.",
      "The treatment enhances breast contour.",
      "PRP improves breast firmness.",
      "Patients get a more lifted contour.",
      "PRP may help the chest look more toned.",
      "No result is guaranteed, but the procedure can improve breast contour.",
    ],
    allowedFixtures: [
      "Any cosmetic change, if one occurs, is uncertain.",
      "Published evidence does not establish a cosmetic benefit.",
      "A natural-looking result is not established.",
      "No subtle lift or youthful appearance is promised.",
      "A subtle lift has not been demonstrated.",
      "Evidence is insufficient to conclude that the breasts become firmer.",
    ],
  },
  {
    name: "provider protocol or sequence assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment) || /\bask\b/i.test(segment)) return false;
          return (
            /\b(?:appointment|visit|service|procedure)\b.{0,80}\b(?:begins?|starts?|ends?|consists?|follow-up review|preparation)\b/i.test(segment) ||
            /\b(?:begins?|starts?|ends?|consists?)\b.{0,80}\b(?:appointment|visit|service|procedure)\b/i.test(segment)
          );
        });
      },
    },
    fixtures: [
      "The appointment begins with preparation and ends with a follow-up review.",
      "The visit starts with a review and includes treatment preparation.",
      "This service consists of preparation, treatment, and follow-up.",
    ],
    allowedFixtures: [
      "The current sequence is not documented in verified project sources.",
      "Ask the clinic what happens during the service.",
      "Does the visit include a follow-up review?",
    ],
  },
  {
    name: "candidacy or eligibility assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) return false;
          if (/\b(?:cannot|can't|does not|doesn't)\b.{0,60}\b(?:right for|eligible|candidate|suitable|appropriate)\b/i.test(segment)) return false;
          return /\b(?:ideal candidate|good candidate|eligible|suitable|appropriate for|right for|fits? your goals?|healthy adults?)\b/i.test(segment);
        });
      },
    },
    fixtures: [
      "This service is appropriate for healthy adults who want a nonsurgical option.",
      "You are eligible if you are in good health.",
      "Jenny confirms whether the treatment fits your goals.",
    ],
    allowedFixtures: [
      "This page cannot decide whether the service is right for you.",
      "Ask whether you are eligible before purchasing.",
      "No candidacy criteria are documented here.",
    ],
  },
  {
    name: "downtime or recovery assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) return false;
          return /\b(?:no downtime|little downtime|minimal downtime|return|resume)\b.{0,80}\b(?:normal activit|work|same day|next day)\b|\brecovery\b.{0,50}\b(?:takes?|lasts?|days?|hours?|quick|short)\b/i.test(segment);
        });
      },
    },
    fixtures: [
      "Most patients return to normal activity the same day.",
      "There is little downtime and you can resume work the next day.",
      "Recovery takes about two days.",
    ],
    allowedFixtures: [
      "This page does not document downtime or recovery.",
      "Ask the clinic whether you can return to work the same day.",
    ],
  },
  {
    name: "aftercare instruction assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) return false;
          return /\b(?:avoid|refrain from|do not|don't)\b.{0,80}\b(?:exercise|activity|sun|heat|water|alcohol|medication|hours?|days?)\b|\baftercare\b.{0,60}\b(?:requires?|includes?|involves?|instructions? are)\b/i.test(segment);
        });
      },
    },
    fixtures: [
      "Avoid strenuous exercise for 24 hours after the visit.",
      "Aftercare requires keeping the area dry for one day.",
    ],
    allowedFixtures: [
      "This page does not document aftercare instructions.",
      "Ask whether you should avoid exercise after the visit.",
    ],
  },
  {
    name: "risk or side-effect assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) return false;
          return /\b(?:soreness|tenderness|swelling|bruising|irritation|redness|infection|bleeding|pain)\b/i.test(segment);
        });
      },
    },
    fixtures: [
      "Temporary swelling and bruising can occur.",
      "Common side effects include soreness, redness, and irritation.",
    ],
    allowedFixtures: [
      "This page does not establish whether swelling or bruising can occur.",
      "Ask whether pain or redness can occur.",
    ],
  },
  {
    name: "result duration or guarantee assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) return false;
          return /\b(?:results?|effects?|improvements?|changes?)\b.{0,80}\b(?:lasts?|lasting|months?|years?|permanent|guaranteed|expected)\b|\bguarantee(?:d|s)?\b.{0,50}\b(?:result|outcome|change)\b/i.test(segment);
        });
      },
    },
    fixtures: [
      "Results typically last 12 months.",
      "A visible change is expected within six weeks.",
      "The clinic guarantees a cosmetic result.",
    ],
    allowedFixtures: [
      "This page does not promise a result, timeline, or duration.",
      "Ask whether the clinic guarantees any result.",
    ],
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
  assertSourceContract("PRP Breast Lift owner data", ownerDataSource, "fe8ba06d588fe66bf1a922fee51f3e0df3368bf8e47c8df1a2645cd3a06ea37d");
  assertSourceContract("PRP Breast Lift route copy", routeOwnerSource, "300174bac9ca3e131b611f663dfb530332159a8abe8fa1f810267148eeda758c");
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
      "Compare the PRP Breast Lift service in Williamsburg, VA with surgical options, review the $1,800 one-visit price, and request current service details.",
    h1: "PRP Breast Lift in Williamsburg, VA",
    required: [
      "What a PRP Breast Lift can and cannot do",
      "does not document the clinic's current method",
      "does not promise a cosmetic result",
      "mastopexy, implants, or fat transfer",
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
      "Published medical literature describes different PRP preparations",
      "Published evidence for cosmetic breast benefits is limited",
      "Confirm candidacy first",
      "qualified clinician reviewing candidacy",
      "screening or imaging history",
      "tenderness, swelling, bruising",
      "method-specific risk information applies",
    ],
    requiredHtml: [/href=["']\/consult\?procedure=prp-breast-lift&amp;utm_source=website&amp;utm_medium=procedure_page&amp;utm_campaign=prp_breast_lift["']/],
    requiredConsultHref:
      "/consult?procedure=prp-breast-lift&utm_source=website&utm_medium=procedure_page&utm_campaign=prp_breast_lift",
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
