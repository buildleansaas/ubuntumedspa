/**
 * Permanent (308) redirects for URLs removed on 2026-11-03 (issue #147):
 * dermal filler (including lip filler) is no longer offered, and the provider's surname changed from Coleman to Brady.
 * next.config.mjs spreads these into redirects(); scripts/verify-seo.mjs checks REMOVED_URL_REDIRECT_CHECKS.
 * Order matters: Next.js uses the first match, so specific paths come before the catch-alls.
 */
export const REMOVED_URL_REDIRECTS = [
  ["/staff/jenny-coleman", "/staff/jenny-brady"],
  ["/procedures/filler/near/:areaSlug", "/locations/williamsburg-va"],
  ["/procedures/filler", "/procedures"],
  ["/procedures/filler/:path*", "/procedures"],
  ["/blog/dermal-fillers-in-williamsburg-va-lips-cheeks-under-eyes", "/blog"],
  ["/blog/how-long-do-dermal-fillers-last-in-williamsburg-va", "/blog"],
  ["/blog/get-your-dream-lips-with-dermal-fillers", "/blog"],
  // Older filler article slugs listed in the old procedure data, e.g. soften-laugh-lines-with-dermal-fillers.
  ["/blog/:slug(.*filler.*)", "/blog"],
];

/** Removed URLs and where each must land, checked by scripts/verify-seo.mjs. */
export const REMOVED_URL_REDIRECT_CHECKS = [
  ["/staff/jenny-coleman", "/staff/jenny-brady"],
  ["/procedures/filler", "/procedures"],
  ["/procedures/filler/near/williamsburg-va", "/locations/williamsburg-va"],
  ["/procedures/filler/for/lip-augmentation", "/procedures"],
  ["/procedures/filler/for/cheek-enhancement", "/procedures"],
  ["/procedures/filler/for/tear-troughs", "/procedures"],
  ["/procedures/filler/for/nasolabial-folds", "/procedures"],
  ["/blog/dermal-fillers-in-williamsburg-va-lips-cheeks-under-eyes", "/blog"],
  ["/blog/how-long-do-dermal-fillers-last-in-williamsburg-va", "/blog"],
  ["/blog/get-your-dream-lips-with-dermal-fillers", "/blog"],
  ["/blog/soften-laugh-lines-with-dermal-fillers", "/blog"],
];
