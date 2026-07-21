# PRP Hair Restoration owner-page slice

Date: 2026-07-21  
Owner URL: `https://www.williamsburgmedspa.com/procedures/prp-hair-restoration`  
Parent sequence: PRP Breast Lift owner page, PR #73

## Release state

This is the next prepared owner-page slice in the protected Williamsburg sequence. It may be reviewed in draft after the PRP Breast Lift page is production-ready. It must not merge until the Breast page has completed its D7 Search Console measurement and the owner ledger still shows the Hair page is safe to release.

## Current owner-page evidence

Search Console property: `sc-domain:williamsburgmedspa.com`  
Latest complete date used: 2026-07-17

| Window | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| 2026-07-11 to 2026-07-17 | 0 | 80 | 0.00% | 42.20 |
| 2026-07-04 to 2026-07-17 | 0 | 169 | 0.00% | 44.83 |
| 2026-06-20 to 2026-07-17 | 1 | 297 | 0.34% | 43.54 |

The page-query breakdown contains fewer totals because Search Console suppresses low-volume query rows. Its strongest visible 28-day impressions are currently transplant-comparison terms:

- `female hair transplant williamsburg`: 33 impressions, position 23.76. In the latest 7 days: 10 impressions, position 4.60.
- `hairline transplant williamsburg`: 31 impressions, position 16.97. In the latest 7 days: 9 impressions, position 8.22.
- `male hair transplant williamsburg`: 30 impressions, position 27.90. In the latest 7 days: 8 impressions, position 7.75.
- `prp hair restoration near me`: 2 impressions, position 76.50.

The service page remains the owner for the visible exact `prp hair restoration near me` row. The transplant comparison article and broader PRP hair guide remain support pages and link back to the service owner.

## Protected query roles

- Service owner: `/procedures/prp-hair-restoration`
- Comparison support: `/blog/prp-hair-restoration-vs-hair-transplant-williamsburg-va`
- Educational support: `/blog/hair-loss-got-you-down-discover-prp-your-new-ally-in-hair-restoration`

The owner page keeps its current H1, canonical route, local intent, and explicit PRP-versus-transplant distinction. This slice does not retitle either article or redirect any URL.

## Focused mutation

1. Add an early decision section explaining when PRP, medical evaluation, or a transplant specialist may be the useful next step.
2. Explain what PRP can and cannot do before payment.
3. Keep provider-specific protocol details limited to verified or inherent steps: consultation, blood draw, PRP preparation, targeted scalp injections, and aftercare.
4. Replace generic consultation copy with a preselected, attributed PRP Hair Restoration consultation path.
5. Limit checkout to one $600 treatment session because the current fulfillment path schedules one appointment after payment.
6. Add deterministic owner-page, pricing, structured-data, and quantity assertions to `scripts/verify-seo.mjs`.

## Claims boundary

- Do not promise regrowth, new follicles, a fixed session count, fixed timing, permanent results, or transplant-equivalent coverage.
- PRP may support hair density for selected patients with pattern hair loss, but response varies and published protocols are not standardized.
- Sudden, patchy, painful, inflamed, or rapidly changing hair loss should be medically evaluated before cosmetic treatment.
- Advanced bald areas or hairline rebuilding may require a transplant specialist.

## Verification required before review-ready

- `pnpm lint`
- `pnpm exec tsc --noEmit`
- `pnpm build`
- `pnpm verify:seo -- http://127.0.0.1:<port>`
- `git diff --check`
- Real 390px mobile and desktop browser QA
- Preview cart resolves one PRP Hair Restoration session at `$600.00`
- Consultation route contains the selected procedure and campaign attribution
- No broken images, horizontal overflow, application errors, or new dialog warnings
