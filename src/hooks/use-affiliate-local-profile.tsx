"use client";

import { useEffect, useState } from "react";

import {
  AFFILIATE_PROFILE_STORAGE_EVENT,
  AFFILIATE_PROFILE_STORAGE_KEY,
  readAffiliateLocalProfile,
  type AffiliateLocalProfile,
} from "lib/affiliates";

export default function useAffiliateLocalProfile() {
  const [affiliateProfile, setAffiliateProfile] = useState<AffiliateLocalProfile | null>(null);

  useEffect(() => {
    const syncAffiliateProfile = () => {
      setAffiliateProfile(readAffiliateLocalProfile());
    };

    syncAffiliateProfile();

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== AFFILIATE_PROFILE_STORAGE_KEY) return;
      syncAffiliateProfile();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AFFILIATE_PROFILE_STORAGE_EVENT, syncAffiliateProfile);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AFFILIATE_PROFILE_STORAGE_EVENT, syncAffiliateProfile);
    };
  }, []);

  return affiliateProfile;
}
