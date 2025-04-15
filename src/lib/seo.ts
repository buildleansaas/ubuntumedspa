export const DEFAULT_TITLE = "Ubuntu Med Spa | Unlock the Power of PRP and Experience Natural Healing and Wellness";
export const DEFAULT_DESCRIPTION =
  "Experience natural healing and wellness with Ubuntu Med Spa's Plasma Rich Platelet (PRP) therapy. Discover the benefits and procedures for improved health.";

export const ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_ENV === "preview" && typeof process.env.VERCEL_GIT_COMMIT_REF === "string"
    ? `https://ubuntumedspa-com-git-${process.env.VERCEL_GIT_COMMIT_REF}-buildleansaas.vercel.app`
    : "https://www.ubuntumedspa.com";
