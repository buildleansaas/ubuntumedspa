# OH-Shot + Urinary Incontinence SEO Task

Status: ready for implementation  
Created: 2026-05-08  
Primary owner: Codex / implementation agent  
Site: `https://www.williamsburgmedspa.com`

## Goal

Build a high-quality, brand-forward OH-Shot SEO cluster around urinary incontinence, bladder leakage, stress incontinence, vaginal dryness, and related intimate wellness concerns.

The work should make Williamsburg Med Spa look like the local Williamsburg-area OH-Shot and PRP intimate wellness authority while staying medically responsible. The voice should feel confident and pioneering, not timid, but it should not promise cures or imply that another provider's claims become ours simply because we cite them.

## Current Repo State

The repo already has a useful foundation:

- Main procedure page: `/procedures/oh-shot`
- Urinary incontinence subpage: `/procedures/oh-shot/for/urinary-incontinence`
- Existing OH-Shot blog post: `/blog/oh-shot-for-vaginal-dryness-what-to-know`
- Old `feminine-intimacy-prp-protocols` URLs redirect to OH-Shot URLs in `next.config.mjs`
- CMA credential component already exists: `src/components/cma-credential-strip.tsx`
- OH-Shot procedure data already exists in `src/data.ts`
- OH-Shot ailment MDX files already exist under `src/markdown/ailments/oh-shot/`

Important: do not remove the old feminine-intimacy redirects. They preserve migration value and GSC history.

## Source And Authority Strategy

Use Runels/CMA/OH-Shot as the main brand authority:

- Official OH-Shot site: `https://www.o-shot.org/`
- Official OH-Shot provider/member site: `https://oshot.info/members/`
- Official OH-Shot provider directory: `https://oshot.info/members/directory/`
- CMA site: `https://cellularmedicineassociation.org/`
- CMA procedures page: `https://cellularmedicineassociation.org/procedures/`
- OH-Shot provider agreement / trademark context: `https://oshot.info/members/agreement/`

How to use those sources:

- Say Jenny is a Cellular Medicine Association-trained/certified OH-Shot provider where already supported by site copy/assets.
- Use `OH-Shot` on the site. Do not add a registered-trademark mark to the new name.
- Reference Runels/CMA as the origin/training/protocol authority for the branded procedure.
- Link to official OH-Shot/CMA pages sparingly from authority sections, not repeatedly from every paragraph.
- Do not drive users away in CTAs. The conversion path remains Williamsburg Med Spa consult pages.

Claims guardrail:

- Do not say citations let us "enjoy the umbrella" of Runels' claims without risk.
- Do not say OH-Shot is FDA-approved.
- Do not guarantee resolution of urinary incontinence, orgasm, libido, dryness, pain, or lichen sclerosus.
- Do not say "cures," "fixes," "eliminates," "reverses," or "guaranteed."
- Preferred framing: "may support," "may be discussed," "for select patients," "part of a broader plan," "consultation determines candidacy."

Medical comparison sources can be used only where helpful for balanced treatment context. The plan should not center Mayo. If a medical baseline is needed, prefer concise references to NIDDK, Urology Care Foundation, AUA/AUGS, FDA, or product official pages for competitor/device facts.

## Keyword Findings

Keywords Everywhere metrics gathered on 2026-05-08. Query strings below are the historical searches that were measured, including the previous O-Shot spellings. The procedure name on the site is OH-Shot.

### OH-Shot Core

| Keyword | Volume | CPC | Notes |
| --- | ---: | ---: | --- |
| `o shot` | 18,100 | $1.84 | Main national brand keyword |
| `o-shot` | 18,100 | $1.84 | Same intent, hyphen variant |
| `oshot` | 5,400 | $1.42 | No-hyphen variant |
| `o shot near me` | 2,400 | $1.90 | High local intent |
| `o shot cost` | 480 | $1.44 | Commercial intent |
| `o shot before and after` | 880 | $0.82 | Needs careful expectation language |
| `o shot reviews` | 480 | $1.02 | Trust/reputation angle |
| `o shot for urinary incontinence` | 70 | $2.66 | Low volume, high relevance |

### Urinary Incontinence / Bladder Leakage

| Keyword | Volume | CPC | Notes |
| --- | ---: | ---: | --- |
| `overactive bladder treatment` | 74,000 | $0.89 | Broad, not all OH-Shot fit |
| `urinary incontinence` | 49,500 | $0.98 | Broad educational |
| `urinary incontinence treatment` | 8,100 | $1.28 | Core support page intent |
| `stress incontinence treatment` | 8,100 | $1.08 | Best OH-Shot overlap |
| `stress urinary incontinence treatment` | 3,600 | $1.06 | Best subpage/blog intent |
| `bladder leakage` | 9,900 | $1.00 | Patient language |
| `bladder leakage treatment` | 1,000 | $1.20 | Good article/support section |
| `leaking urine when coughing` | 720 | $0.70 | Good symptom-led H2 |
| `urinary incontinence treatment near me` | 40 | $2.22 | Low volume, high local intent |

