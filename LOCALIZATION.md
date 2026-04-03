# LOCAL SEO & Topical Authority Plan

Location: Williamsburg, Virginia (with nearby localities)
Site: https://www.williamsburgmedspa.com
Stack: Next.js App Router (TypeScript), MDX posts, dynamic procedure pages

This document provides a fully vetted, execution-ready plan to grow organic traffic, improve local (map pack + organic) visibility, and build service-level topical authority around PRP and medical spa services in Williamsburg, VA and nearby areas.

Contents
- Goals & KPIs
- 90‑Day Roadmap
- Detailed Implementation (code + content)
- GBP, Citations, and Local Links
- Measurement & QA
- Editorial Calendar & Topic Map
- Templates & References

---

## Confirmed NAP & Priorities

Business
- Name: Williamsburg Med Spa
- Practitioner: Jenny Coleman
- Phone: +1 (804) 738-9483
- Address: 3900 Powhatan Parkway, Williamsburg, VA 23188
- Hours: Mon–Fri 6:00pm–8:00pm; Sat–Sun 10:00am–6:00pm

Priority services (homepage emphasis and internal link focus)
- Fillers
- PRP for Joints
- O-Shot
- P-Shot
- PRP Facial
- Blohmdahl Ear Piercing

Social profiles (to be provided) will populate sameAs in schema.

---

## Goals & KPIs

Primary goals
- Increase qualified consults and phone calls from organic and GBP.
- Rank top 3 (organic + map pack) for service terms in Williamsburg.
- Build topical authority around PRP and core med spa treatments.

KPIs
- Leads: consult form submissions, tracked phone clicks.
- Rankings: “PRP facial Williamsburg”, “PRP hair restoration Williamsburg”, “med spa Williamsburg”, “Xeomin Williamsburg”, “PRP injections Williamsburg”.
- GBP: calls, direction requests, profile views, photo views.
- Organic: clicks/impressions for Williamsburg queries in Google Search Console.
- Authority: referring domains from local/regional sources.

Guardrails
- No keyword stuffing; natural incorporation of location.
- Medical content accuracy; avoid misleading claims; clearly denote ranges/expectations.
- Unique, location-specific content for each location/service-area page.

---

## 90‑Day Roadmap

Weeks 1–2: Foundations & Fast Wins
- Create a location hub: “Med Spa in Williamsburg, VA” with full NAP, map, directions, parking, neighborhood context, reviews, and service links.
- Add LocalBusiness + Service structured data (JSON-LD) sitewide; keep existing WebPage/Article/FAQ.
- Update titles/H1s/meta to include location on homepage and procedure pages.
- Google Business Profile (GBP) clean-up: categories, services, booking URL with UTM, Q&A, weekly posts, fresh photos.
- Add provider bio page(s) and About with sameAs links.

Weeks 3–6: Service Depth & Internal Links
- Ship/tune 6 core service pages (or tune existing procedures) with Williamsburg copy, rich FAQs, and internal linking.
- Publish 6–8 support articles that answer People Also Ask + cost/timeline intent.
- Launch review flywheel (email/SMS ask) and add a reviews showcase section on the location hub.
- Build core citations and secure 3–5 local backlinks (chamber, partners, sponsorships).

Weeks 7–12: Service Area Expansion & PR
- Add 4–6 high-quality service-area pages (unique copy, directions, local landmarks, proof).
- Continue weekly GBP posts/photos and 2–3 articles/month.
- Earn 5+ additional local backlinks; pitch one local media feature.
- Analyze GSC/GBP, iterate page titles/meta and internal links based on winning queries.

---

## Detailed Implementation

This section maps actions to exact files and patterns in this repo so you can implement surgically.

### 1) Create a Williamsburg Location Hub Page

Path: `src/app/locations/williamsburg-va/page.tsx`

Page contents
- H1: “Med Spa in Williamsburg, VA”
- NAP block (Name, Address, Phone) and hours
- Map embed (Google Maps) and parking/directions
- Neighborhoods served (Williamsburg, James City County, Yorktown, Newport News, Toano, Norge, Lightfoot, New Town, Kingsmill, Ford’s Colony)
- Service overview with links to the 6 core procedures
- Reviews showcase (manual quotes initially or embed)
- FAQ section (export to StructuredData as FAQPage)

