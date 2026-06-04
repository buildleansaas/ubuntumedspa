# Williamsburg Med Spa BOFU SEO conversion commit plan

> **For Hermes:** Implement as one PR with small verified commits. Use the GSC evidence in `artifacts/seo-research/williamsburgmedspa.com/2026-06-04-bofu-gsc-refresh/` as the source of truth. After each commit, run the named verification gate before continuing.

**Goal:** Turn existing Williamsburg BOFU Google impressions into more clicks and consultation intent, starting with the homepage and then the highest-intent service pages.

**Architecture:** Keep the current Next.js page structure and visual system. Improve search surfaces, above-fold choice clarity, service-page intent matching, internal links, conservative medical caveats, and supporting assets. Do not create broad city-swap pages or unsupported service pages.

**Tech stack:** Next.js 13 app router, TypeScript, React, Tailwind/DaisyUI, source data under `src/data`/`src/config`, static assets under `public`, GSC artifacts under `artifacts/seo-research`.

**GSC source:** Live GSC API, recent window `2026-05-06` through `2026-06-02`, property `sc-domain:williamsburgmedspa.com`.

**Primary ICP:** A Williamsburg-area patient comparing local med spas and service options. They want to know: who is treating me, what can I book, is this safe/conservative, does this fit my goal, and how do I take the next step?

**Marketing lens:** Corey Haines-style demand capture plus humanized local trust. Capture demand that already exists, match each page to a specific search job, make the offer easy to choose, and avoid vague brand fluff. Public copy should sound like a local clinical med spa, not a marketing deck.

---

## Plan review gate

Risk level: medium
Gate status: pending implementation
Reviewer: Austin / Hermes before PR merge

- Scope clear: yes, BOFU SEO/content/asset/internal-link changes only.
- Out of scope: live sends, GSC submissions, unsupported services, fake testimonials, fake before/after proof, broad surrounding-city expansion, aggressive medical claims.
- Risk surfaces: public medical/wellness copy, client brand trust, local SEO, generated assets.
- Verification: source guards, lint/build, rendered metadata/HTML smoke, browser visual QA, no banned AI punctuation in touched public copy, client-safe summary update.
- Rollback: revert individual commits in the stack. Each commit should be narrow and independently understandable.

---

## Existing evidence checkpoint

Artifacts already written:

- `artifacts/seo-research/williamsburgmedspa.com/2026-06-04-bofu-gsc-refresh/summary.md`
- `artifacts/seo-research/williamsburgmedspa.com/2026-06-04-bofu-gsc-refresh/client-safe-summary.md`
- `artifacts/seo-research/williamsburgmedspa.com/2026-06-04-bofu-gsc-refresh/execution-queue.csv`
- `artifacts/seo-research/williamsburgmedspa.com/2026-06-04-bofu-gsc-refresh/bofu-cluster-summary.csv`

Highest-priority findings:

1. Homepage / core med spa query
   - Query: `medical spa williamsburg`
   - GSC: about `2,807` homepage impressions, `0` clicks, avg position about `2.76`
   - Job: make the search result and first screen feel like the obvious Williamsburg medical spa choice.

2. Ear piercing
   - Queries: `ear piercing williamsburg va`, `piercing williamsburg va`, `ear piercing near me`
   - GSC: best converting non-brand service cluster.
   - Job: help parents/adults choose medical ear piercing over mall/generic piercing.

3. Fillers
   - Queries: `dermal fillers williamsburg`, `dermal fillers williamsburg va`
   - GSC: Google splits demand between homepage and service page.
   - Job: align query intent to the filler page and stop relying on the homepage alone.

4. PRP breast lift
   - Queries: `breast lift williamsburg`, `breast lift williamsburg va`
   - GSC: striking-distance positions with zero clicks.
   - Job: clarify this is non-surgical PRP support, not surgical breast lift.

5. Botox/Xeomin
   - Queries: `botox williamsburg`, `botox williamsburg va`, `williamsburg botox`
   - GSC: valuable service demand, weak current position.
   - Job: create or strengthen a dedicated Botox/Xeomin buyer path.

6. PRP hair restoration
   - Queries: transplant-adjacent hair restoration searches.
   - Job: frame as non-surgical PRP hair support for people comparing options, without implying transplant service.

---

## Global copy and asset rules

