# Homepage snippet CTR test (2026-11-04)

Started: 2026-11-04 (ships with the `/prices` page, branch `feat/prices-and-home-snippet`)
Page: `https://www.williamsburgmedspa.com/` (protected owner of the local medical-spa cluster, see `williamsburg-protected-query-owner-ledger.md`)
Type: title and meta description only. H1, hero, body copy, schema and internal links to service owners are unchanged, apart from one new homepage link to `/prices`.

## Why

`med spa williamsburg va` ranks near the top of page one but earns few clicks:

| Query | Window | Impressions | Avg position | CTR |
| --- | --- | --- | --- | --- |
| `med spa williamsburg va` | last 90 days (as reported 2026-11-04) | 313 | 3.5 | 2.9% |

A result at position 3 to 4 should earn more than 2.9%. The old snippet led with one service and gave a searcher no reason to pick this clinic over the others. The ledger's rule against a homepage rewrite asked for a reproducible CTR defect first. This is that defect, and the test changes only the reversible title and meta.

Brand queries that also land on the homepage (`williamsburg med spa`, `williamsburg medical spa`, and any other query containing the clinic name) are the guardrail. Pull their 28-day clicks, impressions, CTR and position for the homepage at D0, before the deploy reaches Google, and record them below.

| Brand guardrail (homepage rows) | Window | Clicks | Impressions | CTR | Avg position |
| --- | --- | --- | --- | --- | --- |
| D0 baseline | 28 days before deploy | _pull at D0_ | | | |

## What changed

| | Before | After |
| --- | --- | --- |
| Title | Medical Spa Williamsburg VA \| Xeomin (Botox Alternative) & PRP | Medical Spa Williamsburg VA \| Nurse-Led, Prices Posted |
| Meta | Nurse-led med spa on Powhatan Pkwy. Xeomin® wrinkle relaxer (a Botox® alternative) from $250 cash, PRP, and Blomdahl ear piercing. | Nurse practitioner-led med spa on Powhatan Pkwy: Xeomin® (a Botox® alternative) $250 cash, Blomdahl ear piercing $45, B-12 $25, PRP. See all prices. |

- The lead words "Medical Spa Williamsburg VA" stay first.
- The title names two reasons to click: a nurse practitioner runs the clinic, and prices are posted.
- The meta lists real cash prices. They come from `COMMERCE_CATALOG` (`src/lib/seo.ts`), so a price change updates the snippet.
- "See all prices" points to the new `/prices` page, which the homepage now links.
- Source: `src/lib/seo.ts` (`DEFAULT_TITLE`, `DEFAULT_DESCRIPTION`). Guarded by `src/lib/prices-page.test.ts` and `scripts/verify-seo.mjs`.

## Checks

Compare each window with the same-length window just before the deploy date. Record the homepage row for `med spa williamsburg va`, the other local-category queries (`medical spa williamsburg`, `med spa williamsburg`, `williamsburg med spa`) and the brand guardrail rows.

| Check | Date (approx.) | What to record | Result |
| --- | --- | --- | --- |
| D0 | deploy day | Live title and meta on `/` (curl, no cache); brand baseline above | |
| D7 | deploy + 7 days | Google shows the new title (site: query or URL Inspection); early CTR; brand clicks | |
| D14 | deploy + 14 days | CTR and position vs the prior 14 days; brand clicks | |
| D28 | deploy + 28 days | Decision: keep, revise, or roll back | |

Success: CTR for `med spa williamsburg va` above 2.9% at D28 with average position no worse than about 4, and brand clicks within the rollback limit.

## Rollback rule

If homepage clicks from brand queries drop more than 30% against an equal-length window before the deploy (D14 or D28), revert `DEFAULT_TITLE` to the previous title. Keep the new meta unless it is also implicated. If position for the local cluster drops by more than 2 places while CTR is flat, revert both and record the result here.

Do not change the homepage H1 or body during the 28-day window, so the result reads as a snippet test.