Metadata
- Title: “Med Spa in Williamsburg, VA | Williamsburg Med Spa”
- Description: Emphasize PRP and core services; include Williamsburg
- Canonical: `/locations/williamsburg-va`

Schema (JSON-LD)
- Render LocalBusiness (or MedicalBusiness) with full NAP + geo using the details above
- Render FAQPage if FAQs included
- Optionally render BreadcrumbList

Internal linking
- Link from homepage header/footer to the hub
- Link from all procedure pages to the hub
- Link from hub to each procedure and to consult page

Sitemap
- Add the new location URL to `src/app/sitemap.ts`
 
UX details
- Include a “Get Directions” button that opens Google Maps with the address prefilled.
- Add a short parking and landmarks note (e.g., near William & Mary) for quick orientation.
- Use an accordion for FAQs; keep answers concise (≤120 words) for readability.

### 2) Add LocalBusiness, Service, Breadcrumb Structured Data

File: `src/components/structured-data.tsx`

Actions
- Extend current switch to support new types: `LocalBusiness` (or `MedicalBusiness`), `Service`, `BreadcrumbList`.
- Add a small helper to inject sitewide LocalBusiness JSON-LD (via `src/app/layout.tsx`).
- On service/procedure pages, render Service schema with areaServed and provider linking back to the LocalBusiness.

Data inputs (confirmed)
- name: “Williamsburg Med Spa”
- practitioner: “Jenny Coleman” (use as `founder` or `employee` in LocalBusiness if desired)
- telephone: “+1-804-738-9483”
- address: “3900 Powhatan Parkway, Williamsburg, VA 23188, US”
- geo: latitude 37.2707, longitude -76.7075 (replace with precise coordinates for the address when available)
- openingHours: Mon–Fri 18:00-20:00; Sat–Sun 10:00-18:00
- sameAs: Instagram, Facebook, LinkedIn (to be provided)

Usage
- In `src/app/layout.tsx`, render `<StructuredData type="Organization" />` (already) and add `<StructuredData type="LocalBusiness" .../>` with props.
- In `src/app/procedures/[slug]/page.tsx`, render `<StructuredData type="Service" .../>` using procedure name, areaServed, price range if available.
- Update author/person schema in `src/components/structured-data.tsx` to reference “Jenny Coleman”. Optionally include `founder` or `employee` on LocalBusiness to reflect practitioner credentials and bio page URL.

Staff bio page
- Add `src/app/staff/jenny-coleman/page.tsx` and link from the provider callout and LocalBusiness `founder.url`.

### 3) Add a Reusable NAP Component

File: `src/components/nap.tsx`

Props: name, address lines, phone (linkable), hours; optional map embed.
Use this component on the location hub and in the site footer or contact section.

### 4) Homepage Additions Only

Principle
- Do not rewrite or remove existing homepage sections. Only add net‑new blocks that enhance trust, clarity, and conversion without disrupting the current flow.

Additions (visible)
- Provider Callout directly beneath the Jumbotron (see 4a) with rounded portrait and concise bio.
- Optional “Location CTA strip” near the bottom: address, hours, phone, and a “Get Directions” button. This is a slim, single‑row bar that complements the existing footer.
- Optional small “Reviews ribbon” with 2–3 short quotes to add social proof (placed above the footer).

Non‑visible improvements (safe for SEO, no copy change)
- Sitewide LocalBusiness and Person schema (see section 2) rendered via layout.
- Add phone click tracking and consult CTA tracking; no UI change.

Homepage services (no change by default)
- Keep the current grid sourced from `src/data.ts` via `views/procedures.tsx` and `procedure-card.tsx`.
- If later desired, we can add small “Featured” badges or ordering without removing any item, but this is deferred and optional.

### 4a) Provider Callout Section (Homepage)

Goal
- Add a personable, trust-building callout directly under the Jumbotron to introduce our practitioner and support E‑E‑A‑T.

Design
- Component: `src/views/provider-callout.tsx`
- Placement: import and render below `<Jumbotron />` in `src/app/page.tsx`
- Layout: two-column on desktop (portrait left, copy right), stacked on mobile
- Image: `/public/jenny.jpg` using `next/image` with `rounded-full`, `object-cover`, suggested size `w-48 h-48` (md: `w-64 h-64`), `priority` true on homepage
- Alt text: “Portrait of our practitioner” (optionally include name after legal review)
- CTA: “Book a consultation” → `/consult`

