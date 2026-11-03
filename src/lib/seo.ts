export const DEFAULT_TITLE = "Williamsburg Medical Spa for Botox, Fillers, PRP & Ear Piercing";
export const DEFAULT_DESCRIPTION =
  "Visit Williamsburg Med Spa for natural-looking Botox, Xeomin, dermal fillers, PRP, OH-Shot care, hyperhidrosis treatment, and Blomdahl medical ear piercing.";

export const ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.williamsburgmedspa.com";

// Opens the Google "write a review" form for the clinic (GBP > Ask for reviews), used in the buyer receipt.
export const GOOGLE_REVIEW_URL = "https://g.page/r/Cde-gEi21QPUEBM/review";
