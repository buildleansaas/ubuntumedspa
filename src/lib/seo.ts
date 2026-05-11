export const DEFAULT_TITLE = "Williamsburg Med Spa | Botox, Fillers, PRP & Ear Piercing";
export const DEFAULT_DESCRIPTION =
  "A local medical spa in Williamsburg, VA for Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, O-Shot services, and Blomdahl ear piercing.";

export const ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_ENV === "preview" && typeof process.env.VERCEL_GIT_COMMIT_REF === "string"
    ? `https://williamsburgmedspa-com-git-${process.env.VERCEL_GIT_COMMIT_REF}-buildleansaas.vercel.app`
    : "https://www.williamsburgmedspa.com";