### Competitor / Alternative Bridges

| Keyword | Volume | CPC | Notes |
| --- | ---: | ---: | --- |
| `purewick` | 110,000 | $1.89 | Huge product-awareness bridge |
| `purewick at home` | 14,800 | $0.46 | At-home management intent |
| `purewick catheter` | 12,100 | $1.95 | Product comparison intent |
| `purewick reviews` | 320 | $7.92 | High commercial value |
| `incontinence supplies` | 8,100 | $2.05 | Supplies vs treatment bridge |
| `adult diapers` | 49,500 | $1.38 | Sensitive, avoid shaming |
| `diaper delivery` | 480 | $4.39 | Local/supportive comparison angle |
| `emsella` | 6,600 | $2.15 | Procedure comparison |
| `emsella near me` | 480 | $1.42 | Local competitor procedure intent |
| `bladder sling surgery` | 4,400 | $0.16 | Surgery alternative education |
| `bulkamid` | 9,900 | $0.94 | Urology alternative |
| `urethral bulking` | 1,000 | $1.23 | Urology alternative |
| `pessary for incontinence` | 1,600 | $0.43 | Conservative care comparison |

GSC finding:

- Last 90 days had almost no OH-Shot traction.
- Relevant impressions included `pelvic pain williamsburg` on the old feminine-intimacy URL and one `o-shot near me` impression on the vaginal dryness blog post.
- Treat this cluster as greenfield, not a current near-win.

## Implementation Queue

Complete in this order. Each item should be committed separately or as small logical batches.

### 1. Create this task tracker

File already created:

- `docs/oh-shot-urinary-incontinence-seo-task.md`

Acceptance:

- The doc exists.
- It includes keyword data, page queue, claim policy, internal linking rules, and verification checklist.

### 2. Upgrade main OH-Shot procedure page

Primary file:

- `src/data.ts`

Target URL:

- `/procedures/oh-shot`

Edits:

- Retitle SEO title to target: `OH-Shot in Williamsburg, VA | PRP Intimate Wellness`
- Rewrite meta description around: OH-Shot, Williamsburg VA, PRP, intimate wellness, bladder leakage, dryness, sensitivity.
- Rewrite H1/headline/subline to be brand-forward:
  - Mention `OH-Shot`
  - Mention CMA-certified provider context
  - Mention PRP intimate wellness
  - Mention bladder leakage support without making it the only promise
- Add stronger copy for:
  - `OH-Shot near me`
  - `OH-Shot cost`
  - candidacy
  - what symptoms bring patients in
  - why certified protocol/provider matters
- Keep the tone discreet, premium, and medically grounded.
- Link internally via existing related article/procedure systems, not raw JSX inside `data.ts`.

Acceptance:

- The OH-Shot page clearly targets `o shot`, `o-shot`, `o shot near me`, and `o shot williamsburg va`.
- The page makes urinary leakage visible above or near the fold.
- The page does not say FDA-approved, cure, fix, eliminate, or guaranteed.
- CMA credential strip still renders on the OH-Shot page.

### 3. Add OH-Shot featured guide block

Primary file:

- `src/app/procedures/[slug]/page.tsx`

Edits:

- Add `oh-shot` to `featuredGuideSlugs`.
- Add `featuredGuideCopy.oh-shot`.
- Featured guide should point to `/blog/oh-shot-for-urinary-incontinence-williamsburg-va` after that post exists.

Acceptance:

- `/procedures/oh-shot` shows a featured guide CTA after article creation.
- Link label uses natural text such as `Read the OH-Shot urinary incontinence guide`.

### 4. Upgrade urinary incontinence subpage

Primary file:

- `src/markdown/ailments/oh-shot/urinary-incontinence.mdx`

Target URL:

- `/procedures/oh-shot/for/urinary-incontinence`

Rewrite goals:

- Target `o shot for urinary incontinence`, `stress incontinence treatment`, `stress urinary incontinence treatment`, `bladder leakage treatment`, `leaking urine when coughing`, and `urinary incontinence treatment near me`.
- Add clear sections:
  - Stress vs urge vs mixed incontinence
  - Why stress leakage is the strongest OH-Shot conversation
  - Where PRP/OH-Shot may fit
  - What OH-Shot is not meant to replace
  - How Jenny screens candidacy
  - Williamsburg-area discreet consult framing
- Add Runels/CMA authority note:
  - Use official OH-Shot/CMA references as protocol authority.
  - Keep language concise and non-diversionary.

