# Williamsburg Med Spa BOFU GSC Refresh — 2026-06-04

Source: live Google Search Console API via `sc-domain:williamsburgmedspa.com` using `au.witherow@gmail.com` owner token.  
Recent window: 2026-05-06 through 2026-06-02. Previous comparison: 2026-04-08 through 2026-05-05.  
Historical reference checked: repo GSC export `gsc/williamsburgmedspa.com-Performance-on-Search-2026-04-05.zip`.

## Executive read

The old theme still holds: the site is being shown for med-spa and service buyer searches, but clicks are weak. The biggest immediate BOFU problem is not lack of impressions. It is that Google is testing Williamsburg Med Spa near the top for `medical spa williamsburg`, while the snippet/page is not earning clicks.

Fresh 28-day totals from query rows: 22 visible-query clicks / 5,038 impressions. Page rows show 41 total clicks / 6,855 impressions, so some clicks/impressions are anonymized by GSC.

## What we used to say before the newer changes

From the older April GSC export and repo docs, the original posture was:

- Own local buyer phrases first: `williamsburg med spa`, `med spa williamsburg va`, `medical spa williamsburg`, `botox williamsburg va`, `dermal fillers williamsburg`, `ear piercing williamsburg va`.
- Treat Williamsburg/Jenny/provider trust as the conversion layer, not generic spa copy.
- Prioritize pages already getting impressions before spinning up broad content.
- Keep claims medically conservative, especially PRP/O-Shot/breast lift/hair restoration.
- Avoid weak city-swaps. Surrounding city pages need real local proof or should stay secondary/draft.

## BOFU cluster summary

| cluster                 | example_queries                                                                                                                 |   clicks |   impressions |    ctr |   weighted_avg_position | best_current_page                                                   |
|:------------------------|:--------------------------------------------------------------------------------------------------------------------------------|---------:|--------------:|-------:|------------------------:|:--------------------------------------------------------------------|
| Core med spa            | medical spa williamsburg, med spa williamsburg va, medspa williamsburg, med spa williamsburg, williamsburg med spa              |       12 |          3181 | 0.0038 |                     4   | https://www.williamsburgmedspa.com/                                 |
| Botox / neuromodulators | botox williamsburg, botox williamsburg va, botox near me, williamsburg botox, masseter botox williamsburg                       |        3 |           206 | 0.0146 |                    22.4 | https://www.williamsburgmedspa.com/                                 |
| Ear piercing            | ear piercing williamsburg va, piercing williamsburg va, medical ear piercing, ear piercing near me, needle ear piercing near me |        5 |            99 | 0.0505 |                    18.3 | https://www.williamsburgmedspa.com/procedures/blomdahl-ear-piercing |
| Laser/Hydrafacial gaps  | laser hair removal williamsburg va, hydrafacial williamsburg va, facial williamsburg va                                         |        0 |            88 | 0      |                    39.9 | https://www.williamsburgmedspa.com/                                 |
| PRP hair restoration    | hairline transplant williamsburg, female hair transplant williamsburg, male hair transplant williamsburg                        |        0 |            84 | 0      |                    18.9 | https://www.williamsburgmedspa.com/procedures/prp-hair-restoration  |
| PRP breast lift         | breast lift williamsburg, breast lift williamsburg va                                                                           |        0 |            77 | 0      |                    14.6 | https://www.williamsburgmedspa.com/procedures/prp-breast-lift       |
| Fillers                 | dermal fillers williamsburg, dermal fillers williamsburg va, facial dermal filler williamsburg va                               |        0 |            73 | 0      |                    14.6 | https://www.williamsburgmedspa.com/                                 |

## Recommended order