Copy (approved baseline; may tweak for tone/brand)
- Heading: Meet Our Aesthetic Nurse Practitioner
- Subheading: Compassionate, evidence‑based care in Williamsburg, VA
- Name/credentials: Jenny Coleman — MSN, RN, CPNP, PMHS
- Body:
  “With 26 years in medicine and six years focused on aesthetics, Jenny blends primary care and mental health expertise with a holistic, patient‑first approach. She combines regenerative PRP therapies, advanced injection techniques, and practical wellness counseling to help patients look and feel their best—naturally.”
- Focus Areas (inline or bullets): Fillers, PRP for Joints, Feminine & Male PRP Protocols, PRP Facial, Medical Ear Piercing (Blohmdahl)
- CTA: Book a Consultation

Schema (JSON-LD)
- Add optional `Person` schema when implementing the callout:
  - `@type: Person`, `name: "Jenny Coleman"`, `jobTitle: "Aesthetic Nurse Practitioner"`, `image: https://www.williamsburgmedspa.com/jenny.jpg`, `affiliation` → `MedicalBusiness` (Williamsburg Med Spa)
- Ensure the existing author reference in `src/components/structured-data.tsx` uses “Jenny Coleman” when implementing the bio page and schema updates.

Content Ops
- Optimize `/public/jenny.jpg` to ~1200px max width (quality 70–80), keep original as source if needed.
- Ensure usage permission and brand style alignment; keep tone warm, professional, and non‑promissory.

Accessibility
- Use descriptive but privacy‑sensitive alt text (e.g., “Our aesthetic nurse practitioner”). Ensure the CTA has visible focus and meets contrast ratios.


### 5) Procedure Page SEO (Titles, H1s, Schema)

Files
- `src/app/procedures/[slug]/page.tsx`: update `generateMetadata` to append “in Williamsburg, VA” to the generated title when appropriate.
- `src/data.ts`: ensure each `procedures[].seo.title` and `description` reflects location intent when natural (e.g., “PRP Facial in Williamsburg, VA”).
- Add `<StructuredData type="Service" .../>` to the procedure page render, mapping `procedure.name`, `areaServed`, and `provider`.

Internal linking
- From each procedure page: link to the consult page, the location hub, and relevant articles.
 - From homepage Procedures section: ensure top 6 priority services are first (Fillers, PRP for Joints, Feminine/Male protocols, PRP Facial, Blohmdahl Ear Piercing). The `/procedures` page should continue to list all services.

UX details
- Compact headers; body text 16–18px with line‑height ~1.6.
- Scannable subheads and bullets for Benefits/What to Expect.
- Place a secondary CTA after the first viewport and near FAQs.

### 6) Service Pages (If Expanding Beyond Current Procedures)

If you want separate “marketing” service pages in addition to dynamic procedure pages, add routes like:
- `src/app/services/prp-facial/page.tsx`
- Mirror content from procedures, focus on conversion copy + local proof. Cross-link to the associated dynamic procedure page to consolidate internal relevance.

### 7) Service-Area Pages

Paths: `src/app/locations/<slug>/page.tsx`

Targets
- James City County, Yorktown, Newport News, Toano, Norge, Lightfoot, New Town, Kingsmill, Ford’s Colony

Content requirements per page
- H1: “Med Spa Near <Area> in Williamsburg, VA” or “Med Spa Serving <Area>”
- 400–700 words of unique copy about access, directions, landmarks, reasons to choose WMS
- Links to core procedures, consult, and Williamsburg location hub
- Directions from local landmarks; parking tips
- JSON-LD: BreadcrumbList and LocalBusiness (reuse global LB; can omit duplication if sitewide LB is present; include FAQ if present)

Sitemap
- Add each location URL to `src/app/sitemap.ts`

UX details
- Open with a 3–4 sentence “Getting Here” summary and a “Get Directions” button.
- Vary landmarks and route details to avoid duplication; keep paragraphs short.

### 8) Blog & Topical Depth

Files
- `src/markdown/*.mdx` (articles load via `src/app/blog` + `src/app/sitemap.ts` list)
- Tags: ensure post `metadata.tags` include the procedure name (used by procedure pages to aggregate related posts)

