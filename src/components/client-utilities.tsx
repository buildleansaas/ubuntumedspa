"use client";

import { Suspense } from "react";

import AffiliateReferralListener from "components/affiliate-referral-listener";
import RouteProgressBar from "components/route-progress-bar";
import { Toaster } from "components/ui/toaster";

export default function ClientUtilities() {
  return (
    <>
      <Suspense fallback={null}>
        <AffiliateReferralListener />
      </Suspense>
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      <Toaster />
    </>
  );
}
