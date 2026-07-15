# July W2 complete SEO quality pass

Date: 2026-07-14
Branch: `seo/july-w2-complete-quality-pass`
Target: `https://www.williamsburgmedspa.com`
Merge policy: hold one PR until source checks, CI, Vercel preview, rendered mobile/desktop QA, and final live-ready review all pass.

## Evidence baseline

### Search Console, 2026-06-14 through 2026-07-11

- 59 clicks, 5,200 impressions, 1.13% CTR, average position 8.25.
- Previous 28 days: 26 clicks, 3,173 impressions, 0.82% CTR, average position 9.02.
- Blomdahl service page: 13 clicks, 377 impressions, 3.45% CTR, position 5.12.
- Hyperhidrosis service page: 2 clicks, 158 impressions, 1.27% CTR, position 4.91.
- Filler service page: 0 clicks, 76 impressions, position 7.24.
- Homepage still owns most generic medical-spa and Botox impressions.
- GSC URL Inspection reported the homepage indexed. `/procedures/botox`, `/procedures/microneedling-with-prp`, `/events`, `/events/botox-party`, and `/procedures/blomdahl-ear-piercing/for/sensitive-ears` were discovered but not indexed. `/affiliates` was unknown to Google and currently redirects to `/consult`.

### Live technical crawl, 2026-07-14

- 89 URLs in the sitemap, all returned 200 after redirects.
- No current sitemap canonical mismatches, `noindex` pages, duplicate titles, missing titles, missing H1s, or obvious sitemap failures.
- Apex and HTTP variants correctly redirect to the HTTPS `www` host.
- The sitemap omits the published `/events` hub and `/events/botox-party` detail page.
- Every non-blog sitemap row receives `lastModified: new Date()` at build time, falsely refreshing all routes on every deploy.
- JSON-LD renders after hydration through `next/script`, but is absent from raw HTML. Google can render it, but SSR markup is more reliable for crawlers and resolves the raw/rendered discrepancy.
- The affiliate program is deliberately redirected to `/consult`, but the header, footer, homepage, and footer CTA still advertise and link to `/affiliates`. This is internally inconsistent and sends visitors to the wrong destination.

## Query ownership decisions

- `medical spa Williamsburg` -> `/`.
- `Botox Williamsburg` and neurotoxin treatment intent -> `/procedures/botox`.
- `dermal fillers Williamsburg` -> `/procedures/filler`.
- `medical ear piercing`, `Blomdahl`, `children's ear piercing`, sensitive-ear and re-piercing intent -> the Blomdahl service hub and its published child/local pages.
- `hyperhidrosis`, `excessive sweating`, and related treatment intent -> `/procedures/hyperhidrosis-treatment` plus its symptom pages.
- `microneedling with PRP Williamsburg` -> `/procedures/microneedling-with-prp`.
- Botox party intent -> `/events/botox-party`, supported by `/events`.
- `/affiliates` will not be revived or indexed in this slice. The existing redirect is the latest explicit product behavior. All misleading public affiliate links/callouts will be removed while the redirect remains as a legacy safety net.
- No body-contouring/body-sculpting page will be created. Current evidence is low-volume and the repository does not confirm a matching offered service.

## Commit plan

### Commit 1: plan and evidence

- Commit this plan before implementation.

### Commit 2: technical indexation and schema

- Add the published event hub/detail routes to the sitemap.
- Stop assigning a fake current `lastModified` value to every static, procedure, product, location, and generated local route. Preserve real blog publication/modification dates.
- Server-render JSON-LD in raw HTML with safe `<` escaping.
- Remove redundant page-level `LocalBusiness` schema where the global layout already provides it.
- Remove public affiliate navigation/callouts while retaining the `/affiliates` -> `/consult` redirect.
- Add a runtime SEO verification script that checks sitemap status/canonicals, robots, schema, priority routes, host consistency, broken internal links, and retired affiliate links.

### Commit 3: query ownership, trust, and discovery

- Point homepage Botox/filler intent links to the canonical service owners instead of local variant pages.
- Add a strong Blomdahl service link to the homepage local-intro bridge.
- Add visible, reusable provider/location/appointment trust details to the procedure template without inventing review counts or credentials.
- Add contextual discovery links for high-value currently unindexed routes, especially microneedling with PRP and the published event hub/detail page, while preserving homepage and event intent.
- Keep filler, Botox, and Blomdahl anchors descriptive and avoid creating competing generic pages.

### Commit 4: verification receipts and final fixes

- Run `pnpm lint`, TypeScript validation, `pnpm build`, and the runtime SEO crawler against the built app.
- Validate rendered JSON-LD, canonicals, metadata, and internal links.
- Run local mobile Lighthouse because the PageSpeed API currently returns `429 RESOURCE_EXHAUSTED` with daily quota `0`.
- Browser-QA the homepage, Botox, filler, Blomdahl hub/child/local page, hyperhidrosis, microneedling, events hub/detail, location page, blog, consult, and affiliate redirect at desktop and iPhone-class widths.
- Fix every reproducible blocker, then commit only durable audit artifacts and concise receipts.

## Measurement plan

At 7, 14, and 28 days after production deployment:

1. Reinspect `/procedures/botox`, `/procedures/filler`, `/procedures/microneedling-with-prp`, `/events`, `/events/botox-party`, and the priority Blomdahl routes in GSC.
2. Compare query-to-page ownership for medical spa, Botox/neurotoxin, filler, Blomdahl/ear piercing, hyperhidrosis, and microneedling clusters.
3. Track clicks, impressions, CTR, average position, indexed status, canonical selected by Google, and meaningful conversions.
4. Preserve winners. Do not replace the homepage's generic medical-spa ownership or the Blomdahl page's existing click/CTR gains with broad speculative copy.
5. Reconsider a body-contouring page only if the client confirms a real service and query evidence becomes meaningful.

## Exit criteria

- One focused held PR contains all July W2 commits.
- CI and Vercel preview pass.
- Runtime SEO verification reports no failures.
- No internal links point to the retired affiliate route.
- Priority pages have self-referencing canonicals and server-rendered valid JSON-LD.
- Desktop and mobile browser checks show no critical layout, navigation, form, image, or CTA defects.
- Final report distinguishes source/build/browser/preview evidence and lists any residual uncertainty before merge.
