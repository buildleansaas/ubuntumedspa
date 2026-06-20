# Williamsburg med spa homepage CTR slice

## ICP / search job

Williamsburg-area patients comparing a trustworthy local med spa for Botox, Xeomin, dermal fillers, PRP, O-Shot care, sweating treatment, and medical ear piercing. The homepage should quickly confirm local fit, Jenny Coleman’s provider credibility, appointment expectations, and the next booking path.

## Source signal

Discord SEO Pulse thread `1513984196329345036` asked to improve the `med spa williamsburg` / `med spa williamsburg va` landing experience from the Jun 6-8 reports.

## Implemented in this slice

1. Protected homepage local SEO source markers with `scripts/check-homepage-local-seo.mjs`.
2. Kept the merged homepage title/meta + visible FAQ/schema direction from PR #47.
3. Polished the above-fold hero to be more customer-facing while preserving local med spa intent:
   - Nurse Practitioner led positioning.
   - Natural-looking aesthetic care in Williamsburg, VA.
   - Jenny Coleman credentials above the fold.
   - Core services named before the first CTA.
   - Trust cards for experience, conservative planning, O-Shot certification, and Blomdahl certification.
4. Preserved the existing local intro, service/location links, FAQ section, and sitewide MedicalBusiness schema.

## Verification plan

- `pnpm exec next lint`
- `node scripts/check-homepage-local-seo.mjs`
- `pnpm build`
- Local rendered smoke of `/` for title, H1, FAQ schema, MedicalBusiness schema, and mobile first-screen readability.
- Vercel preview smoke after PR opens.
- Production no-cache smoke after merge/deploy.

## Measurement

Watch homepage GSC rows at 7/14/28 days for:

- `med spa williamsburg`
- `med spa williamsburg va`
- `medical spa williamsburg`
- `williamsburg med spa`