- No em dashes in public copy. Rewrite the sentence instead.
- No guaranteed outcomes, no surgical-equivalent claims, no fake reviews/testimonials, no fake before/after language.
- Use straight quotes only if quotes are needed.
- Keep section headings natural, not title-case stacked marketing language.
- Use patient language: local med spa, Botox, Xeomin, fillers, PRP, O-Shot, ear piercing, consultation, natural-looking, conservative, nurse practitioner led, Williamsburg.
- Make Jenny/provider trust visible, but do not make the copy sound like credential stuffing.
- If new photos are needed, create clean editorial medical-spa lifestyle assets with no fake patient outcomes, no explicit procedure needles in faces, no before/after, no text baked into the image.

Recommended photo/art needs:

- Homepage: warm Williamsburg med-spa consultation/lobby/provider-trust image or soft service-choice image.
- Ear piercing: parent/child or adult ear-piercing consult vibe, clean Blomdahl/medical-safe feel, no distressed child.
- Fillers/Botox: natural-looking consultation or facial-treatment prep, no exaggerated lips/forehead, no before/after.
- PRP breast lift / O-Shot / hair: abstract consultation/confidence images, privacy-safe, medically tasteful, no explicit body focus.

---

## Commit 1: Add a BOFU copy/SEO guardrail and evidence note

**Objective:** Lock the GSC evidence and public-copy safety rules into source so later commits stay focused.

**Files:**
- Create: `docs/plans/2026-06-04-williamsburg-bofu-commit-plan.md` (this file)
- Create or modify: `scripts/audit-public-copy.mjs` if no equivalent guard exists
- Modify: `package.json` to add a script such as `audit:public-copy`

**Implementation notes:**
- Guard touched public source files against:
  - em dash `—`
  - fake proof phrases: `before and after`, `guaranteed`, `permanent lift`, `surgical results`, `hair transplant service`
  - public placeholder labels: `placeholder`, `fake testimonial`, `coming soon` if visible copy is touched
- Keep the allowlist narrow if legacy source already contains unrelated violations.

**Verification:**
- `pnpm audit:public-copy`
- `git diff -- docs/plans package.json scripts/audit-public-copy.mjs`

**Commit:**
```bash
git add docs/plans/2026-06-04-williamsburg-bofu-commit-plan.md package.json scripts/audit-public-copy.mjs
git commit -m "docs: plan Williamsburg BOFU SEO conversion stack"
```

---

## Commit 2: Homepage BOFU snippet and first-screen choice clarity

**Objective:** Make the homepage search result and first screen answer `medical spa williamsburg` with a clear local choice, service paths, Jenny trust, and consult CTA.

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/views/jumbotron.tsx`
- Optional modify: `src/views/provider-callout.tsx`
- Optional add asset: `public/...` only if using a new homepage image

**Copy direction:**
- Title target: `Medical Spa in Williamsburg, VA for Botox, Fillers, PRP & Piercing`
- Meta target: patient-facing, under SERP-safe length, local + services + Jenny trust.
- H1: keep `Medical Spa in Williamsburg, VA` or a close variant.
- Above fold:
  - One plain headline.
  - One plain subhead naming Botox/Xeomin, fillers, PRP, O-Shot, Blomdahl ear piercing.
  - One sentence on Jenny/provider trust.
  - Direct buttons: `Book a Williamsburg consultation`, `Compare services`, phone.
- Add service-choice cards or pills that make the next page obvious:
  - Smooth lines/wrinkles: Botox/Xeomin
  - Lips/cheeks/under-eyes: Fillers
  - Hair thinning/support: PRP hair restoration
  - Intimate wellness: O-Shot
  - Medical ear piercing: Blomdahl

**Corey Haines marketing lens:**
- Demand capture: match the exact local category query first.
- Conversion path: reduce decision friction by segmenting by job-to-be-done.
- Trust: local provider and conservative planning before aesthetic hype.

**Verification:**
- `pnpm audit:public-copy`
- `pnpm lint`
- `pnpm build`
- Rendered smoke: homepage title, meta description, H1, service links, CTA hrefs.
- Browser/mobile QA: first screen does not look like a generic SEO wall.

**Commit:**
```bash
git add src/app/page.tsx src/views/jumbotron.tsx src/views/provider-callout.tsx public
 git commit -m "feat: sharpen homepage BOFU medical spa path"
