import type { Metadata } from "next";

import MembershipBuilder from "components/membership-builder";
import { buildPageMetadata } from "lib/metadata";

// Prototype (2026-11-05): kept out of search until checkout is built and reviewed.
export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Your Year with Jenny | Williamsburg Med Spa Packages",
    description: "Build a yearly plan with Jenny: Xeomin, PRP joints, PRP Facial, and more, prepaid once with 5 to 10% off.",
    canonical: "/membership",
  }),
  robots: { index: false, follow: false },
};

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-6xl py-12 md:py-16">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/60">Yearly packages</p>
      <h1 className="font-display mt-3 text-4xl font-medium leading-[1.1] tracking-tight text-base-content md:text-6xl">Your Year with Jenny</h1>
      <p className="mt-4 max-w-2xl text-lg text-base-content/80">
        Tell us what you&apos;d like help with, and we&apos;ll build a plan for your year. Prepay once and save 5%, or 10% with two
        or more packages.
      </p>
      <div className="mt-10">
        <MembershipBuilder />
      </div>
    </div>
  );
}