Acceptance:

- Page reads as a real, local, medically careful service page.
- Page does not overclaim for urge incontinence or overactive bladder.
- It clearly routes users to consultation.
- It links to `/procedures/oh-shot`, `/consult`, and the new urinary incontinence blog post once created.

### 5. Create cornerstone blog: OH-Shot for urinary incontinence

New file:

- `src/markdown/oh-shot-for-urinary-incontinence-williamsburg-va.mdx`

Target URL:

- `/blog/oh-shot-for-urinary-incontinence-williamsburg-va`

Metadata:

- title: `OH-Shot for Urinary Incontinence in Williamsburg, VA`
- slug: `oh-shot-for-urinary-incontinence-williamsburg-va`
- tags: `["OH-Shot", "Urinary Incontinence", "Bladder Leakage", "Sexual Health", "Williamsburg Med Spa", "PRP Therapy"]`
- image: `/procedure/grapefruit.jpg`
- authorName/reviewedBy: `Jenny Coleman`
- published: true

Article structure:

- H1: `OH-Shot for Urinary Incontinence in Williamsburg, VA`
- Quick answer
- What kind of leakage are we talking about?
- Stress leakage vs urge leakage
- How the OH-Shot may fit
- Why certified OH-Shot protocol matters
- When pelvic floor therapy or urology should come first
- What to ask during consultation
- Local Williamsburg perspective
- Bottom line
- Sources

Internal links:

- `/procedures/oh-shot`
- `/procedures/oh-shot/for/urinary-incontinence`
- `/blog/oh-shot-for-vaginal-dryness-what-to-know`
- `/consult`
- `/locations/williamsburg-va`

Acceptance:

- 1,500-2,200 words.
- Contains FAQ metadata.
- Has exact `OH-Shot` tag so it appears on the OH-Shot procedure page.
- Uses Runels/CMA as brand authority while keeping medical claims owned and cautious.

### 6. Create PureWick comparison article

New file:

- `src/markdown/oh-shot-vs-purewick-for-bladder-leakage.mdx`

Target URL:

- `/blog/oh-shot-vs-purewick-for-bladder-leakage`

Primary keywords:

- `purewick`
- `purewick at home`
- `purewick catheter`
- `purewick reviews`
- `purewick vs diapers`
- `bladder leakage treatment`
- `o shot for bladder leakage`

Angle:

- PureWick is an at-home urine collection/management product.
- OH-Shot is an in-office PRP procedure conversation for select patients.
- Do not frame as "PureWick bad." Frame as management vs treatment conversation.

Article structure:

- H1: `OH-Shot vs PureWick for Bladder Leakage`
- Quick answer
- What PureWick is for
- What OH-Shot is for
- At-home management vs in-office regenerative procedure
- Who should not delay medical evaluation
- Williamsburg consultation path
- Sources

Acceptance:

- 1,300-1,900 words.
- Respectful language for people using catheters, pads, underwear, or supplies.
- No claim that OH-Shot replaces needed catheter/supply use.
- Links to OH-Shot hub and urinary incontinence subpage.

### 7. Create Emsella comparison article

New file:

- `src/markdown/oh-shot-vs-emsella-for-urinary-incontinence.mdx`

Target URL:

- `/blog/oh-shot-vs-emsella-for-urinary-incontinence`

Primary keywords:

- `emsella`
- `emsella near me`
- `emsella cost`
- `emsella for incontinence`
- `o shot vs emsella`
- `o shot for urinary incontinence`

Angle:

- Emsella is device/energy-based pelvic floor stimulation.
- OH-Shot is PRP/protocol-based tissue support.
- They are not interchangeable. The right question is whether symptoms are more pelvic-floor-strength dominant, tissue-quality dominant, or mixed.

Acceptance:

- 1,300-1,900 words.
- Do not claim to offer Emsella unless the repo/business actually does.
- Page should capture comparison searchers and route to an OH-Shot consult.

### 8. Create stress incontinence treatment options article

New file:

- `src/markdown/stress-incontinence-treatment-options-williamsburg-va.mdx`

Target URL:

- `/blog/stress-incontinence-treatment-options-williamsburg-va`

Primary keywords:

- `stress incontinence treatment`
- `stress urinary incontinence treatment`
- `leaking urine when coughing`
- `leaking urine when sneezing`
- `urinary incontinence treatment near me`
- `bladder leakage treatment`

Angle:

- Patient-friendly treatment landscape.
- Include pelvic floor therapy, bladder training, pessary, urethral bulking/Bulkamid, sling surgery, supplies, and OH-Shot consult.
- OH-Shot should be presented as one option to discuss when tissue quality, dryness, sensitivity, childbirth, or menopausal changes overlap with mild stress leakage.

