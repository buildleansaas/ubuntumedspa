# Ear Piercing Subpages Indexing & SEO Readiness Report
**Date:** 2026-05-24
**Data sources:** Repo inventory + live crawl signals from main site (public crawlability + rendered HTML where accessible) + markdown analysis. Full GSC URL Inspection + query-gap run recommended next (pull credentials from Vercel obsidian-vault-secrets and run `gsc-query-gap-workflow` focused on "ear piercing" / "blomdahl" / "pediatric" / "baby" cluster). No private GSC data used here.

**Overview**
- ~12 related surfaces identified (main hub + 8+ MDX intent pages + dynamic /for/* and /near/* variants from sitemap.ts and ear-piercing-intents lib).
- Main hub (/procedures/blomdahl-ear-piercing) and several supporting pages (cost, vs-mall, re-piercing, pediatric-nurse) have reasonable visibility.
- **Baby page** (the one flagged by client) was a short unpublished draft; we heavily revised it (~950 words, checklists, detailed safety/aftercare/FAQ, E-E-A-T, local signals, strong internal linking, published). It is now a solid campaign starter but can still receive visual QA and schema addition.
- **Lacking SEO / not-yet-indexed (or weak signals):** Approximately **6-7** pages fall into "improve_first" or "monitor_only". They are typically 400-700 words, list-heavy, good for supporting intent but thin on unique parent stories, tables, comparison data, dedicated pediatric depth, schema (FAQPage/Service), and cross-links from homepage/jumbotron/procedures. Many likely show as "Discovered - currently not indexed" in GSC until they earn more internal links, backlinks, or direct submissions after deepening.
  - Examples: baby (now improved), some /for/ variants, older legacy MDX with redirects, hypoallergenic, certain cost/re-piercing pages if not deepened.
- **Stronger ones (submit_now or monitor):** Main hub, children's-first, medical-vs-mall, pediatric-nurse — these have better E-E-A-T ties to Jenny's CPNP credentials and link well.

**Prioritized Buckets (SEO Indexing Readiness)**
- **Submit now / Monitor (2-3 pages):** Main hub, well-linked published pages with impressions potential. Ensure sitemap inclusion and internal links from procedures/home.
- **Improve first (5-6 pages — priority for this campaign):** Baby (revised but can add schema/table), cost, re-piercing, hypoallergenic, some near/for variants. Add depth (tables, checklists,  more FAQs, pediatric-specific examples), schema, internal links from hub/home/jumbotron, unique local content. These are the ones "lacking SEO wise".
- **Technical or low-value:** Legacy redirects (e.g. blohmdahl misspell) are handled in next.config.mjs — no action needed. Avoid bloating sitemap with every variant until proven.

**Recommendations for Beefing Up Lacking Pages (marketing/SEO lens)**
We used `seo-audit`, `ai-seo-page-audit`, `seo-indexing-readiness-audit`, `content-strategy`, and local-med-spa patterns. Focus on parent trust, safety, local intent, E-E-A-T (Jenny's pediatric NP credentials), scannable format, and funnel to booking/consult.

**Already Beefed in this update (pushed to the open PR):**
- **baby-ear-piercing-williamsburg-va.mdx**: Expanded from draft stub to ~950-word campaign hub with checklist, detailed sections, 8+ FAQ, age guidelines, aftercare steps, comparison cues, strong CTAs, local area mentions, internal links to all related pages. Title/description optimized naturally. Ready for schema FAQPage addition and visual QA.

**Quick wins for remaining lacking pages (next 1-2 slices):**
1. **ear-piercing-cost-williamsburg-va.mdx** (currently short/list-heavy): Add pricing table (per ear, packages, what's included), pediatric-specific cost notes, comparison vs mall/retail, FAQ schema, parent checklist for "what to ask". Target "ear piercing cost Williamsburg" + long-tails. ~300-400 word addition.
2. **medical-ear-piercing-vs-mall-piercing.mdx** and **hypoallergenic-ear-piercing-sensitive-skin.mdx**: Add side-by-side table (sterility, jewelry, setting, aftercare, suitability for babies), Jenny's CPNP perspective, parent testimonials (sanitized), before/after safety stats if available, stronger links to baby/children pages.
3. **ear-re-piercing-williamsburg-va.mdx** and dynamic /for/children, /for/re-piercing**: Ensure each has unique 500+ word depth, age-specific advice for pediatric re-piercing, schema, and bidirectional links to the hub and baby page.
4. **Main hub + sitemap/intents**: Add a pediatric section/banner linking to the new baby page. Ensure all variants are in sitemap only after deepening (avoid thin programmatic bloat).

**Measurement Plan**
- GSC: Watch impressions/CTR/position for "baby ear piercing", "pediatric ear piercing williamsburg", "blomdahl babies", cost/re-piercing variants. Track clicks to /consult.
- GA4/Calls: Booking events, phone clicks from new content.
- Indexing: Re-inspect key URLs in GSC after merge; monitor coverage report.
- Review windows: 7/14/28 days post-merge. Use `seo-indexing-readiness-audit` rerun after changes.

**Next Actions**
- Review updated baby page in PR preview (https://github.com/buildleansaas/ubuntumedspa/pull/35).
- Merge green slice.
- Run full GSC query-gap + DataForSEO/KE for the entire cluster (I can execute once credentials confirmed).
- Beef up the 2-3 highest-priority lacking pages in follow-up small PRs (one at a time per established pattern).
- GBP optimization for pediatric piercing posts/photos/reviews as campaign amplifier.

All changes are in the existing ear-piercing campaign PR/branch. The baby page is now substantially stronger and campaign-ready. Let me know which specific subpage to tackle next or if you want the full GSC pull/indexing CSV generated now.

Artifacts written to `artifacts/seo-indexing/ear-piercing-subpages-2026-05-24/`. (Full CSV with per-page status available on request or in next run.)