Targets (examples)
- PRP Facial vs Microneedling with PRP in Williamsburg
- PRP Hair Restoration: Cost and Timeline in Virginia
- PRP for Joint Pain: Knees and Shoulders — What to Expect in Williamsburg
- Xeomin vs Botox: Differences, Longevity, and Price in Williamsburg
- Underarm Sweating (Hyperhidrosis) Treatment Options in Williamsburg, VA
- O‑Shot and P‑Shot: What’s Involved, Candidacy, and Results in Virginia

Checklist per post
- Title includes treatment + Williamsburg where natural
- 800–1500 words, original images if possible
- Include FAQs and add `<StructuredData type="FAQ" />`
- Internal links to the relevant procedure and location hub
- External links to authoritative medical resources (non-competitive)

UX & editorial details
- Add an author box (“Written by” or “Medically reviewed by”) with an updated date.
- Use subheads every 200–300 words and include a summary section.
- Insert a mid‑article CTA to `/consult`.

### 9) Google Business Profile (GBP) Enhancements

Profile setup checklist (Edit profile → Business information)
- Business name: `Williamsburg Med Spa` (must match signage/website)
- Categories:
  - Primary: `Medical spa`
  - Secondary: `Skin care clinic`, `Medical clinic`, `Wellness center`, `Hair replacement service` (if applicable)
- Address: `3900 Powhatan Parkway, Williamsburg, VA 23188`
- Phone: `+1 804-738-9483`
- Hours: Mon–Fri 6:00pm–8:00pm; Sat–Sun 10:00am–6:00pm (set holiday hours)
- Website: `/?utm_source=google&utm_medium=organic&utm_campaign=gbp_website`
- Appointment link: `/consult?utm_source=google&utm_medium=organic&utm_campaign=gbp_appointment`
- Opening date: set if known; else omit
- Attributes (as applicable): `Women-owned`, `LGBTQ+ friendly`, `Wheelchair accessible entrance`, `Restroom`, `Appointment required`, `Accepting new patients`
- Services: add all priority services with descriptions and price ranges where allowed (see templates below)
- Products (optional but recommended): add key retail items (e.g., Co2 Lift) with price and product URL
- Messaging: enable if you can respond within 24 hours; set greeting and quick replies; add notifications
- Call history: enable if desired for missed-call callbacks; monitor accuracy
- Photos: upload logo, cover, and a set of interior/exterior/team/treatment/ before&after media (see guidance)

“From the business” description (750 chars max; first ~250 most visible)
- Guidelines:
  - Include location (“Williamsburg, VA”), core services, differentiators, and tone of care.
  - Avoid promos, links, or phone numbers; no excessive claims or guarantees.
  - Write in natural language and reflect priority services.
- Example copy (you can paste this as-is and refine later):
  “Williamsburg Med Spa provides compassionate, evidence‑based aesthetics and regenerative care in Williamsburg, VA. Led by nurse practitioner Jenny Coleman, MSN, RN, CPNP, PMHS, we focus on natural results with fillers, PRP joint injections, feminine and male PRP protocols, PRP facials, and medical ear piercing (Blohmdahl). With more than 26 years in medicine and six years in aesthetics, our patient‑first approach blends safety, comfort, and education to help you look and feel your best.”

Services module (GBP → Services)
- Create entries that match on‑site naming. Keep 1–2 sentence descriptions, add price range if allowed.
- Templates:
  - Fillers — “Natural‑looking facial balancing and volume restoration performed by an experienced nurse practitioner. Personalized plans focused on harmony and safety.”
  - PRP Joint Injections — “Regenerative platelet‑rich plasma (PRP) injections for knees, shoulders, and other joints to support comfort and function.”
  - Feminine PRP Protocols — “Patient‑centered feminine wellness using PRP for intimacy, lubrication, and pelvic health. Confidential consults available.”
  - Male PRP Protocols — “Regenerative PRP protocols designed to support male intimacy and performance with a holistic approach.”
  - PRP Facial — “Microneedling with PRP (vampire facial) to support tone, texture, and glow with minimal downtime.”
  - Blohmdahl Ear Piercing — “Medical‑grade ear piercing with sterile, hypoallergenic materials—ideal for children and sensitive skin.”

Products module (optional)
- Add Co2 Lift and other retail items with photo, price, and link to the product detail or purchase page.

Photos & media
- Logo and cover: upload high‑quality brand logo and a welcoming cover (front desk/exterior).
- Quantity: at least 10–15 photos to start; add 2–3 new photos weekly.
- Types: exterior, interior, team, practitioner portrait, treatment room, before/after (no retouching), community involvement.
- Specs: JPG/PNG, 1200×900 or 1080×1080+, clear and well‑lit; avoid stock.

