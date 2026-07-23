# Williamsburg Med Spa: Protect Current Wins + 10x Organic Growth Plan

Date: 2026-07-23

Production: https://www.williamsburgmedspa.com

Evidence snapshot: [`evidence/williamsburg-10x-baseline-2026-07-23.json`](./evidence/williamsburg-10x-baseline-2026-07-23.json)

Execution ledger: https://github.com/buildleansaas/ubuntumedspa/issues/71

## Executive decision

The highest-probability route to materially more organic traffic and consultations is not mass page creation. It is a coordinated four-engine program:

1. Protect owner pages that already rank.
2. Win more Williamsburg local-pack exposure.
3. Move high-value commercial pages from positions 8–25 into the click zone.
4. Build focused authority clusters around proven services, then measure successful consultations.

The current 28-day Search Console baseline is 64 clicks, 4,750 property-level impressions, 1.35% CTR, and average position 28.0. A literal 10x target is 640 clicks per 28 days. That is an operating target, not a forecast. The practical model combines approximately five times more qualified visibility with close to twice the current CTR, then verifies whether the added traffic starts consultations and produces successful submissions.

## Evidence status

### Verified

- Search Console property: `sc-domain:williamsburgmedspa.com`.
- Latest complete GSC date: 2026-07-20.
- Current 28 days: 64 clicks and 4,750 impressions.
- Previous 28 days: 53 clicks and 4,351 impressions.
- Bing current 28 days: 7 clicks and 145 impressions, up from 2 clicks and 64 impressions.
- Live sitemap contains 90 URLs and was submitted with zero errors and zero warnings.
- Production crawl passed 90 sitemap URLs, 114 internal paths, and 430 JSON-LD blocks with zero failures.
- GBP address, phone, website, category, and coordinates are present.
- PR #76 repaired the clinic coordinates across schema, maps, and directions.
- PR #77 deployed zero-PII `consult_start`, `consult_submit_success`, and `phone_click` instrumentation.
- Production browser collection was observed for `consult_start` and `phone_click` without form values or PII.

### Not yet trustworthy

- The legacy deep-audit collector duplicated page/query evidence and treated branch-only work as shipped. It must not be used for release decisions until the regression repair and Williamsburg force-run pass.
- GA4 production collection points to measurement ID `G-FBEPLGSS9L`, while the only accessible Ubuntu stream uses `G-Q9LX7K1BRY`. The accessible property contains no report rows. A conversion baseline cannot be claimed until access/ownership is reconciled.
- `/blog` is `Discovered - currently not indexed`. The sitemap is valid and a read-only follow-up is scheduled. Do not mutate the route without a diagnosed crawl/indexing reason.

## Protected query-owner ledger

Every target gets one primary owner. Supporting pages may link to the owner but must not reuse the same local commercial title/H1 intent.

| Intent | Primary owner | Current evidence | Action |
|---|---|---|---|
| medical spa Williamsburg | `/` | Organic #1 in the captured DataForSEO mobile SERP; 576 GSC impressions at position 3.1 with zero recorded clicks | Protect current title/H1/local relevance. Improve snippet, proof, consultation path, and GBP visibility without replacing winning phrases. |
| med spa near me | `/med-spa-near-me` | 8 clicks from 38 impressions | Preserve. Do not create overlapping Williamsburg “near me” pages. |
| Blomdahl/medical ear piercing Williamsburg | `/procedures/blomdahl-medical-ear-piercing` | 15 clicks, 394 impressions, position 9.0; DataForSEO local organic #4 | Protect as the commercial owner. Consolidate duplicate/near-duplicate ear-piercing intent into this owner. |
| filler/dermal filler Williamsburg | `/procedures/filler` | 4 clicks, 267 impressions; local query position 10.6 but page aggregate position 56.3 | Improve the existing owner. Do not create a second generic Williamsburg filler page. |
| Botox Williamsburg | Existing Botox owner page | 204 combined impressions across two exact local variants, zero clicks, positions 18.8 and 24.3 | Commercial recovery candidate after the current release gate. Keep Botox intent on one owner. |
| PRP breast lift | `/procedures/prp-breast-lift` | 3 clicks, 150 impressions; DataForSEO #1 for `prp breast lift near me` | Protect. Expand only from provider-authored protocol, candidacy, price, sequence, and aftercare details. |
| PRP hair restoration | `/procedures/prp-hair-restoration` | 2 clicks, 298 impressions; DataForSEO #1 for local PRP hair term | Protect. Improve candidate/process/consultation clarity from verified service details. |
| Newport News med spa | `/locations/newport-news-va` | 2 clicks, 672 impressions, position 19.5 | PR #70 is the next staged owner release if PR #68 D7 passes. |
| James City County | Existing staged owner in PR #75 | Low current evidence | Keep staged behind Newport News and PRP owners. Do not expand to more localities first. |

## Growth engine 1: local pack and GBP

### Diagnosis

The site has strong organic relevance for core Williamsburg med-spa terms but was absent from the captured Maps results. The observed local leaders have material review proof:

- Colonial Aesthetics & Wellness: 232 reviews.
- Youthful Beginnings Med Spa: 186 reviews.
- Couture Med Spa: 94 reviews.

