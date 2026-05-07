# Ear Piercing Local SEO Strategy

## Goal

Own high-intent searches for medical ear piercing, children's ear piercing, hypoallergenic ear piercing, and Blomdahl ear piercing across Williamsburg and the practical 30-mile service radius.

## Current Base

- Strong core procedure page: `/procedures/blomdahl-ear-piercing`
- Existing local authority pages: `/locations/*`
- New scalable page type: `/procedures/blomdahl-ear-piercing/near/[areaSlug]`
- New intent page type: `/procedures/blomdahl-ear-piercing/for/[intentSlug]`
- Shared service-area data source: `src/lib/local-service-areas.ts`
- Shared intent data source: `src/lib/ear-piercing-intents.ts`
- Published/draft control for local pages so weaker areas stay out of the sitemap until they deserve indexing.
- Published/draft control for intent pages so baby-specific content stays unpublished until age and consent policy are confirmed.

## Page Architecture

Use a hub-and-spoke model:

- Hub: `/procedures/blomdahl-ear-piercing`
- Local spokes: `/procedures/blomdahl-ear-piercing/near/williamsburg-va`, `/near/yorktown-va`, etc.
- Intent spokes: `/procedures/blomdahl-ear-piercing/for/children`, `/for/sensitive-ears`, `/for/re-piercing`
- Supporting location pages: `/locations/williamsburg-va`, `/locations/newport-news-va`, etc.
- Blog support: answer broader parent and aftercare questions, then link back to the hub.

The local spokes should target service-plus-place intent. They should not be generic city swaps. Each page needs at least one real local angle: parent intent, route context, nearby neighborhoods, or why the medical setting matters for that area.

## Priority Areas

Tier 1:

- Williamsburg
- James City County
- Yorktown
- Newport News
- Toano
- Norge
- Lightfoot
- New Town
- Kingsmill
- Ford's Colony

Tier 2:

- Gloucester
- West Point
- Poquoson

Keep Tier 2 as draft until Search Console shows impressions for nearby markets, real patients mention those areas, or each page has stronger local proof and a clear reason to exist.

## Keyword Clusters

Primary:

- ear piercing Williamsburg VA
- medical ear piercing Williamsburg VA
- children's ear piercing Williamsburg VA
- Blomdahl ear piercing Williamsburg

Area modifiers:

- ear piercing near Yorktown VA
- children's ear piercing near Newport News
- medical ear piercing James City County
- hypoallergenic ear piercing near Toano

Concern modifiers:

- sensitive skin ear piercing
- nickel free ear piercing
- first ear piercing for kids
- pediatric nurse ear piercing
- Blomdahl medical plastic earrings
- medical grade titanium starter earrings
- sterile ear piercing
- ear re-piercing

## Content That Should Come Next

1. Add real photos when available: clinic room, piercing jewelry, aftercare setup, exterior/parking, and Jenny with the piercing setup.
2. Add official Blomdahl product imagery only if licensed or provided by Blomdahl. Do not fake product or certification photos with AI images.
3. Use AI-generated images only for generic editorial support, such as a parent-child consultation scene, never for actual jewelry, certificates, sterile equipment, or before/after proof.
4. Add reviews/testimonials that mention children, sensitive skin, sterile process, or gentle experience.
5. Track calls and consults from local and intent pages through UTM campaign values.
6. Recheck Search Console after launch for ear-piercing impressions, CTR, indexed pages, and new local modifiers.

## Blomdahl Proof Points

Use the correct spelling: Blomdahl.

Prioritize these differentiators in service, local, and support pages:

- Medical ear piercing system.
- Sterile disposable piercing cassettes/products.
- Hypoallergenic starter jewelry options.
- Medical Plastic and Medical Grade Titanium options.
- Blomdahl Medical Plastic described by Blomdahl as 0% nickel.
- Appointment-based clinic setting with Jenny Coleman, MSN, RN, CPNP, PMHS.
- Pediatric-aware care that is useful for children and for any patient who wants a calm, careful appointment.

## Publishing Rules

- Publish: children, sensitive ears, re-piercing.
- Keep draft: baby ear piercing until minimum age, consent, vaccination/timing guidance, and public positioning are confirmed by Jenny.
- Keep draft: any city page that does not have enough local specificity or practical service relevance.
- Redirect old `/procedures/blomdahl-ear-piercing` URLs to the corrected Blomdahl slug.

## Guardrails

- Do not create hundreds of city pages.
- Do not publish local pages for areas outside a practical appointment radius.
- Do not claim a physical location in cities where the clinic does not have one.
- Use "near" language for surrounding towns and be explicit that the clinic is in Williamsburg.
- Keep medical claims conservative: sterile process, hypoallergenic materials, aftercare, consultation, and healing expectations.
