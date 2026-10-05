# Dermal filler owner-transfer slice

Date: 2026-09-29
Owner URL: `https://www.williamsburgmedspa.com/procedures/filler`
Parent sequence: James City County owner page, PR #75 (production D7 gate passed 2026-09-28)

## Release state

Draft prepared for independent exact-SHA review only. This slice must not merge until that review passes all checks and the immediately preceding production gate remains clean. PRP Facial remains fact-gated and is untouched by this slice.

## Eligibility evidence (live GSC API, dataState=final)

Property: `sc-domain:williamsburgmedspa.com`. Latest complete row 2026-09-27. Fixed windows: 2026-08-31 through 2026-09-27 vs previous 2026-08-03 through 2026-08-30.

- `dermal fillers williamsburg`: homepage 26 impressions, position 8.54, 0 clicks (prev 35 @ 24.60). `/procedures/filler` 19 impressions @ 28.79 (prev 34 @ 23.18).
- `dermal fillers williamsburg va`: homepage 25 impressions, position 9.64, 0 clicks (prev 26 @ 12.58). `/procedures/filler` 19 impressions @ 52.37 (prev 25 @ 46.44).
- `/procedures/filler` page totals: 3 clicks / 171 impressions / 1.75% CTR / position 35.5 (prev 2 clicks / 200 impressions / position 48.34), including `lip filler(s) near me` clicks at positions 5.71-6.25.
- URL Inspection (2026-09-29): `/procedures/filler` PASS / Submitted and indexed / INDEXING_ALLOWED / lastCrawl 2026-09-21. `/procedures/filler/near/williamsburg-va` NEUTRAL / Discovered - currently not indexed (pre-existing watch item; not mutated by this slice).
- Gates satisfied: PR #68 D28 GATE PASSED FOR SEPARATE TEST (2026-08-29) and PR #75 production D7 GATE PASSED (2026-09-28, data through 2026-09-25).

The homepage owns both protected filler queries at page-one positions with zero clicks, while the indexed destination page already earns clicks and impressions. This is the ledger's planned measured transfer test: strengthen the destination page only.

## Preserved wins (regression contracts)

- Homepage title keeps "Fillers"; homepage keeps the descriptive "Fillers in Williamsburg" link to `/procedures/filler`.
- No homepage, locations, blog, near-page, or treatment-owner metadata edits in this slice.

## Focused mutation

1. Add an early decision section to `/procedures/filler`: fit guidance, wrinkle-relaxer contrast, careful-screening areas, visit flow, and the syringe-count pricing reality.
2. Replace the generic consultation path with an attributed, preselected filler consultation path (`utm_campaign=dermal_filler`).
3. Add deterministic title/H1/owner-copy/consult-attribution/offer/schema contracts plus homepage preserved-win contracts to `scripts/verify-seo.mjs` (added before the implementation; RED confirmed against live production, which serves unmodified `origin/main`).

## Claims boundary

- No invented protocol, results, longevity promises, or guarantee language. Every new sentence is grounded in the existing filler page FAQs, the catalog pricing ($700 per syringe, 1-10 syringes), the near-page consult note, or the Newport News Botox-vs-filler decision answer.
- Filler quantity checkout is intentionally untouched (no one-treatment constraint).
- Conservative wording retained: longevity varies; results are not permanent; screening-first areas named; no downtime-free or safety-free claims.

## Verification required before review-ready

- `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm exec tsc --noEmit`, `rm -rf .next && pnpm build`, `git diff --check`
- `pnpm verify:seo` against a production-mode local server
- Vercel preview: HTTP/title/description/H1/canonical/schema/owner links/no failed images/no console errors
- Desktop screenshot QA and true 390px CDP metrics + screenshot
- Consult route keeps `procedure=filler` preselection and campaign attribution

## Measurement plan (after merge)

- D0 = merge day (excluded from post windows); first complete exposure day is D0+1.
- Fixed equal 7-day baseline ending on the merge day; lag-adjusted D7/D14/D28 scored runs as established for PRs #73-#75.
- Owner to score: `https://www.williamsburgmedspa.com/procedures/filler`; protected queries `dermal fillers williamsburg`, `dermal fillers williamsburg va`; protected winners: homepage broad cluster, Botox, Blomdahl piercing, PRP hair restoration, PRP breast lift, Newport News, James City County.
