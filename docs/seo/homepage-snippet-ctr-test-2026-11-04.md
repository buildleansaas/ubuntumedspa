# Homepage snippet CTR test (2026-11-04)

Started: 2026-11-04 (ships with the `/prices` page, branch `feat/prices-and-home-snippet`)
Page: `https://www.williamsburgmedspa.com/` (protected owner of the local medical-spa cluster, see `williamsburg-protected-query-owner-ledger.md`)
Type: title and meta description only. H1, hero, body copy, schema and internal links to service owners are unchanged, apart from one new homepage link to `/prices`.

## Ended early 2026-11-06 (ScaleSleek f_vh33afabed)

This title-only test was abandoned on 2026-11-06, two days in, with no verdict. The homepage is Google's pick for `botox williamsburg` (71 impressions, position 16.0) and `botox williamsburg va` (60 impressions, position 8.7), 2026-10-06 to 2026-11-02, and the 2026-11-06 PR changes the title, meta, hero, body, FAQ schema and inbound links in one deploy to answer them. That is a multi-variable change, not a snippet test: a CTR shift after it can't be attributed to the title alone. The new title also moves back toward the Xeomin/Botox-alternative wording of the pre-test title (which had the 2.9% baseline), with the lead words "Medical Spa Williamsburg VA" kept first.

What to watch instead, from the 2026-11-06 deploy: the category pool below (the main query) must not lose position or CTR, and `botox williamsburg` / `botox williamsburg va` on `/` should gain clicks. ScaleSleek measures the fix at day 14 and day 28. If the category pool drops (position worse than about 4, or CTR below 2.9%), roll the title back to `Medical Spa Williamsburg VA | Nurse-Led, Prices Posted` and keep the body changes.

| | Before (2026-11-04) | After (2026-11-06) |
| --- | --- | --- |
| Title | Medical Spa Williamsburg VA \| Nurse-Led, Prices Posted | Medical Spa Williamsburg VA \| Xeomin, a Botox Alternative |
| Meta | Nurse practitioner-led med spa on Powhatan Pkwy: Xeomin® (a Botox® alternative) from $250 cash, Blomdahl ear piercing $45, B-12 $25, PRP. See all prices. | Looking for Botox in Williamsburg, VA? Our nurse practitioner-led med spa uses Xeomin®, a Botox® alternative, from $250 cash. Ear piercing $45. See prices. |

The same PR also added a Botox-alternative answer under the H1, H2 answers for the Botox alternative, Hydrafacial and dermal fillers, and links to / from /events, /locations/williamsburg-va and /locations/yorktown-va.

## Why

`med spa williamsburg va` ranks near the top of page one but earns few clicks:

| Query | Window | Impressions | Avg position | CTR |
| --- | --- | --- | --- | --- |
| `med spa williamsburg va` | last 90 days (as reported 2026-11-04) | 313 | 3.5 | 2.9% |

A result at position 3 to 4 should earn more than 2.9%. The old snippet led with one service and gave a searcher no reason to pick this clinic over the others. The ledger's rule against a homepage rewrite asked for a reproducible CTR defect first. This is that defect, and the test changes only the reversible title and meta.

`williamsburg med spa` (the clinic's name) is the brand guardrail only. It is not part of the category pool and is not used to judge the test. Pull its 28-day homepage clicks, impressions, CTR and position at D0, before the deploy reaches Google, and record them below.

| Brand guardrail (homepage rows) | Window | Clicks | Impressions | CTR | Avg position |
| --- | --- | --- | --- | --- | --- |
| D0 baseline | 28 days before deploy | _pull at D0_ | | | |

## What changed

| | Before | After |
| --- | --- | --- |
| Title | Medical Spa Williamsburg VA \| Xeomin (Botox Alternative) & PRP | Medical Spa Williamsburg VA \| Nurse-Led, Prices Posted |
| Meta | Nurse-led med spa on Powhatan Pkwy. Xeomin® wrinkle relaxer (a Botox® alternative) from $250 cash, PRP, and Blomdahl ear piercing. | Nurse practitioner-led med spa on Powhatan Pkwy: Xeomin® (a Botox® alternative) from $250 cash, Blomdahl ear piercing $45, B-12 $25, PRP. See all prices. |

- The lead words "Medical Spa Williamsburg VA" stay first.
- The title names two reasons to click: a nurse practitioner runs the clinic, and prices are posted.
- The meta lists real cash prices. They come from `COMMERCE_CATALOG` (`src/lib/seo.ts`), so a price change updates the snippet.
- "See all prices" points to the new `/prices` page, which the homepage now links.
- Source: `src/lib/seo.ts` (`DEFAULT_TITLE`, `DEFAULT_DESCRIPTION`). Guarded by `src/lib/prices-page.test.ts` and `scripts/verify-seo.mjs`.

## Checks

**Category pool.** Judge the test on the homepage rows for these queries, pooled (sum clicks and impressions, impression-weighted position):

- `med spa williamsburg va`
- `medspa williamsburg va`
- `med spa williamsburg`
- `med spa near me`

Single queries are too small to read week to week. Do not judge the test until the pool has at least 200 impressions since the deploy, or 56 days have passed, whichever comes first. Compare against the same-length window just before the deploy. D7 and D14 are monitoring checks, not verdicts.

**Botox-alternative queries.** Per the owner ledger, record `botox williamsburg` and `botox williamsburg va` for both `/` and `/procedures/botox` at every checkpoint, so a shift between the two URLs is visible.

| Check | Date (approx.) | What to record | Result |
| --- | --- | --- | --- |
| D0 | deploy day | Live title and meta on `/` (curl, no cache); brand guardrail baseline above; pre-deploy category pool | |
| D7 | deploy + 7 days | Google shows the new title (site: query or URL Inspection); pooled category clicks, impressions, CTR, position; brand guardrail; the two `botox williamsburg` queries on `/` and `/procedures/botox` | |
| D14 | deploy + 14 days | Pooled category vs prior 14 days; brand guardrail; the two `botox williamsburg` queries on `/` and `/procedures/botox` | |
| D28 | deploy + 28 days | Pooled category vs prior 28 days; brand guardrail; the two `botox williamsburg` queries on `/` and `/procedures/botox`. Verdict only if the pool has 200+ impressions; otherwise wait | |
| D56 | deploy + 56 days, if needed | Verdict on the pooled 56-day window: keep, revise, or roll back | |

Success: pooled category CTR above the pre-deploy pooled CTR (the single-query baseline is 2.9%), with pooled position no worse than about 4, and the brand guardrail within the rollback limit.

## Rollback rule

If homepage clicks for the brand guardrail query drop more than 30% against an equal-length window before the deploy (D14 or D28), revert `DEFAULT_TITLE` to the previous title. Keep the new meta unless it is also implicated. If pooled category position drops by more than 2 places while CTR is flat, revert both and record the result here.

Do not change the homepage H1 or body until the verdict, so the result reads as a snippet test.
