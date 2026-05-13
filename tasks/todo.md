# O-Shot urinary incontinence funnel — stacked PR plan

- Goal: Expand the O-Shot urinary incontinence funnel from buildleansaas/hq#64 with source-backed conversion copy and reviewable stacked PRs.
- Updated direction: do **not** flatten stronger O-Shot sales angle. Preserve high-satisfaction/resolution-style claims only with Runels / Cellular Medicine Association attribution and clear non-clinic-specific context.
- Constraints:
  - No absolute guarantee/cure/lifetime claims.
  - Do not state Williamsburg Med Spa has the same exact outcomes without clinic-specific proof.
  - If exact evidence is not found, mark `CLINICAL SOURCE NEEDED` in PR notes/draft rather than watering down all copy.
  - PR stack, not one giant PR.

## Stack
- [x] PR1 `seo/oshot-urinary-ailment-foundation`: ailment page foundation with processVisualization, keywords, attributed outcome claim/source note.
- [ ] PR2 `feature/consult-oshot-preselect`: consult query-param preselect + Mongo-before-email audit/proof.
- [ ] PR3 `assets/oshot-urinary-incontinence`: 4 discreet brand-safe images, optimized, wired only to existing paths.
- [ ] PR4 `seo/oshot-urinary-supporting-posts`: 3 funnel-style blog posts linking to ailment page + `/consult?interest=O-Shot`.
- [ ] PR5 `release/oshot-urinary-funnel`: final integration/QA notes, sitemap/indexability/internal-link review.

## Source trail / blockers
- [x] Read and aligned with hq#64 issue comment `4322247693`.
- [x] Verified official OShot.info / Runels source trail points to Neto JB (2017), `O-Shot: Platelets Rich Plasma in Intimate Female Treatment`, from the O-Shot research page.
- [x] Verified Neto PDF wording: 68-patient non-randomized pilot; 94% / 64 patients satisfied overall; 13 stress urinary incontinence patients reported more than 90% symptom relief; all mixed urinary incontinence patients were satisfied; cure was defined as subjective relief + questionnaire + absence of urine loss on physical exam.
- [x] Verified Runels transcript (`O-Shot® for Improved Sexual Function`, 2018) paraphrases the Neto incontinence/sexual-function study as 94% of people "loved it".
- [ ] Source blocker: exact `~93%` wording/result not located. Use verified 94% satisfaction / >90% SUI relief language; if a PR description specifically needs 93%, mark `CLINICAL SOURCE NEEDED` rather than weakening the funnel.

## Verification
- Run `npm run lint` per meaningful stack stage where possible.
- Run `npm run build` for final integration or smallest available equivalent if environment blocks.
- Inspect consult API path: `createConsultRequest(...)` writes Mongo `consult_requests` before email; email failure updates notification status and still returns success.

## Rollback
Revert individual PR branch commits; remove generated assets and MDX files for affected PR.
