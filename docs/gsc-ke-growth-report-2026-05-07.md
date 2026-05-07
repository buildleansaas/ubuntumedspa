# GSC + Keywords Everywhere Growth Report - 2026-05-07

## Executive Summary

Google is showing Williamsburg Med Spa much more often, but the site is not converting those impressions into clicks yet.

The last 7 days in Google Search Console had 2,416 impressions versus 981 impressions in the prior 7 days. Clicks only moved from 12 to 16. The spike is almost entirely the homepage ranking around position 4 for `medical spa williamsburg` with 0 clicks.

## What Changed In GSC

Date windows:

- Recent: 2026-04-30 through 2026-05-06
- Previous: 2026-04-23 through 2026-04-29

Recent top growth:

- `medical spa williamsburg`: 1,779 impressions, 0 clicks, average position 4.0
- Homepage: 2,160 impressions, 8 clicks, average position 6.6
- `medspa williamsburg va`: 19 impressions, 0 clicks, average position 3.8
- `botox williamsburg va`: 19 impressions, 0 clicks, average position 12.7
- `ear piercing williamsburg va`: 6 impressions, 1 click, average position 10.3

28-day near wins:

- `medical spa williamsburg`: 2,298 impressions, 0 clicks, average position 4.3
- `med spa williamsburg va`: 144 impressions, 4 clicks, average position 5.9
- `medspa williamsburg`: 72 impressions, 2 clicks, average position 6.0
- `dermal fillers williamsburg va`: 46 impressions, 0 clicks, average position 16.1
- `botox williamsburg va`: 41 impressions, 1 click, average position 12.3
- `ear piercing williamsburg va`: 24 impressions, 1 click, average position 9.3
- `piercing williamsburg va`: 23 impressions, 0 clicks, average position 2.8

## Keywords Everywhere Validation

Targeted KE enrichment confirmed these are worth optimizing:

- `med spa williamsburg va`: 110/mo, CPC $2.68
- `medspa williamsburg`: 70/mo, CPC $4.03
- `med spa williamsburg`: 50/mo, CPC $2.73
- `botox williamsburg va`: 590/mo, CPC $5.10
- `hydrafacial williamsburg va`: 30/mo
- `ear piercing williamsburg`: 90/mo, CPC $0.78
- `ear piercing williamsburg va`: 50/mo, CPC $1.12
- `pediatric ear piercing`: 1,600/mo, CPC $1.11
- `pediatric ear piercing near me`: 1,000/mo, CPC $0.94
- `blomdahl ear piercing`: 260/mo, CPC $4.41
- `hypoallergenic ear piercing`: 590/mo
- `medical grade ear piercing`: 40/mo, CPC $1.64
- `ear piercing aftercare`: 12,100/mo
- `ear piercing cost`: 2,900/mo

## Indexing Findings

URL Inspection checked a targeted set of priority URLs.

Indexed:

- `/`
- `/procedures/blomdahl-ear-piercing`
- `/locations/james-city-county-va`
- `/procedures/filler`
- `/procedures/prp-hair-restoration`

Discovered but not indexed:

- `/locations/williamsburg-va`
- `/locations/yorktown-va`
- `/locations/newport-news-va`
- `/blog/medical-ear-piercing-in-williamsburg-va-blomdahl`

Unknown to Google because the corrected local branch is not deployed yet:

- `/procedures/blomdahl-ear-piercing`
- `/procedures/blomdahl-ear-piercing/near/williamsburg-va`
- `/procedures/blomdahl-ear-piercing/for/children`

Production notes:

- The old misspelled `/procedures/blomdahl-ear-piercing` URL is live and indexed.
- The corrected `/procedures/blomdahl-ear-piercing` URL is 404 on production until this branch deploys.
- `https://williamsburgmedspa.com/` redirects to `https://www.williamsburgmedspa.com/`.
- `/affiliates` is still live on production until this branch deploys the redirect.

## What Google Is Signaling

Google is testing the site for broad local med spa intent. The homepage is visible, but the snippet or result presentation is not earning clicks for `medical spa williamsburg`.

Google is also finding ear-piercing intent, but production still has the brand misspelled as Blomdahl. The corrected Blomdahl hub and local pages need to deploy before Google can index the improved architecture.

Several location pages are discovered but not indexed, which usually means Google found them but does not yet see enough unique value, internal prominence, or crawl priority to include them.

## Recommended Action Queue

Already implemented locally in this branch:

- Homepage title/meta tightened around `Medical Spa Williamsburg, VA`.
- Homepage hero copy now names Xeomin, fillers, PRP, hyperhidrosis, and Blomdahl ear piercing.
- Homepage internal links now route high-intent services to their own pages.
- Williamsburg location page has stronger service-specific local copy.
- Yorktown and Newport News location pages now include unique ear-piercing copy and direct local ear-piercing links.
- Blomdahl spelling correction, redirects, hub improvements, local ear-piercing pages, and intent pages are ready locally.

Next after deploy:

- Request indexing for the corrected Blomdahl hub, children page, sensitive ears page, re-piercing page, and top local ear-piercing pages.
- Request indexing for Williamsburg, Yorktown, and Newport News location pages after deploy.
- Re-run URL Inspection for all sitemap URLs with a timeout-safe batch script.
- Watch CTR for `medical spa williamsburg` over the next 7-14 days.
- If CTR remains below 2%, test another homepage title/meta variant.

## CTR Test Hypothesis

Current issue:

- Position 4 for `medical spa williamsburg`
- 0 clicks on 1,779 recent impressions

Likely causes:

- Search result may not clearly match the exact query.
- Competing results may look more local, review-heavy, or service-specific.
- Homepage may be ranking, but snippets may be too broad or PRP-heavy.

Local implementation response:

- Lead the homepage metadata and H1 with `Medical Spa in Williamsburg, VA`.
- Mention common searched services directly.
- Add internal service paths so Google can route Botox, filler, and ear-piercing intent to stronger pages.
- Strengthen location pages and internal links so nearby-area pages are less likely to stay discovered-not-indexed.