Acceptance:

- 1,600-2,300 words.
- Most broadly useful article in the cluster.
- Strong internal links into OH-Shot hub and urinary subpage.

### 9. Optional later articles

Do not do these in the first implementation batch unless explicitly requested:

- `/blog/oh-shot-cost-williamsburg-va`
- `/blog/oh-shot-before-and-after-expectations`
- `/blog/oh-shot-reviews-what-to-ask-before-booking`
- `/blog/oh-shot-for-vaginal-dryness-vs-moisturizers`
- `/blog/oh-shot-and-lichen-sclerosus-williamsburg-va`
- `/blog/diaper-delivery-vs-bladder-leakage-treatment-options`

## Internal Linking Rules

Every new OH-Shot/incontinence article must link to:

- `/procedures/oh-shot`
- `/procedures/oh-shot/for/urinary-incontinence`
- `/consult`
- `/locations/williamsburg-va`

Use exact or near-exact anchors naturally:

- `OH-Shot in Williamsburg, VA`
- `OH-Shot for urinary incontinence`
- `bladder leakage consultation`
- `Williamsburg location`

Every new article must include `OH-Shot` in metadata tags so the procedure page related-article block picks it up.

Every new comparison article should link laterally to at least one sibling article once both exist:

- PureWick article links to Emsella and stress-incontinence options.
- Emsella article links to PureWick and stress-incontinence options.
- Stress-incontinence article links to PureWick, Emsella, and urinary OH-Shot article.

## Voice Rules

Use:

- confident
- discreet
- medically grounded
- pioneering
- patient-centered
- brand-aware

Avoid:

- apologetic or timid language
- sterile generic medical encyclopedia tone
- shame around leakage, diapers, pads, underwear, catheters, or sex symptoms
- hype-heavy wording like miracle, life-changing, guaranteed, revolutionary cure
- repeated "adjunct" in every paragraph

Preferred sentence pattern:

- "For the right patient, the OH-Shot may belong in the conversation..."
- "The consult should clarify whether the concern is stress leakage, urge leakage, tissue-related discomfort, or a mix."
- "Runels/CMA provide the branded OH-Shot protocol framework; Jenny applies that training in a local, private Williamsburg consultation."

## Verification Checklist

Run after implementation:

- `git diff --check`
- `rg "feminine intimacy|feminine-intimacy" src/markdown src/data.ts`
- `rg "FDA-approved|guaranteed|cure|fixes|eliminates|reverses" src/markdown src/data.ts`
- `rg "OH-Shot" src/markdown/oh-shot*.mdx src/markdown/*incontinence*.mdx`
- `rg "/procedures/oh-shot|/procedures/oh-shot/for/urinary-incontinence|/consult|/locations/williamsburg-va" src/markdown/oh-shot*.mdx src/markdown/*incontinence*.mdx`
- `jarvis-agent-hygiene doctor --root "$PWD"` if available

Optional live checks after push/deploy:

- `curl -I https://www.williamsburgmedspa.com/procedures/oh-shot`
- `curl -I https://www.williamsburgmedspa.com/procedures/oh-shot/for/urinary-incontinence`
- `curl -I https://www.williamsburgmedspa.com/blog/oh-shot-for-urinary-incontinence-williamsburg-va`
- `curl -I https://www.williamsburgmedspa.com/blog/oh-shot-vs-purewick-for-bladder-leakage`
- `curl -I https://www.williamsburgmedspa.com/blog/oh-shot-vs-emsella-for-urinary-incontinence`
- `curl -I https://www.williamsburgmedspa.com/blog/stress-incontinence-treatment-options-williamsburg-va`

Search Console indexing queue after deploy:

1. `https://www.williamsburgmedspa.com/procedures/oh-shot`
2. `https://www.williamsburgmedspa.com/procedures/oh-shot/for/urinary-incontinence`
3. `https://www.williamsburgmedspa.com/blog/oh-shot-for-urinary-incontinence-williamsburg-va`
4. `https://www.williamsburgmedspa.com/blog/oh-shot-vs-purewick-for-bladder-leakage`
5. `https://www.williamsburgmedspa.com/blog/oh-shot-vs-emsella-for-urinary-incontinence`
6. `https://www.williamsburgmedspa.com/blog/stress-incontinence-treatment-options-williamsburg-va`

## Done Definition

This task is done when:

- Main OH-Shot page has been rewritten around OH-Shot/CMA authority and local Williamsburg intent.
- Urinary incontinence subpage is upgraded and internally linked.
- The 4 priority support articles are created, published, tagged, and internally linked.
- Old feminine-intimacy redirects still work.
- No overclaiming terms are present.
- Live URLs return 200 after deployment.
- Indexing queue is ready for manual GSC submission.

