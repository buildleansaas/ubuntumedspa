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
      <h1 className="text-4xl leading-[1.08] tracking-tight text-base-content md:text-6xl">Privacy Policy</h1>
      <PrivacyPolicy />
    </article>
  );
}
