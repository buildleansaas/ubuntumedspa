export const DEFAULT_TITLE = "Williamsburg Medical Spa for Botox, Fillers, PRP & Ear Piercing";
export const DEFAULT_DESCRIPTION =
  "Visit Williamsburg Med Spa for natural-looking Botox, Xeomin, dermal fillers, PRP, O-Shot care, hyperhidrosis treatment, and Blomdahl medical ear piercing.";

export const ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_ENV === "preview" && typeof process.env.VERCEL_GIT_COMMIT_REF === "string"
    ? `https://williamsburgmedspa-com-git-${process.env.VERCEL_GIT_COMMIT_REF}-buildleansaas.vercel.app`
    : "https://www.williamsburgmedspa.com";