The clinic’s technical location consistency has been repaired. The remaining local gap is authority, proof, engagement, and category/service completeness.

### Execution

1. Verify the GBP primary and secondary categories against services actually offered.
2. Complete the GBP service list using only verified, currently bookable treatments.
3. Add UTM parameters to the GBP website and appointment links so future GA4 reporting can separate GBP traffic.
4. Establish a client-approved post-appointment review request process.
5. Add authentic provider, treatment-room, exterior, entrance, parking/wayfinding, and service photos on a recurring cadence.
6. Respond to every legitimate review in the client’s voice without repeating private treatment details.
7. Publish one useful GBP update per week tied to an offered service, seasonal question, or verified clinic update.
8. Reconcile priority citations against the verified business name, 3900 Powhatan Parkway address, phone, website, and hours.
9. Measure Maps visibility separately for medical spa, Botox, filler, PRP, and medical ear piercing.

### Client-controlled inputs

- Approval of the exact category/service inventory.
- Authentic photo access.
- A review-request handoff after completed appointments.
- Approval of short GBP post copy before publishing.

No reviews, photos, provider facts, or treatment details may be fabricated.

## Growth engine 2: commercial owner-page recovery

### First commercial recovery candidates

#### Botox

Why it matters:

- `botox williamsburg`: 159 impressions, position 18.8, zero clicks.
- `botox williamsburg va`: 45 impressions, position 24.3, zero clicks.
- `botox near me`: 41 impressions, position 8.0, zero clicks.
- Williamsburg competitors control the captured first organic results.

Focused slice:

- Keep one Botox owner URL.
- Preserve existing indexed URL and canonical.
- Tighten title/meta around verified Williamsburg Botox intent without adding a brand suffix.
- Clarify treatment areas, consultation process, candidacy, pricing approach, timing, and aftercare only from provider-approved source material.
- Add practical internal links from homepage, services, consult, and relevant educational content.
- Verify one H1, one self-canonical, clean schema, sitemap presence, mobile layout, build, preview, and Production.

#### Filler

Why it matters:

- Existing page has 267 impressions and 4 clicks.
- `dermal fillers williamsburg va` is already near page one at position 10.6.
- The site was absent from the first captured local organic results for lip filler.

Focused slice:

- Keep `/procedures/filler` as the owner for generic filler intent.
- Use sections for verified treatment areas instead of immediately creating overlapping owner pages.
- Improve local relevance, consultation expectations, provider proof, and internal links.
- Only create a separate lip-filler owner later if Search Console shows distinct sustained intent that the shared page cannot serve without cannibalization.

### Hold conditions

- No owner-page release while another owner is in its protected measurement window.
- No unsupported medical outcome, permanence, safety, or candidate claim.
- No new owner page without a verified offered service and provider source.
- No title/H1 rewrite that removes a phrase currently producing clicks without a documented preservation plan.

## Growth engine 3: authority clusters

### Blomdahl and medical ear piercing

This is the clearest scalable authority cluster because the owner already earns clicks and sits near page one.

Observed demand includes:

- `hypoallergenic ear piercing`: 12,100 monthly searches.
- `ear piercing aftercare`: 9,900.
- `ear piercing cost`: 2,900.
- `blomdahl ear piercing`: 260.
- `ear piercing for sensitive ears`: 170.

Cluster structure:

- Commercial owner: Blomdahl medical ear piercing in Williamsburg.
- Support: aftercare guide.
- Support: cost and what affects it.
- Support: sensitive ears and verified material choices.
- Support: children’s/pediatric appointment preparation where supported by actual clinic policy.
- Support: re-piercing and healing questions.
- Support: Blomdahl versus common alternatives, limited to verifiable differences.

Each supporting page answers a distinct informational question, links to the commercial owner, and avoids using the owner’s exact local sales title/H1.

### PRP hair restoration

Potential support themes, subject to provider approval:

- What an appointment includes.
- Typical treatment sequence used by this clinic.
- Candidate and non-candidate considerations.
- PRP versus transplant research intent.
- Women’s hair-thinning questions.
- Cost and consultation expectations.

### PRP breast lift

The national demand is material, but this cluster is claim-sensitive. The page currently owns `prp breast lift near me` in the captured SERP. Expansion waits for provider-authored protocol, price, aftercare, candidacy, and sequence details.

### Content quality standard

- One owner per commercial intent.
- One clear user question per support page.
- Provider-reviewed facts for treatment, candidacy, aftercare, price, and outcomes.
- Original clinic photos when possible.
- Useful tables/checklists/FAQs where they improve the answer.
- Internal links to the owner and consultation path.
- No mass-generated locality, symptom, or treatment fragments.

## Growth engine 4: CTR and conversion

### CTR opportunities

Current high-impression opportunities include:

- Homepage: 2,288 page-level impressions at 1.0% CTR.
- Newport News: 672 impressions at 0.3% CTR.
- PRP hair: 298 impressions at 0.7% CTR.
- Filler: 267 impressions at 1.5% CTR.
- `medical spa williamsburg`: 576 query impressions at position 3.1 with zero recorded clicks.

