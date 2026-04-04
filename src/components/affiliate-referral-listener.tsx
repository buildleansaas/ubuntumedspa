"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { AFFILIATE_REF_PARAM, AFFILIATE_REFERRAL_COOKIE, normalizeAffiliateCode } from "lib/affiliates";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export default function AffiliateReferralListener() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get(AFFILIATE_REF_PARAM);

  useEffect(() => {
    if (!referralCode || typeof document === "undefined") return;

    const normalizedCode = normalizeAffiliateCode(referralCode);
    if (!normalizedCode) return;

    document.cookie = `${AFFILIATE_REFERRAL_COOKIE}=${encodeURIComponent(normalizedCode)}; path=/; max-age=${THIRTY_DAYS}; samesite=lax`;
  }, [referralCode]);

  return null;
}
