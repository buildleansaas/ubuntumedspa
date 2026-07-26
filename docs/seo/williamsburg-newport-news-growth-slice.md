# Newport News Growth Slice: Execution and Measurement Plan

Date: 2026-07-20

Owner URL: `https://www.williamsburgmedspa.com/locations/newport-news-va`

Foundation: production PR #68 and protected-query ledger PR #69

## Objective

Move the existing Newport News service-area owner from page-two visibility toward page-one clicks without creating a competing URL or weakening current Williamsburg, Botox, filler, or ear-piercing owners.

The page must help a Newport News visitor quickly answer three questions:

1. Does Williamsburg Med Spa serve patients coming from Newport News?
2. Should they start with Botox/Xeomin, dermal filler, PRP, or medical ear piercing?
3. What is the practical next step for an appointment at the Williamsburg clinic?

## Evidence baseline

Source: corrected 2026-07-20 SEO deep audit, latest complete 28-day GSC window.

### Owner page

| Metric | Current 28d | Previous 28d | Change |
|---|---:|---:|---:|
| Clicks | 2 | 0 | +2 |
| Impressions | 672 | 289 | +383 |
| CTR | 0.30% | 0.00% | +0.30 pp |
| Average position | 18.96 | 30.81 | +11.86 positions |

### Primary Newport News queries

| Query | Clicks | Impressions | CTR | Current position | Previous position |
|---|---:|---:|---:|---:|---:|
| `botox newport news` | 0 | 82 | 0.00% | 13.66 | 30.38 |
| `med spa newport news` | 0 | 36 | 0.00% | 14.67 | 20.03 |
| `dermal fillers newport news` | 0 | 25 | 0.00% | 10.08 | 25.14 |
| `dermal fillers newport news va` | 0 | 20 | 0.00% | 11.15 | 16.20 |
| `botox newport news va` | 0 | 20 | 0.00% | 17.05 | 16.25 |
| `newport news botox` | 0 | 8 | 0.00% | 17.25 | no prior impressions |
| `prp newport news` | 0 | 3 | 0.00% | 14.00 | no prior impressions |
| `ear piercing newport news` | 0 | 2 | 0.00% | 13.50 | 11.00 |

The page is currently submitted and indexed. Google-selected and user-declared canonicals both match the canonical `www` URL. Fetch, robots, and indexing states pass.

## Why this owner and not a new page

- Google already recognizes this URL for the intended Newport News cluster.
- The page gained 383 impressions and improved from position 30.81 to 18.96 in the latest comparison.
- Botox, filler, and med-spa phrases are already within striking distance of page one.
- A new Newport News Botox or filler page would risk splitting an emerging owner and competing with existing procedure owners.
- The existing page can be improved surgically while preserving the URL and established query mapping.

## Mutation boundary

### Allowed in this slice

- Rewrite public copy that exposes internal SEO rationale instead of patient value.
- Add a direct patient-facing Botox/Xeomin versus dermal-filler decision section.
- Add one early appointment CTA and preserve the final decision CTA.
- Add concise visible FAQs that answer service-area, travel, treatment-selection, and consultation questions.
- Add matching FAQ structured data.
- Strengthen direct links to the existing Botox, filler, PRP, medical ear-piercing, consultation, location, and directions owners.
- Extend automated SEO verification for the Newport News route.
- Pin preview-environment canonicals to the production `www` origin in `src/lib/seo.ts` so preview QA verifies the URL Google should index. This does not change production output.

### Explicitly frozen

- URL and route path.
- Canonical URL.
- Current title tag.
- Current meta description.
- Current H1.
- Homepage title/H1/copy.
- Procedure-page title/H1/canonical ownership.
- Blomdahl near-Newport-News route.
- Global navigation and footer.
- New location or procedure URLs.
- Claims that the clinic is physically located in Newport News.
- Unsupported testimonials, ratings, outcomes, prices, credentials, or travel times.

## Customer-facing changes

### 1. Replace operator-facing “Quick read” language

Remove phrases such as “Popular searches” and “Easy internal links.” Replace them with patient-useful labels:

- Best for
- Common goals
- Visit location

### 2. Add one early action

After the opening explanation, provide a single direct consultation action for a visitor who is already ready. Keep treatment exploration as a text link, not a competing large CTA.

### 3. Add a Botox/Xeomin versus dermal-filler decision section

Explain plainly:

- Botox/Xeomin: movement-related expression lines.
- Dermal filler: volume, contour, and facial balance.
- Some visitors may discuss both, but the consultation determines the appropriate plan.

Use second-person patient language and direct links to the existing procedure owners.