|   priority | target_url                                                          | query_cluster                                   | action_bucket                                                                      | gsc_evidence                                                                                                                                                                                                                        |
|-----------:|:--------------------------------------------------------------------|:------------------------------------------------|:-----------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|          1 | https://www.williamsburgmedspa.com/                                 | medical spa / med spa Williamsburg              | refresh-existing-page / CTR                                                        | Homepage is ranking #2.8 for 2,807 impressions on medical spa williamsburg with 0 clicks; #4.0 for med spa williamsburg va with 2/128. Retune above-fold/title/meta around buyer choice, provider trust, services, booking.         |
|          2 | https://www.williamsburgmedspa.com/procedures/blomdahl-ear-piercing | ear piercing Williamsburg                       | refresh-existing-page + internal links                                             | Ear piercing page has 1 click / 29 impressions at avg pos 6.4 for ear piercing williamsburg va, plus near me clicks. Page already has strong title/H1. Add parent/child/sensitive-ear decision blocks and homepage/service links.   |
|          3 | https://www.williamsburgmedspa.com/procedures/filler                | dermal fillers Williamsburg                     | refresh-existing-page                                                              | Current page only captures 0/29 at avg pos 34 while homepage ranks 0/27 at avg pos 11 for dermal fillers williamsburg va. Need query-to-page alignment, internal links from homepage/procedures, maybe snippet comparison language. |
|          4 | https://www.williamsburgmedspa.com/procedures/prp-breast-lift       | PRP breast lift Williamsburg                    | refresh-existing-page / reposition                                                 | Page has 0/39 at pos 12.5 and 0/38 at pos 16.7. Good striking-distance impressions but likely needs clearer non-surgical PRP/Vampire Breast Lift framing and medical caveats.                                                       |
|          5 | https://www.williamsburgmedspa.com/                                 | Botox Williamsburg                              | create/refresh dedicated Botox/Xeomin page or strengthen current service targeting | Botox terms produce 1/118 at avg pos 22.6 and 0/69 at 20.6, mostly homepage. If Botox is a priority revenue service, a dedicated Botox Williamsburg page/section is needed.                                                         |
|          6 | https://www.williamsburgmedspa.com/procedures/prp-hair-restoration  | hair restoration / hair transplant alternatives | refresh-existing-page                                                              | Hair page receives transplant-alternative impressions around pos 16-25. Reframe as non-surgical PRP hair support for people comparing transplant options, not pretending to be transplant surgery.                                  |
|          7 | not-currently-fit                                                   | laser hair removal / hydrafacial Williamsburg   | defer / clarify services                                                           | GSC shows impressions but current site pages appear not to own these as core service pages. Do not chase if she does not actually offer them.                                                                                       |

## First slice I recommend

Refresh the homepage/snippet around the core `medical spa williamsburg` cluster.

Why:

- `medical spa williamsburg`: 2,807 homepage impressions, 0 clicks, avg position 2.76.
- `med spa williamsburg va`: 128 homepage impressions, 2 clicks, avg position 4.05.
- `medspa williamsburg`: 48 homepage impressions, 0 clicks, avg position 3.44.
- This is the highest-volume buyer cluster and already page-one. Better CTR here can matter faster than writing new long-tail pages.

What the slice should change:

- Title/meta: make the result read like the Williamsburg med-spa choice, not just a brand page.
- First screen: answer “what can I book here and why trust Jenny?” within 5 seconds.
- Service path: Botox/Xeomin, fillers, PRP, O-Shot, and Blomdahl ear piercing should be obvious and clickable.
- Local trust: Jenny Coleman credentials, Williamsburg location, consult-first medical-spa framing.
- Internal links: push equity from homepage into filler, ear piercing, PRP breast lift, hair restoration, O-Shot, and Botox/Xeomin surface.

## Next slices after homepage

1. Ear piercing page, because it is actually converting non-brand clicks and sits around position 6 for `ear piercing williamsburg va`.
2. Filler page, because Google is showing filler queries but splitting/leaning homepage instead of the procedure page.
3. PRP breast lift page, because it has striking-distance impressions around positions 12-17 with 0 clicks.
4. Botox/Xeomin service targeting, because Botox demand is clear but rankings are weak and currently mostly homepage-led.
5. PRP hair restoration, carefully framed as non-surgical hair support, not transplant surgery.

## Defer/clarify

- `laser hair removal williamsburg va` and `hydrafacial williamsburg va` appear in GSC, but do not chase these unless Jenny actually offers them and wants them emphasized.
- Newport News/location expansion should stay secondary until Williamsburg BOFU CTR/service pages are tightened.

## Files

- `gsc_queries_28d.csv`
- `gsc_pages_28d.csv`
- `gsc_page_query_28d.csv`
- `gsc_queries_prev28d.csv`
- `gsc_page_query_prev28d.csv`
- `bofu-cluster-summary.csv`
- `execution-queue.csv`
- `old_gsc_export_2026-04-05/`