```

---

## Commit 3: Ear piercing page conversion refresh

**Objective:** Turn the best non-brand service cluster into a stronger patient decision page.

**Files:**
- Modify likely source for procedure data/cards: inspect `src/data*` or procedure config before editing.
- Modify: `src/app/procedures/[slug]/page.tsx` only if template support is needed.
- Optional add asset: ear-piercing consultation image under `public/procedure/...`.

**Copy direction:**
- Keep primary query: `Ear Piercing in Williamsburg, VA`.
- Add decision blocks:
  - `Medical ear piercing for sensitive ears`
  - `For kids, teens, and adults` only if age policy supports it.
  - `Why Blomdahl` with nickel-safe/medical-grade language only if accurate.
  - `What happens at the visit` in plain language.
- CTA: `Book ear piercing in Williamsburg`.

**Approval needed before implementation:**
- Confirm age policy and exact Blomdahl safety/material claims from current source/client docs. If not confirmed, write generic medical-piercing language only.

**Verification:**
- `pnpm audit:public-copy`
- `pnpm lint`
- `pnpm build`
- Rendered smoke for `/procedures/blomdahl-ear-piercing` title/H1/body/CTA.

**Commit:**
```bash
git add src public
 git commit -m "feat: improve Williamsburg ear piercing service page"
```

---

## Commit 4: Fillers page intent alignment and internal links

**Objective:** Make `dermal fillers williamsburg` resolve to the filler page instead of letting the homepage carry the query.

**Files:**
- Modify: filler procedure source data/config.
- Modify: homepage/procedures internal link text if needed.
- Modify: procedure template if it needs a reusable buyer-fit block.

**Copy direction:**
- Title/H1: `Dermal Fillers in Williamsburg, VA` stays strong.
- Add plain sections:
  - Lips, cheeks, under-eyes, facial balancing.
  - Natural-looking volume, not overfilled outcomes.
  - Consultation-based planning with Jenny.
  - Pricing/booking path if already supported by catalog.
- Internal links from homepage and procedures should use `dermal fillers in Williamsburg`, not only `Filler`.

**Verification:**
- `pnpm audit:public-copy`
- `pnpm lint`
- `pnpm build`
- Rendered smoke for filler page metadata, H1, body phrase coverage, canonical, CTA.

**Commit:**
```bash
git add src
 git commit -m "feat: align filler page with Williamsburg dermal filler intent"
```

---

## Commit 5: PRP breast lift cautious repositioning

**Objective:** Capture striking-distance `breast lift williamsburg` searches without implying surgery or guaranteed lift.

**Files:**
- Modify: PRP breast lift procedure source/config.
- Modify: procedure template if a caveat/fit block is reusable.

**Copy direction:**
- Page should clearly say:
  - Non-surgical PRP breast-lift consultation in Williamsburg.
  - Not a surgical breast lift.
  - Results vary.
  - Best for people exploring subtle skin/texture/support goals, not major lift/size changes.
- CTA: `Ask about PRP breast lift` or `Book a PRP consultation`.

**Forbidden copy:**
- `surgical results`
- `permanent lift`
- `guaranteed lift`
- `increase cup size`
- anything implying replacement for surgery.

**Verification:**
- `pnpm audit:public-copy`
- `pnpm lint`
- `pnpm build`
- Rendered smoke for `/procedures/prp-breast-lift` plus forbidden-claim scan.

**Commit:**
```bash
git add src
 git commit -m "feat: clarify PRP breast lift positioning"
```

---

## Commit 6: Botox/Xeomin service path

**Objective:** Give high-value neuromodulator searches a stronger dedicated path.

**Files:**
- Inspect current routes first:
  - `/procedures/botox`
  - `/procedures/xeomin`
  - `/procedures/botox/near/williamsburg-va`
  - `/procedures/xeomin/near/williamsburg-va`
- Modify: procedure source/config and internal links.
- Optional create: a combined landing page only if current route structure cannot satisfy `botox williamsburg` cleanly.

**Copy direction:**
- Use Botox and Xeomin carefully. If both are offered, explain them as neuromodulator options.
- Include common patient jobs:
  - forehead lines
  - crow's feet
  - frown lines
  - masseter/jawline only if offered
  - excessive sweating only if Botox/Xeomin path supports it
- Keep expectations conservative: natural-looking, plan-based, no frozen-face hype.

**Decision gate:**
- If current Botox and Xeomin pages already exist and are indexable, refresh those before creating a new combined page.
- If the current pages are thin and competing, consider a combined `Botox and Xeomin in Williamsburg, VA` hub that links to both purchase/consult paths.

**Verification:**
- `pnpm audit:public-copy`
- `pnpm lint`
- `pnpm build`
- Rendered smoke for selected Botox/Xeomin routes and homepage links.

**Commit:**
```bash
git add src
 git commit -m "feat: strengthen Botox and Xeomin Williamsburg path"