### 4. Repair “Why make the trip?”

Replace internal-site rationale with visit value:

- Provider-led consultation before treatment.
- Conservative, natural-looking planning.
- Clear aftercare and follow-up.

### 5. Add visible FAQs plus matching schema

Questions:

1. Does Williamsburg Med Spa serve patients from Newport News?
2. How do I choose between Botox/Xeomin and dermal filler?
3. Where is the appointment located?
4. Can I book a consultation before choosing a treatment?

The visible answers and JSON-LD answers must match exactly.

## Commit-by-commit execution

### Commit 1: Add failing Newport News SEO contracts

Files:

- `scripts/verify-seo.mjs`

Checks:

- Newport News route remains in the sitemap.
- Canonical page directly links to Botox, filler, PRP, medical ear piercing, consult, and Williamsburg location owners.
- Public copy does not contain the known operator-facing labels.
- Visible treatment-choice answer exists.
- FAQ JSON-LD exists without duplicate questions.

Expected pre-implementation result: targeted SEO verification fails on the missing patient-choice/FAQ contract and operator-facing labels.

### Commit 2: Implement the focused page improvement and preview-canonical correction

Files:

- `src/app/locations/newport-news-va/page.tsx`
- `src/lib/seo.ts`

No other customer-facing production route may change. The shared helper correction is limited to removing preview-host canonical generation; production already uses the same `www` origin.

### Commit 3: Verification and plan receipt

Files:

- `docs/seo/williamsburg-newport-news-growth-slice.md`

Required checks:

- `pnpm lint`
- `pnpm build`
- local server smoke
- `pnpm verify:seo`
- source diff review
- rendered desktop browser QA
- rendered representative mobile-width QA
- title, meta description, H1, canonical, status, sitemap, JSON-LD, and internal-link readback
- Vercel preview smoke

## Release gate

Implementation may be prepared and reviewed in a draft PR immediately. Production merge stays held until the lag-adjusted PR #68 D7 checkpoint is trustworthy on 2026-07-26.

Merge only if all are true:

1. D7 checkpoint does not show a protected-owner rollback condition.
2. PR scope is limited to this owner page, SEO verification, this plan, and the two-line preview-canonical helper correction documented above.
3. Preview desktop and mobile QA pass.
4. CI and Vercel preview checks pass.
5. Metadata, H1, URL, and canonical remain unchanged.
6. No query-owner conflict is introduced.

If D7 reports `REVISE` or `ROLLBACK CANDIDATE`, keep the PR unmerged and resolve PR #68 ownership first.

## Post-release verification

Immediately after merge/deploy:

- Production route returns 200.
- Canonical remains the exact `www` owner.
- Title, meta description, and H1 match the frozen values.
- FAQ content and FAQPage schema match.
- Direct internal owner links return 200.
- Sitemap retains the route.
- Desktop and mobile first-screen comprehension pass.

## Measurement windows

Use fixed, lag-adjusted GSC comparisons. Do not reopen the page between checkpoints unless live QA finds a real defect.

### D7

- Confirm page remains indexed.
- Confirm intended Newport News terms remain owned by this URL.
- Record clicks, impressions, CTR, and position for the owner page and primary query cluster.
- Do not call a result from partial GSC data.

### D14

- Look for preserved or increased qualified impressions.
- Look for first-click emergence on exact Newport News terms.
- Check whether dermal-filler terms stabilize on page one and Botox/med-spa terms move toward page one.

### D28

Primary success signal:

- More qualified nonbrand clicks to this owner without loss of owner stability.

Supporting success signals:

- Page CTR above the 0.30% baseline.
- `dermal fillers newport news` and `dermal fillers newport news va` sustain or improve from positions 10.08 and 11.15.
- `botox newport news` and `med spa newport news` improve from positions 13.66 and 14.67.
- No competing Williamsburg or procedure URL displaces this page for the exact Newport News cluster.

### Revision threshold

Review and revise if a complete window shows any of the following with enough impressions to be meaningful:

- The intended owner loses the exact Newport News cluster to an unintended URL.
- Qualified impressions materially fall while sitewide demand remains stable.
- Average position materially worsens across the primary cluster rather than one low-volume query.
- CTR remains at zero despite sustained page-one visibility.

### Rollback threshold

Treat as a rollback candidate if:

- canonical/indexability breaks;
- title/H1/URL ownership changes outside the frozen boundary;
- the intended owner is displaced across multiple primary queries;
- or a verified rendering/booking defect is introduced.

Rollback is the single focused page commit, not PR #68 or unrelated production work.
