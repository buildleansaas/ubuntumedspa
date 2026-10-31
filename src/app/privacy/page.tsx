import type { Metadata } from "next";

import PrivacyPolicy from "markdown/policies/privacy.mdx";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | Williamsburg Med Spa",
  description: "Privacy notice for williamsburgmedspa.com, including how Williamsburg Med Spa handles personal information.",
  canonical: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl py-14 md:py-20">
      <PrivacyPolicy />
    </article>
  );
}