```

---

## Commit 7: PRP hair restoration transplant-comparison bridge

**Objective:** Match transplant-adjacent searches with a compliant PRP alternative page.

**Files:**
- Modify: PRP hair restoration procedure source/config.
- Optional add asset: privacy-safe hair consultation image.

**Copy direction:**
- Make it clear this is PRP hair restoration / non-surgical hair support.
- Add a comparison section:
  - `If you are comparing hair transplant options`
  - `What PRP can and cannot do`
  - `When to talk to a specialist`
- Avoid pretending the practice performs transplant surgery.

**Verification:**
- `pnpm audit:public-copy`
- `pnpm lint`
- `pnpm build`
- Rendered smoke for `/procedures/prp-hair-restoration` and forbidden-claim scan.

**Commit:**
```bash
git add src public
 git commit -m "feat: position PRP hair restoration as non-surgical support"
```

---

## Commit 8: Internal-link and schema cleanup pass

**Objective:** Help Google choose the correct page for each BOFU query and make the site easier for patients to navigate.

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/views/procedures.tsx`
- Modify: relevant procedure template/data/schema files.
- Modify: sitemap/metadata helpers only if needed.

**Implementation notes:**
- Homepage should link to every priority service using descriptive local anchor text.
- Procedure index should expose priority services above less relevant products.
- Service pages should link back to the homepage/location and related service pages where useful.
- FAQ schema should match visible copy only.
- Do not add fake FAQ/schema blocks that are not visible on page.

**Verification:**
- `pnpm audit:public-copy`
- `pnpm lint`
- `pnpm build`
- Local rendered HTML smoke for homepage and priority procedure pages:
  - one H1
  - self-canonical
  - expected internal links
  - FAQ/schema only when visible and truthful

**Commit:**
```bash
git add src
 git commit -m "feat: tighten BOFU internal links and schema"
```

---

## Commit 9: Client-safe implementation summary and monitoring plan

**Objective:** Leave a clear client-safe checkpoint and measurement plan for 7/14/28-day follow-up.

**Files:**
- Modify: `artifacts/seo-research/williamsburgmedspa.com/2026-06-04-bofu-gsc-refresh/client-safe-summary.md`
- Create: `docs/plans/2026-06-04-williamsburg-bofu-monitoring.md`

**Summary should include:**
- What changed by URL.
- What searches each change was meant to support.
- What not to overreact to in week one.
- 7/14/28-day GSC checks:
  - homepage CTR for `medical spa williamsburg`
  - service-page impressions/clicks for ear piercing, fillers, PRP breast lift, Botox/Xeomin, hair restoration
  - whether Google starts sending filler/Botox queries to the intended pages instead of the homepage.

**Verification:**
- `pnpm audit:public-copy`
- `pnpm lint`
- `pnpm build`
- `git diff --stat`

**Commit:**
```bash
git add artifacts/seo-research/williamsburgmedspa.com/2026-06-04-bofu-gsc-refresh/client-safe-summary.md docs/plans/2026-06-04-williamsburg-bofu-monitoring.md
 git commit -m "docs: add Williamsburg BOFU monitoring handoff"
```

---

## Final PR verification

Run:

```bash
pnpm audit:public-copy
pnpm lint
pnpm build
```

Then run a local browser or curl smoke for:

- `/`
- `/procedures/blomdahl-ear-piercing`
- `/procedures/filler`
- `/procedures/prp-breast-lift`
- `/procedures/botox`
- `/procedures/xeomin`
- `/procedures/prp-hair-restoration`

Check each for:

- HTTP 200
- one H1
- title/meta rendered as intended
- canonical URL
- visible booking CTA
- no em dash in public copy
- no forbidden medical claim
- mobile first screen still feels usable

After PR deploy:

- Smoke Vercel preview with protection bypass if available.
- If merged, smoke production with `Cache-Control: no-cache`.
- Record production URLs and commit SHAs in the PR closeout, not in long-term memory.

---

## Open questions before photo-heavy commits

1. Does Jenny want to actively promote Hydrafacial or laser hair removal? If no, keep them deferred.
2. What exact age policy should we state for Blomdahl ear piercing?
3. Are Botox and Xeomin both offered and intended to be promoted, or should Xeomin be the primary neuromodulator with Botox as search-language support?
4. Are there approved real clinic/provider photos? Use those before generating lifestyle imagery.
5. If generated imagery is needed, review contact sheets before wiring final assets into pages.
