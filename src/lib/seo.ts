import { formatUsdShort } from "./price";

// The clinic's only wrinkle relaxer is Xeomin. It does not offer Botox® brand.
export const DEFAULT_TITLE = "Medical Spa Williamsburg VA | Xeomin (Botox Alternative) & PRP";
export const DEFAULT_DESCRIPTION = `Nurse-led med spa on Powhatan Pkwy. Xeomin® wrinkle relaxer (a Botox® alternative) from ${formatUsdShort(25000)} cash, PRP, and Blomdahl ear piercing.`;

export const ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.williamsburgmedspa.com";

// Opens the Google "write a review" form for the clinic (GBP > Ask for reviews), used in the buyer receipt.
export const GOOGLE_REVIEW_URL = "https://g.page/r/Cde-gEi21QPUEBM/review";
