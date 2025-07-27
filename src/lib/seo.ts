export const DEFAULT_TITLE = "Williamsburg Med Spa | Restorative Wellness & Natural Healing in Historic Williamsburg";
export const DEFAULT_DESCRIPTION =
  "Experience restorative wellness and natural healing at Williamsburg Med Spa. Offering PRP therapy, Blohmdahl ear piercing, and aesthetic treatments for your journey to wellness.";

export const ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_ENV === "preview" && typeof process.env.VERCEL_GIT_COMMIT_REF === "string"
    ? `https://williamsburgmedspa-com-git-${process.env.VERCEL_GIT_COMMIT_REF}-buildleansaas.vercel.app`
    : "https://www.williamsburgmedspa.com";
