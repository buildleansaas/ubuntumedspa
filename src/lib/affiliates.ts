export const AFFILIATE_PROFILE_STORAGE_KEY = "wms_affiliate_profile";
export const AFFILIATE_REFERRAL_COOKIE = "wms_affiliate_ref";
export const AFFILIATE_REF_PARAM = "ref";

export type AffiliateRecord = {
  affiliateId: string;
  accountId: string;
  name: string;
  email: string;
  affiliateCode: string;
  status: "active" | "disabled";
  createdAt: Date;
  updatedAt: Date;
};

export type AffiliateSnapshot = {
  affiliateId: string;
  affiliateCode: string;
  affiliateName: string;
};

export type AffiliateLocalProfile = AffiliateSnapshot & {
  email: string;
};

export const normalizeAffiliateCode = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/(^-|-$)/g, "");

export const parseAffiliateCodeCookie = (cookieValue?: string | null) => {
  if (!cookieValue) return null;

  try {
    const decoded = decodeURIComponent(cookieValue);
    const normalized = normalizeAffiliateCode(decoded);
    return normalized || null;
  } catch {
    return null;
  }
};

export const buildAffiliateLink = (absoluteUrl: string, code: string) => {
  const url = new URL(absoluteUrl);
  url.searchParams.set(AFFILIATE_REF_PARAM, normalizeAffiliateCode(code));
  return url.toString();
};

export const buildAffiliateShareMessage = (absoluteUrl: string) =>
  `If you’ve been curious about Williamsburg Med Spa, here’s the site I send people to. Jenny is gentle, thoughtful, and easy to trust for injectables, PRP, and products: ${absoluteUrl}`;