Posts (1/week)
- Types: What’s New, Offer, Event. Include a single focus, CTA to `/consult` or relevant service (use UTMs).
- Format template: headline (≤58 chars), 1–2 short paragraphs, CTA link, relevant photo.

Q&A
- Seed 5–8 genuine FAQs (hours, parking, candidacy, downtime, pricing ranges). Answer clearly; avoid medical promises.
- Monitor and reply within 24–48 hours.

Reviews
- Request via SMS/email after consults; aim for 5–10 per month.
- Respond to every review by referencing service category and thanking the patient (no PHI). Address negative feedback offline.

UTM guidelines
- Website: `/?utm_source=google&utm_medium=organic&utm_campaign=gbp_website`
- Appointment: `/consult?utm_source=google&utm_medium=organic&utm_campaign=gbp_appointment`
- Posts/Products: append `utm_source=google&utm_medium=organic&utm_campaign=gbp_post_<slug>`

Service area setting
- Because patients are seen at your location, keep the address visible and do not set a Service Area (intended for businesses that travel to customers). Target nearby localities on your site content instead.

### 10) Citations & Local Links

Core citations
- Google, Bing Places, Apple Maps, Yelp, Facebook, Nextdoor, MapQuest, BBB, Chamber of Commerce, Healthgrades, CareCredit (if applicable)

Local links
- Williamsburg Chamber, Visit Williamsburg vendor page, William & Mary orgs, local blogs/newsletters
- Sponsorships (5Ks, charity events), cross-promotions with nearby clinics/fitness/wellness businesses

Backlink targets
- Link to the location hub or specific service pages; use branded + topical anchors

### 11) Tracking & Analytics

GA4
- Configure conversions for consult submits and phone clicks
- Track phone clicks from `src/views/jumbotron.tsx` and any visible phone links
 - Track scroll‑depth on key pages and outbound clicks to booking/payment links

Search Console + Bing
- Verify site and submit sitemap
- Monitor coverage and query performance for Williamsburg terms

GBP Insights
- Track calls, direction requests, profile views; annotate major site changes

Rank Tracking
- Use a grid/ZIP tracker (e.g., BrightLocal/Whitespark) for “near me” + service keywords

Security/operational note
- Move SMTP credentials from code (`src/app/api/consult/route.ts`) into environment variables before deployment; update transporter to read from env. This isn’t a ranking factor but is required for security compliance.

Monitoring
- Set Search Console alerts for coverage issues and manual actions.
- Add uptime monitoring (Vercel or lightweight third‑party) and basic error tracking.

### 12) QA & Definition of Done

For every new/updated page
- Title/H1 alignment; meta description present
- Canonical set correctly; `alternates.canonical` where needed
- Internal links to hub, procedures, and consult
- Schema valid (Rich Results Test passes)
- Mobile rendering and CLS/LCP reasonable (no blocking assets)
- Unique, non-duplicative copy

For GBP & Citations
- NAP consistency across all listings
- Appointment link uses UTM
- Reviews responded; Q&A answered

---

## Editorial Calendar (12 Weeks)

Month 1
- PRP Facial vs Microneedling with PRP in Williamsburg
- PRP Hair Restoration: Cost & Results Timeline in Virginia
- FAQ: Is PRP covered by insurance in Virginia?

Month 2
- PRP for Knee Pain in Williamsburg: What to Expect
- Xeomin vs Botox: Which Is Best in Williamsburg?
- Hyperhidrosis (Underarm Sweating): Treatment Options and Costs in Williamsburg

Month 3
- O‑Shot and P‑Shot: Benefits, Risks, and Candidacy in Virginia
- How to Prepare and Recover from PRP Procedures in Williamsburg
- Before/After Gallery Guide: What’s Realistic with PRP?

Post cadence: ~1 article/week + 1 GBP post/week.

---

## Templates & References

### A) LocalBusiness (MedicalBusiness) JSON-LD

Replace placeholders and render globally (e.g., in `src/app/layout.tsx`). Values below are customized to your NAP.

