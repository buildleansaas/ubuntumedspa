# Complete Pediatric Ear Piercing Campaign – Master Plan
**Status:** PR #35 merged. Current branch: `complete-pediatric-ear-piercing-campaign` (clean rebase from main post-merge). All previous work (baby page expansion, main description updates with "babies", indexing report, jumbotron/procedures tweaks) is now in main.

**Goal:** Finish **completely and entirely properly** at highest quality. Every subpage deepened, full keyword research (DataForSEO + KE), GSC deep dive, schema on all pages (validated on rendered HTML), visual/creative QA, GBP optimization, internal linking audit, measurement instrumentation, final indexing readiness report, launch content, and Obsidian/GitHub canonical notes. No half-measures — every lacking page addressed, all signals strengthened for Local Pack + organic dominance on pediatric/baby queries.

**Inventory of Ear Piercing Surfaces (from repo + sitemap.ts + ear-piercing-intents)**
- Main hub: /procedures/blomdahl-ear-piercing (dynamic from commerce-catalog + views)
- baby-ear-piercing-williamsburg-va.mdx (heavily expanded in merged PR — campaign anchor)
- pediatric-nurse-ear-piercing-williamsburg-va.mdx
- childrens-first-ear-piercing-williamsburg-va.mdx
- ear-piercing-cost-williamsburg-va.mdx (needs table + pediatric depth)
- ear-re-piercing-williamsburg-va.mdx
- medical-ear-piercing-vs-mall-piercing.mdx (needs comparison table)
- hypoallergenic-ear-piercing-sensitive-skin.mdx
- medical-ear-piercing-in-williamsburg-va-blohmdahl.mdx (legacy, redirected)
- Dynamic variants: /for/children, /for/re-piercing, /for/sensitive-ears, /near/williamsburg-va, /near/james-city-county-va, etc.
- Supporting: blog posts linking to these, sitemap entries, commerce catalog entry.

**Current State (post-merge)**
- Baby page: Now ~950 words, checklists, FAQ, E-E-A-T, CTAs, links — strong but can receive schema, table, visual QA.
- 6–7 other subpages: Lacking depth (thin lists, limited pediatric specificity, inconsistent schema, weak cross-linking). Most likely "improve_first" or "Discovered not indexed" until signals improved.
- Main descriptions updated with "babies".
- Indexing report artifact created.

**Prioritized Completion Slices (one-at-a-time where possible, grouped for efficiency while maintaining quality gates)**
Follow `one-by-one-gsc-seo-task-ladder`, `local-med-spa-seo-slice-sequence`, `seo-indexing-readiness-audit`, `ai-seo-page-audit`, `content-strategy`, and Vercel best practices. Every slice includes:
- Rendered HTML verification (title, H1 count, canonical, JSON-LD via browser_console, visible content).
- Build + preview smoke (Vercel URL extracted from bot or `vercel` CLI).
- GSC URL Inspection where possible.
- Mobile/visual QA (browser_vision or screenshots).
- No stash — dedicated worktree if needed.
- Plan note updated with evidence, before/after, measurement.

**Slice 1: Full Keyword Research & GSC Deep Dive (foundational — do first)**
- Pull DATA_FOR_SEO_API_KEY and KEYWORDS_EVERYWHERE_API_KEY safely from Vercel obsidian-vault-secrets + vault notes.
- Run DataForSEO + KE on full cluster ("baby ear piercing williamsburg", "pediatric ear piercing", long-tails, cost, re-piercing, hypoallergenic, vs mall, near me variants).
- Run `gsc-query-gap-workflow` on the property for "ear piercing" / "blomdahl" / "pediatric" / "baby" pages/queries (impressions, CTR gaps, cannibalization, near-wins).
- Output: artifacts/seo-research/ear-piercing-full-cluster/ with CSVs, scored opportunities, execution queue, client summary.
- Update master plan with prioritized pages from data.
- Verification: Raw data artifacts committed, no keys printed.

