export const AFFILIATE_PROFILE_STORAGE_KEY = "wms_affiliate_profile";
export const AFFILIATE_PROFILE_STORAGE_EVENT = "wms-affiliate-profile-change";
export const AFFILIATE_REFERRAL_COOKIE = "wms_affiliate_ref";
export const AFFILIATE_REF_PARAM = "ref";
export const AFFILIATE_CODE_MIN_LENGTH = 3;
export const AFFILIATE_CODE_MAX_LENGTH = 32;

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

const isAffiliateLocalProfile = (value: unknown): value is AffiliateLocalProfile => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.affiliateId === "string" &&
    typeof candidate.affiliateCode === "string" &&
    typeof candidate.affiliateName === "string" &&
    typeof candidate.email === "string"
  );
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

export const isAffiliateCodeLengthValid = (value: string) =>
  value.length >= AFFILIATE_CODE_MIN_LENGTH && value.length <= AFFILIATE_CODE_MAX_LENGTH;

export const buildAffiliateLink = (absoluteUrl: string, code: string) => {
  const url = new URL(absoluteUrl);
  url.searchParams.set(AFFILIATE_REF_PARAM, normalizeAffiliateCode(code));
  return url.toString();
};

export const readAffiliateLocalProfile = () => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AFFILIATE_PROFILE_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isAffiliateLocalProfile(parsed)) {
      window.localStorage.removeItem(AFFILIATE_PROFILE_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(AFFILIATE_PROFILE_STORAGE_KEY);
    return null;
  }
};

export const writeAffiliateLocalProfile = (profile: AffiliateLocalProfile) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AFFILIATE_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent(AFFILIATE_PROFILE_STORAGE_EVENT, { detail: profile }));
};

export const clearAffiliateLocalProfile = () => {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AFFILIATE_PROFILE_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AFFILIATE_PROFILE_STORAGE_EVENT, { detail: null }));
};

export const buildAffiliateShareMessage = (absoluteUrl: string) =>
  `Here's the Med Spa in Williamsburg I was telling you about! ${absoluteUrl}`;
