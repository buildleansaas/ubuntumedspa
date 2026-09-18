# James City County owner-page slice

Date: 2026-07-21
Owner URL: `https://www.williamsburgmedspa.com/locations/james-city-county-va`
Parent sequence: PRP Hair Restoration owner page, PR #74

## Release position

This is a focused service-area hub slice stacked after the PRP Hair Restoration owner-page draft.

Keep this slice in draft until the preceding protected owner pages have cleared their serial production measurement gates. Do not release overlapping owner-page changes together.

## Current Search Console baseline

Source: Google Search Console API, property `sc-domain:williamsburgmedspa.com`. Latest complete date: 2026-07-17.

| Window | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| 2026-07-11 to 2026-07-17 | 0 | 21 | 0% | 56.10 |
| 2026-07-04 to 2026-07-17 | 0 | 37 | 0% | 57.59 |
| 2026-06-20 to 2026-07-17 | 1 | 110 | 0.91% | 41.75 |

Visible 28-day queries include:

- `pain therapy in james city county, va`: 35 impressions, average position 37.94
- `med spa williamsburg va`: 29 impressions, average position 84.97
- `williamsburg med spa`: 5 impressions, average position 2.00
- `med spas near me`: 2 impressions, average position 2.00
- `dermal fillers williamsburg va`: 2 impressions, average position 95.50

The exact James City County med-spa, Botox, and filler query filters returned no reportable rows in this window. That makes this an emerging local owner, not a mature query winner.

Comparison page totals for the same 28-day window:

- `/locations`: 0 clicks, 114 impressions, average position 7.59
- `/locations/williamsburg-va`: 0 clicks, 211 impressions, average position 40.55

## Slice objective

Make the James City County route a useful customer-facing service-area hub without competing with treatment owner pages.

The page should:

- answer where the clinic is, how to approach it, current hours, parking, and contact details;
- route each treatment question to its direct owner page;
- explain when to book a general consultation;
- preserve neighborhood relevance without doorway-page repetition;
- provide visible FAQs that match FAQ structured data;
- avoid exposing SEO strategy or speaking about what a web page should do.

## Protected boundaries

- Keep the existing canonical URL and primary title intent.
- Do not rewrite treatment-owner titles, H1s, or canonicals in this slice.
- Do not promise exact drive times.
- Do not imply that every listed treatment is appropriate for every visitor.
- Do not claim a separate James City County clinic location.
- Do not create competing local treatment pages from this hub.

## Mutation

- Replace internal SEO-review language with direct second-person visitor guidance.
- Add direct routes to Botox, Xeomin, dermal filler, PRP hair restoration, hyperhidrosis, and the existing James City County Blomdahl owner.
- Add consultation attribution specific to this location page.
- Add clinic address, hours, routing, parking, phone, and map details.
- Add visible FAQs and FAQ structured data.
- Add deterministic owner-page assertions to `scripts/verify-seo.mjs`.

## Measurement

After production release, compare D7, D14, and D28 against the fixed pre-release windows above. Review:

- owner-page clicks, impressions, CTR, and average position;
- exact and partial James City County med-spa query ownership;
- overlap with `/locations` and `/locations/williamsburg-va`;
- unexpected growth in irrelevant `pain therapy` intent;
- consultation clicks from the location-page attribution campaign.