```
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Williamsburg Med Spa",
  "image": "https://www.williamsburgmedspa.com/logo.png",
  "url": "https://www.williamsburgmedspa.com",
  "telephone": "+1-804-738-9483",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3900 Powhatan Parkway",
    "addressLocality": "Williamsburg",
    "addressRegion": "VA",
    "postalCode": "23188",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.2707,
    "longitude": -76.7075
  },
  "openingHours": [
    "Mo-Fr 18:00-20:00",
    "Sa 10:00-18:00",
    "Su 10:00-18:00"
  ],
  "priceRange": "$$",
  "areaServed": [
    "Williamsburg VA", "James City County", "Yorktown", "Newport News",
    "Toano", "Norge", "Lightfoot", "New Town", "Kingsmill", "Ford's Colony"
  ],
  "founder": { "@type": "Person", "name": "Jenny Coleman" },
  "sameAs": [
    "https://www.instagram.com/<handle>",
    "https://www.facebook.com/<page>",
    "https://www.linkedin.com/company/<company>"
  ]
}
```

### B) Service JSON-LD (per procedure)

Render on each procedure page with real values.

```
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "PRP Facial",
  "areaServed": ["Williamsburg VA", "James City County", "Yorktown"],
  "provider": {
    "@type": "MedicalBusiness",
    "name": "Williamsburg Med Spa",
    "telephone": "+1-804-738-9483",
    "address": { "@type": "PostalAddress", "addressLocality": "Williamsburg", "addressRegion": "VA", "addressCountry": "US" }
  },
  "offers": { "@type": "Offer", "priceCurrency": "USD", "price": "<range or typical price>" }
}
```

### C) On-Page Metadata Patterns

- Titles: “<Service> in Williamsburg, VA | Williamsburg Med Spa”
- H1: “<Service>”
- H2s: “What Is <Service>?”, “Benefits of <Service> in Williamsburg”, “Who Is a Good Candidate?”, “What to Expect”, “Why Choose Us in Williamsburg”, “FAQs”
- Slugs: `/procedures/<slug>` and `/locations/<area-slug>`

### D) Internal Linking Anchors (examples)

- “PRP hair restoration in Williamsburg” → `/procedures/prp-hair-restoration`
- “our med spa in Williamsburg” → `/locations/williamsburg-va`
- “book a consultation” → `/consult`

Priority anchor ideas (homepage and hub)
- “Fillers in Williamsburg” → `/procedures/filler`
- “PRP joint injections in Williamsburg” → `/procedures/joint-restoration`
- “O-Shot in Williamsburg” → `/procedures/o-shot`
- “P-Shot in Williamsburg” → `/procedures/p-shot`
- “PRP facial in Williamsburg” → `/procedures/prp-facial`
- “Blohmdahl ear piercing in Williamsburg” → `/procedures/blohmdahl-ear-piercing`

### E) UTM Guidelines for GBP

- Appointment link: `/consult?utm_source=google&utm_medium=organic&utm_campaign=gbp_appointment`
- Website link: `/?utm_source=google&utm_medium=organic&utm_campaign=gbp_website`

---

## Step‑by‑Step Implementation Checklist

Phase 1 (Weeks 1–2)
1. Create `src/app/locations/williamsburg-va/page.tsx` with NAP, map, directions, services, FAQs, and JSON-LD.
2. Extend `src/components/structured-data.tsx` to support `LocalBusiness`, `Service`, `BreadcrumbList`.
3. Wire sitewide LocalBusiness JSON-LD in `src/app/layout.tsx`.
4. Homepage additions only: add Provider Callout block (see 4a). Do not change existing hero copy or services grid. Metadata and schema handled globally.
5. Tune procedure metadata: `src/app/procedures/[slug]/page.tsx` (append “in Williamsburg, VA” when natural) + `src/data.ts` `seo` fields.
6. Add internal links: header/footer to `/locations/williamsburg-va`; procedures link back to location hub.
7. Update `src/app/sitemap.ts` to include the location hub URL.
8. GBP updates: categories, services, UTM links, photos, posts, Q&A; start review requests.

Homepage services display plan (optional, deferred)
- Keep the current grid as-is. If later approved, we can add subtle “Featured” badges to six priority items or add a “View all services” link above or below the grid—without removing or reordering items.

Phase 1.5 (Weeks 2–3): UX polish and accessibility
18. Add Provider Callout beneath Jumbotron with rounded portrait, accessible alt, and CTA.
19. Audit color contrast and focus states; ensure keyboard navigation and visible focus styles.
20. Verify heading structure (1 H1 per page; logical H2/H3) and semantic HTML in cards/lists.
21. Add a skip‑to‑content link and confirm labels/aria on the consult form.

