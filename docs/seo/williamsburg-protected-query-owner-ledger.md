# Williamsburg Med Spa protected query-owner ledger

Updated: 2026-07-20
Status: active measurement contract
Source change: [PR #68](https://github.com/buildleansaas/ubuntumedspa/pull/68)
Merge commit: `0235140bd43c2f29606299cf1bf9bb924d28e19f`
Merged: 2026-07-15 20:19:45 UTC
Canonical host: `www.williamsburgmedspa.com`

## Purpose

This ledger prevents a growth edit from accidentally displacing a page that already owns valuable Williamsburg-area search demand. It separates:

- the page Google currently rewards,
- the page we may eventually prefer as the long-term destination,
- the exact query cohort being protected,
- the measurement windows required before another mutation.

The CSV beside this file is the machine-readable owner ledger:

- `docs/seo/williamsburg-protected-query-owner-ledger.csv`

## Evidence basis

Fresh live collection completed 2026-07-20 at `2026-07-20T16:04:42Z`.

- GSC current 28-day window: 2026-06-20 through 2026-07-17
- GSC previous 28-day window: 2026-05-23 through 2026-06-19
- Sitewide current result: 61 clicks, 5,163 impressions, 1.18% CTR, average position 26.17
- Sitewide previous result: 56 clicks, 3,762 impressions, 1.49% CTR, average position 27.85
- URL Inspection: 12 canonical `www` URLs inspected
- Canonical result: 11 `PASS / Submitted and indexed`; `/blog` is `URL is unknown to Google`
- Apex host behavior: expected `308` redirect to the `www` canonical host

This ledger uses GSC owner-page rows, not generic title-length scoring or raw-source guesses.

## Owner decisions

### Local medical-spa category

Protected observed owner: `https://www.williamsburgmedspa.com/`

Exact protected queries:

- `medical spa williamsburg`
- `med spa williamsburg va`
- `med spa williamsburg`
- `williamsburg med spa`

Current 28-day evidence:

- `medical spa williamsburg`: homepage 877 impressions, 0 clicks, 0% CTR, position 3.19
- `med spa williamsburg va`: homepage 110 impressions, 2 clicks, 1.82% CTR, position 4.11
- `med spa williamsburg`: homepage 76 impressions, 1 click, 1.32% CTR, position 6.74
- `williamsburg med spa`: homepage 34 impressions, 3 clicks, 8.82% CTR, position 2.24

Decision:

- Preserve the homepage as the category owner.
- Do not hand the broad category cluster to `/locations/williamsburg-va`.
- Do not run a homepage title/H1 rewrite until the PR #68 measurement checkpoints settle and a current localized SERP/snippet check demonstrates a reproducible CTR defect.

### Williamsburg Botox

Protected observed owner: `https://www.williamsburgmedspa.com/`
Preferred long-term service destination: `https://www.williamsburgmedspa.com/procedures/botox`

Exact protected queries:

- `botox williamsburg`
- `botox williamsburg va`

Current 28-day evidence:

- `botox williamsburg`: homepage 159 impressions, 1 click, 0.63% CTR, position 19.40
- `botox williamsburg va`: homepage 31 impressions, 0 clicks, position 14.81

Decision:

- The homepage remains the protected current owner.
- A future transfer to `/procedures/botox` must be a separate, reversible internal-link/intent test.
- Do not remove Botox language from the homepage to force ownership.
- Measure both URLs on every checkpoint.

### Williamsburg dermal fillers

Protected observed owner: `https://www.williamsburgmedspa.com/`
Preferred long-term service destination: `https://www.williamsburgmedspa.com/procedures/filler`

Exact protected queries:

- `dermal fillers williamsburg`
- `dermal fillers williamsburg va`

Current 28-day evidence:

- `dermal fillers williamsburg`: homepage 34 impressions, 0 clicks, position 20.26
- `dermal fillers williamsburg va`: homepage 33 impressions, 0 clicks, position 11.18
- The filler procedure page also appears, but it has not displaced the homepage as the observed primary owner.

Decision:

- Protect the homepage's current visibility.
- Preserve `/procedures/filler` as the preferred destination for a future measured transfer.
- Do not broadly rewrite both surfaces in the same slice.

### Williamsburg medical ear piercing

Protected and intended owner: `https://www.williamsburgmedspa.com/procedures/blomdahl-ear-piercing`

Exact protected queries:

- `ear piercing williamsburg va`
- `piercing williamsburg va`
- `ear piercing near me`

Current 28-day evidence:

- `ear piercing williamsburg va`: 50 impressions, 2 clicks, 4.0% CTR, position 6.06
- `piercing williamsburg va`: 35 impressions, 2 clicks, 5.71% CTR, position 9.11
- `ear piercing near me`: 10 impressions, 0 clicks, position 5.0

Decision:

- This is a protected page-one near-win.
- Any improvement must be surgical and must preserve the current procedure URL, local-intent language, provider proof, and exact canonical.
- Do not create a second Williamsburg ear-piercing owner.

### Newport News service demand

Protected and intended current owner: `https://www.williamsburgmedspa.com/locations/newport-news-va`

Exact protected queries:

- `med spa newport news`
- `botox newport news`
- `botox newport news va`
- `dermal fillers newport news`
- `dermal fillers newport news va`

Current 28-day evidence:

- `med spa newport news`: 36 impressions, 0 clicks, position 14.67
- `botox newport news`: 82 impressions, 0 clicks, position 13.66
- `botox newport news va`: 20 impressions, 0 clicks, position 17.05
- `dermal fillers newport news`: 25 impressions, 0 clicks, position 10.08
- `dermal fillers newport news va`: 20 impressions, 0 clicks, position 11.15

Decision:

- Protect the location page as the observed owner during the PR #68 hold.
- Near-service child URLs may remain useful destinations, but do not force a transfer while the location page is already in striking distance.
- Newport News is the strongest candidate for a future surgical growth slice after the checkpoint gate.

## Canonical and indexation truth set

The following canonical URLs returned `PASS / Submitted and indexed` on 2026-07-20:

- `/`
- `/procedures/blomdahl-ear-piercing`
- `/procedures/prp-breast-lift`
- `/locations/newport-news-va`
- `/procedures/filler`
- `/locations/james-city-county-va`
- `/procedures/joint-restoration`
- `/procedures/prp-facial`
- `/procedures/prp-hair-restoration`
- `/consult`
- `/blog/coolsculpting-alternatives-in-williamsburg-va`

Open indexing candidate:

- `/blog`: `NEUTRAL / URL is unknown to Google`

The blog-hub result is a real canonical inspection finding. It is not the earlier apex/non-`www` false positive. Investigate its discovery, internal-link, utility, and index-worthiness before requesting indexing or changing metadata.

## PR #68 checkpoint contract

Deployment day `2026-07-15` is excluded because the merge occurred at 20:19 UTC.

### D7

- Fixed baseline: 2026-07-08 through 2026-07-14
- Post-change window: 2026-07-16 through 2026-07-22
- Earliest scored run after three-day GSC lag: 2026-07-26

### D14

- Fixed baseline: 2026-07-01 through 2026-07-14
- Post-change window: 2026-07-16 through 2026-07-29
- Earliest scored run after three-day GSC lag: 2026-08-02

### D28

- Fixed baseline: 2026-06-17 through 2026-07-14
- Post-change window: 2026-07-16 through 2026-08-12
- Earliest scored run after three-day GSC lag: 2026-08-16

Baseline cohort totals across the 16 exact protected queries and all observed pages:

- D7 baseline: 5 clicks, 555 impressions, 0.90% CTR
- D14 baseline: 8 clicks, 1,004 impressions, 0.80% CTR
- D28 baseline: 13 clicks, 2,643 impressions, 0.49% CTR

Each checkpoint must also retain page/query rows. Aggregate cohort movement alone cannot prove that the intended owner remained stable.

## Decision gates

Classify each checkpoint as one of:

- `keep measuring`
- `gate passed for separate test`
- `revise`
- `rollback candidate`

Open a rollback review if any of the following occurs with comparable evidence:

- A protected query loses more than three average positions with at least 50 impressions.
- Protected clicks decline more than 25% while impressions remain reasonably stable.
- Google moves the query to a less relevant URL.
- A live route loses its `200`, self-canonical, sitemap membership, indexability, H1, or intended local/service language.

Do not label a no-row or incomplete-lag checkpoint as a loss. Report it as `not scored; re-run after final data arrives`.

## Mutation policy

Before another SEO mutation:

1. Read this ledger and the CSV.
2. Check current owner and all plausible competing URLs.
3. Confirm the target is not still inside a PR #68 measurement hold.
4. Pull fresh page/query GSC rows.
5. Run a localized SERP/snippet check for the exact candidate query.
6. Change one owner surface in one focused PR.
7. Preserve current winning phrases and customer-facing clarity.
8. Verify source, rendered preview, production, canonical, sitemap, structured data, and mobile view.
9. Schedule a new lag-adjusted D7/D14/D28 contract for that slice.

## Current next-slice verdict

No customer-facing page mutation is approved before the PR #68 D7 checkpoint.

Operational work that may proceed during the hold:

- Correct URL Inspection collection and regression coverage, completed in `buildleansaas/obsidian-vault` PR #176.
- Investigate `/blog` discovery/index-worthiness without changing protected owner pages.
- Reconcile stale PRs so they cannot overwrite current-main ownership decisions.
- Collect live SERP and competitor evidence for Newport News without publishing changes.
