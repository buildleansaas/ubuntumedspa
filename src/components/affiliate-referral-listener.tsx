"use client";

import { useEffect } from "react";

import { AFFILIATE_REF_PARAM, AFFILIATE_REFERRAL_COOKIE, normalizeAffiliateCode } from "lib/affiliates";
import { getCurrentBrowserUrl, subscribeToLocationChange } from "lib/client-location";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export default function AffiliateReferralListener() {
  useEffect(() => {
    const syncReferralCode = () => {
      const referralCode = getCurrentBrowserUrl()?.searchParams.get(AFFILIATE_REF_PARAM);
      if (!referralCode || typeof document === "undefined") return;

      const normalizedCode = normalizeAffiliateCode(referralCode);
      if (!normalizedCode) return;

      document.cookie = `${AFFILIATE_REFERRAL_COOKIE}=${encodeURIComponent(normalizedCode)}; path=/; max-age=${THIRTY_DAYS}; samesite=lax`;
    };

    syncReferralCode();

    const unsubscribe = subscribeToLocationChange(syncReferralCode);
    window.addEventListener("popstate", syncReferralCode);

    return () => {
      unsubscribe();
      window.removeEventListener("popstate", syncReferralCode);
    };
  }, []);

  return null;
}