Phase 2 (Weeks 3–6)
9. Flesh out/tune the 6 core procedures with richer FAQs, aftercare, candidacy, before/after gallery sections.
10. Publish 6–8 blog articles under `src/markdown` (ensure `metadata.tags` match procedure names); add FAQ JSON-LD where applicable.
11. Build core citations; secure 3–5 local backlinks.
12. Add a reviews module to the location hub; showcase 3–6 recent quotes.
13. Improve homepage procedure grid responsiveness (stack → 2 cols → 3–4 cols) and ensure consistent card heights.
14. Optimize images via `next/image` (set `sizes`, explicit width/height, and `priority` for LCP); compress static assets.

Phase 3 (Weeks 7–12)
13. Create 4–6 service-area pages in `src/app/locations/*` with unique copy and directions; wire into sitemap and internal links.
14. Continue weekly GBP posts and photo updates; maintain review velocity.
15. Publish 3–4 more articles; adjust titles/meta based on GSC query data (Williamsburg variants).
16. Earn 5+ additional local backlinks; pitch one local media feature.
17. Quarterly QA pass: validate schema, titles, CWV basics, internal links, and NAP consistency.

Dependencies to confirm
- Social profile URLs for `sameAs`
- Price ranges per service (if allowed to publish)

Definition of Done (per change)
- Page renders correctly on mobile/desktop
- Title/H1/meta/OG set; canonical accurate
- Schema validates in Rich Results Test
- Internal links present to consult, hub, and related content
- Indexed (via GSC) within 7–10 days after sitemap submission

---

## Personalization To‑Do

Please provide:
- Exact NAP (name, street, city, state, ZIP), phone, hours
- Social links (Instagram, Facebook, LinkedIn)
- Priority services and any to de‑emphasize
- Target nearby areas to include/exclude

Once received, we will:
- Embed precise NAP into LocalBusiness JSON-LD and location hub
- Update areaServed and geo coords
- Tailor copy across procedures and service-area pages

---

## UX & Accessibility

Principles
- Mobile‑first layout with generous spacing and tap targets (≥44×44px)
- Clear hierarchy; one H1 per page; descriptive H2/H3
- High contrast (WCAG AA) for text, CTAs, and focus states
- Full keyboard navigability; visible focus; skip link to content
- Descriptive link text; avoid “learn more” alone
- Alt text that adds context without duplicating nearby copy
- Respect `prefers-reduced-motion`; keep animations subtle

Components
- Hero/Jumbotron: preloaded LCP image; concise headline; primary CTA
- Provider Callout: rounded portrait, short bio bullets, clear CTA
- Procedure Cards: consistent heights; clear images; two CTAs
- FAQs: ARIA-annotated accordion; keyboard accessible
- Footer: clear NAP and quick links (procedures, location hub, consult)

Accessibility QA
- Lighthouse accessibility score ≥95 on homepage and a procedure page
- WAVE check for color contrast and landmarks
- Keyboard traversal test (no traps); VoiceOver/NVDA spot check

## Performance & CWV

Targets
- LCP ≤2.5s, CLS ≤0.1, INP ≤200ms on 4G mobile

Tactics
- Use `next/image` with explicit `width/height`, `sizes`, and `priority` for the LCP image
- Lazy‑load non‑critical images/iframes; reserve space to avoid shifts
- Load GA with `afterInteractive`; minimize third‑party scripts
- Prefer system fonts or preload a single variable font
- Dynamic import rarely used components; avoid heavy client JS
- Use ISR/SSG and Vercel caching for static content

Measurement
- Weekly Lighthouse mobile runs; log scores and regressions
- Optional RUM: send Web Vitals to GA4 using the `web-vitals` library

## Forms, Compliance & Trust

Consult form improvements
- Inline validation; clear errors; phone input mask; helpful placeholders
- Consent checkbox for call/text/email with privacy link; avoid gating
- Add honeypot or reCAPTCHA; rate‑limit API
- Success confirmation and follow‑up message outlining next steps

Trust & compliance
- Add a concise medical disclaimer on procedure pages (“results vary; consultation required; not medical advice”)
- Before/after images: consent, no retouching; captions with timeframe/context
- Reviews: no review gating; respond without PHI
- Move SMTP credentials to env vars; never log PII