Prioritize titles/descriptions and visible trust/CTA improvements on existing owners before creating more weak URLs. Protect winning keyword language. Keep title tags keyword-rich without a site-name suffix.

### Measurement contract

Organic growth must report:

1. Qualified non-brand impressions.
2. Qualified non-brand clicks.
3. CTR.
4. Owner-page positions and clicks.
5. `consult_start`.
6. `consult_submit_success`.
7. `phone_click`.
8. Booked appointments when the clinic can connect them without sending PII to analytics.

The production GA4 ownership mismatch must be resolved before establishing the conversion baseline. Do not replace or disable the legacy property blindly. First identify the owner of production measurement ID `G-FBEPLGSS9L`; then either grant the operating account access or intentionally dual-measure/migrate with a documented transition window.

## Quantified operating model

The target model is a portfolio of gains, not one page producing 576 extra clicks.

| Engine | 90-day operating target | Contribution logic |
|---|---:|---|
| Protect current demand | Maintain at least the current 64 clicks per 28 days while releases proceed | Prevent growth work from destroying current winners. |
| CTR recovery | Add 25–60 clicks per 28 days from existing impressions | Move high-impression owner snippets and pages into a healthier click range without removing protected phrases. |
| Williamsburg local pack | Establish measurable Maps visibility and GBP actions for the core service set | Local pack is currently the largest commercial visibility deficit. Click contribution must be measured after UTM/GA4 reconciliation. |
| Botox/filler owners | Add 25–75 qualified clicks per 28 days after reaching the top 3–10 zone | Existing impressions prove Google already associates the site with these terms. |
| Ear-piercing authority | Add 100–250 clicks per 28 days from useful support content and stronger owner ranking | The owner already earns 15 clicks and national informational demand is large. |
| PRP authority | Add 50–150 clicks per 28 days across hair and breast-lift research intent | Existing owner rankings provide a foothold, but content requires verified protocol inputs. |
| Locality owners | Add 30–100 clicks per 28 days from Newport News and later eligible locations | Release one locality owner at a time and keep it distinct from Williamsburg intent. |

These ranges are hypotheses for planning. They become forecasts only after D7/D14/D28 measurements establish actual lift and conversion quality.

## Release train

| Slice | Earliest decision | Requirement |
|---|---|---|
| PR #68 D7 checkpoint | 2026-07-26 13:00 UTC | Complete GSC data through 2026-07-22 and protected-owner ledger. |
| PR #70 Newport News | 2026-07-26 after D7 | Merge only if the deterministic checkpoint passes and live owner smoke is clean. |
| PR #73 PRP breast lift | After Newport News D7 readback | No conflicting owner mutation; provider-source requirements satisfied. |
| PR #74 PRP hair restoration | After PRP breast-lift readback | Previous owner holds or improves. |
| PR #75 James City County | After PRP hair readback | Existing locality owners remain distinct and stable. |

D14 and D28 checkpoints remain scheduled. A daily release-train job may advance only one safe state transition and must not bypass the deterministic checkpoints.

## 90-day execution plan

### Days 0–14

- Finish the deep-audit regression repair and force-run Williamsburg.
- Reconcile GA4 production property ownership/access.
- Run the PR #68 D7 checkpoint.
- Release PR #70 only if the checkpoint passes.
- Start the GBP category/service/photo/review program using verified client inputs.
- Prepare protected Botox and filler owner briefs, but do not release them inside another owner’s window.

### Days 15–45

- Measure Newport News at D7/D14.
- Ship one eligible commercial recovery slice.
- Strengthen the Blomdahl owner and one distinct support resource at a time.
- Add local citations and real Williamsburg-area mentions.
- Report organic clicks plus consultation actions once GA4 is readable.

### Days 46–90

- Continue the PRP/locality release train only when prior owner gates pass.
- Expand proven authority clusters from Search Console evidence.
- Improve pages in positions 4–20 before adding unrelated topics.
- Consolidate or prune duplicate/thin intent only after URL-level evidence and redirect mapping.
- Rank the next quarter by qualified consultation contribution, not impression volume alone.

## Definition of success

A slice is complete only when:

- The protected owner/query ledger is updated.
- Tests/build pass.
- Preview or local rendered QA passes.
- The reviewed change is merged.
- Exact Production deployment and alias are verified.
- Live status, H1, canonical, title, schema, sitemap, internal links, and mobile rendering pass.
- D7/D14/D28 readbacks are scheduled.
- Conversion events are visible in the readable GA4 property without PII.
- The next owner does not ship until the current owner’s gate permits it.

## Immediate blockers requiring client input

1. Grant operating access to the GA4 property receiving `G-FBEPLGSS9L`, or approve a documented dual-measure/migration plan.
2. Approve the exact GBP category and service inventory.
3. Provide authentic clinic/provider/service/wayfinding photos.
4. Approve a post-appointment review-request process.
5. Provide provider-authored treatment details before claim-sensitive PRP and injectable expansions.

Everything else in this plan can continue through code, Search Console, Bing, DataForSEO, GBP observation, and controlled release automation without waiting.
