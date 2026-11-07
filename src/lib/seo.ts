import { COMMERCE_CATALOG_BY_SLUG } from "../config/commerce-catalog";
import { formatUsdShort } from "./price";

const cashPrice = (slug: string) => formatUsdShort(COMMERCE_CATALOG_BY_SLUG[slug].cashAmountCents);

// The clinic's only wrinkle relaxer is Xeomin. It does not offer Botox® brand.
// Homepage snippet CTR test started 2026-11-04 and ended early 2026-11-06 for the Botox-alternative wording
// (ScaleSleek f_vh33afabed; docs/seo/homepage-snippet-ctr-test-2026-11-04.md).
// Keep the lead words "Medical Spa Williamsburg VA"; prices come from the catalog.
export const DEFAULT_TITLE = "Medical Spa Williamsburg VA | Xeomin, a Botox Alternative";
export const DEFAULT_DESCRIPTION = `Looking for Botox in Williamsburg, VA? Our nurse practitioner-led med spa uses Xeomin®, a Botox® alternative, from ${cashPrice(
  "xeomin"
)} cash. Ear piercing ${cashPrice("blomdahl-ear-piercing")}. See prices.`;

export const ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.williamsburgmedspa.com";

// Opens the Google "write a review" form for the clinic (GBP > Ask for reviews), used in the buyer receipt.
export const GOOGLE_REVIEW_URL = "https://g.page/r/Cde-gEi21QPUEBM/review";

// Our own landing page for review requests (QR codes, texts). It sends everyone to GOOGLE_REVIEW_URL.
export const REVIEW_PAGE_URL = `${ORIGIN}/review`;
