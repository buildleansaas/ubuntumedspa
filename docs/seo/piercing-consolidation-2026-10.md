# Ear Piercing Consolidation + Infant Owner Page

Date: 2026-10-03

## Why

URL Inspection on 2026-09-30 found only 29 of 90 sitemap URLs indexed (48 "Discovered – currently not indexed", 6 unknown, 5 "Crawled – currently not indexed"). The unindexed set included most ear piercing support posts and `/procedures/botox`. Two piercing pages (`/for/children`, `/near/fords-colony-va`) had a Google-selected canonical of an unrelated gambling domain. The site had many near-duplicate template pages for its size, so Google stopped crawling the rest.

Goal: one strong owner page per intent, and fewer, stronger URLs (90 → 49 in the sitemap).

## Owners after this change

| Intent | Owner |
|---|---|
| Ear piercing Williamsburg (protected) | `/procedures/blomdahl-ear-piercing` |
| Infant / baby / kids ear piercing | `/procedures/blomdahl-ear-piercing/for/children` |
| Sensitive ears | `/procedures/blomdahl-ear-piercing/for/sensitive-ears` |
| Re-piercing | `/procedures/blomdahl-ear-piercing/for/re-piercing` |
| Local piercing | `/near/williamsburg-va`, `/near/yorktown-va`, `/near/newport-news-va` |
| Support articles | aftercare, medical vs mall, Medical Plastic vs titanium |

## Redirects (301/308, in `next.config.mjs`)

- 3 kids/baby posts and the unpublished `/for/babies` draft → `/for/children` (content merged).
- 2 duplicate Blomdahl posts and the cost post → main piercing page.
- Hypoallergenic post → `/for/sensitive-ears`; re-piercing post → `/for/re-piercing`.
- 7 piercing `/near/` pages (James City County, Toano, Norge, Lightfoot, New Town, Kingsmill, Ford's Colony) → `/near/williamsburg-va`.
- 6 `/locations/` neighborhood pages → `/locations/williamsburg-va`.
- Botox, filler, Xeomin `/near/williamsburg-va` → parent service pages (they duplicated the parent titles).
- All `/procedures/{botox,filler,o-shot,hyperhidrosis-treatment}/for/*` condition pages → parent service pages. The condition cards still show on the parent pages without links. The legacy feminine-intimacy redirects now go straight to `/procedures/o-shot`, so there are no two-hop chains.
- 4 old PRP posts → matching PRP service pages or `/procedures`.

The `[slug]/for/[ailmentSlug]` and `[slug]/near/[areaSlug]` routes and their data stay in the repo but are unreachable because the redirects run first. Restore a page by removing its redirect and adding it back to the sitemap.

## On-page changes

- Main piercing page: title now includes "Infant, Kids & Adults" (H1 and the protected "Ear Piercing in Williamsburg, VA" phrase are unchanged). Adds an infant section, a tracked call button in the hero, and an updated age FAQ.
- `/for/children`: rewritten as the infant, baby & kids owner, with age guidance, visit steps, aftercare, pricing, a call button, and 6 FAQs.
- The header tagline `<h2>` is now a `<p>`, so the first heading on every page is no longer "Restorative Wellness & Natural Healing".
- Blog card titles are `<h3>` under each section's `<h2>`.
- New `service_page` phone-click location for GA4.
- The James City County hub's piercing link now points to the main piercing owner. `scripts/verify-seo.mjs` checks that link, a sample of the redirects, and the children page.

## Needs Jenny before merge

The infant copy says Jenny generally pierces babies at 6 months or older with pediatrician guidance. The retired baby blog said this publicly, but the main page FAQ previously avoided stating an age. Jenny confirms the minimum age, the visit steps, and the aftercare wording on `/for/children`.

## After deploy

1. Resubmit `https://www.williamsburgmedspa.com/sitemap.xml` in Search Console.
2. URL Inspection → Request indexing for the main piercing page, `/for/children`, the aftercare post, and the medical-vs-mall post.
3. Check `/for/children` again in about a week. Google's chosen canonical should be its own URL.
4. Measure at D14/D28 against the 2026-09-30 baseline: Sept 1–28 had 87 clicks and 8.9k impressions. The piercing page gets about 16 clicks/month at position ~9. 29 URLs were indexed.