**Slice 2–4: Beef-Up Remaining Lacking Subpages (3 focused PRs)**
- Prioritize: cost page (add pricing table, pediatric notes, FAQ schema), medical-vs-mall (comparison table, safety data), hypoallergenic + re-piercing (checklists, baby-specific sections).
- For each: Expand to 800+ words where needed, add tables/checklists/FAQ, E-E-A-T paragraphs, internal links to baby page + hub, visible schema (use browser to validate rendered JSON-LD).
- Use `ai-seo-page-audit` on each live/preview URL before finalizing.
- One PR per 1–2 pages to keep reviewable.
- Verification per slice: rendered checks, preview URL, word count, schema presence, no overflow, GSC re-inspect list.

**Slice 5: Schema, Technical & Indexing Polish**
- Add/validate FAQPage + Service + LocalBusiness schema on all pages (match visible content only — use browser_console('document.querySelectorAll("script[type=\\"application/ld+json\\"]")') + Rich Results Test).
- Rerun `seo-indexing-readiness-audit` on full sitemap + known URLs → new CSV with submit_now queue.
- Fix any canonical, robots, sitemap, or thin-content issues.
- Ensure all variants have self-canonical, internal links from hub/home/jumbotron, and are not orphaned.
- Verification: Browser snapshot for each key URL, GSC coverage report notes, final indexing CSV.

**Slice 6: Visual, Creative & GBP Campaign Layer**
- QA all images (baby page + others) — generate additional safe consult/lifestyle rasters if needed (high-quality Codex, preserve alpha, contact sheet for review, per memory guidelines for med-spa imagery).
- Use `creative` or `image_generate` skills for any missing assets (Jenny-like, obscured, lifestyle/consult only).
- Optimize GBP: add ear piercing category, pediatric-focused posts, safe photos (setup, jewelry, consults — no explicit baby piercings), Q&A, review prompts.
- Verification: Screenshots via browser_vision, GBP live checks, image alt/src validation.

**Slice 7: Internal Linking, Measurement & Launch**
- Audit and add contextual links from homepage, procedures, blog, other services to the full cluster (especially baby page as campaign anchor).
- Add GA4/events for booking clicks from these pages, phone events, consultation conversions.
- Create launch content (social posts, email digest if applicable, Obsidian note for shared ops).
- Final full-cluster indexing report + GSC pulse.
- Update canonical Obsidian vault entry and GitHub issue if exists.

**Slice 8: Final Verification & Handover**
- End-to-end crawl of all pages (status, canonical, schema, word count, links).
- Production smoke on merged URLs (no-cache curl for rendered markers).
- 7/14/28-day monitoring plan documented.
- Client summary for adubs (concise, with receipts, preview/production URLs, next autonomous actions).
- Close the campaign thread or move to #work-queue + Linear/GitHub if needed.

**Quality Gates for "Highest Quality" & "Completely and Entirely Properly"**
- Every edited page: rendered HTML validation (title, one H1, canonical, JSON-LD count/types, visible baby/pediatric content, no raw frontmatter).
- No thin pages left in sitemap.
- All changes source-controlled with evidence artifacts.
- Measurement before claiming success (GSC + calls/bookings).
- Visual QA on every page (browser or screenshots).
- E-E-A-T, truthfulness, safety disclaimers on all pediatric content.
- One-slice discipline maintained where possible; roadmap prevents scope creep.
- No secrets, no broad refactors mixed in.

**Resources & Tools to Use**
- Skills: All previously loaded (seo-*, gsc-*, ai-seo-page-audit, content-strategy, github-pr-workflow, creative for images, obsidian for vault sync).
- Browser tools for rendered schema/ visual QA.
- Terminal for git, build smoke, curl verification.
- execute_code for any batch analysis or validation scripts.
- Memory: Safe imagery rules, one-PR slices, GSC/KE/DataForSEO validation before scaling, pediatric NP emphasis without private details.

**Estimated Slices:** 8 (can be parallelized where independent).

This branch is now the control plane for completion. I have committed the initial master plan artifact. Review the merged PR #35 in production, confirm the baby page and report, then tell me to start Slice 1 (keyword/GSC research) or any specific page.

All previous work is merged. The campaign is on track to be finished completely and at the highest quality. What's the first slice you'd like me to execute now? (I will use tools immediately to begin.)