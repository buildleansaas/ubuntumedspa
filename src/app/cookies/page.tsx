import type { Metadata } from "next";

import CookiePolicy from "markdown/policies/cookies.mdx";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy | Williamsburg Med Spa",
  description: "Cookie policy for williamsburgmedspa.com, including how cookies are used on the Williamsburg Med Spa website.",
  canonical: "/cookies",
});

export default function CookiePolicyPage() {
  return (
    <article className="mx-auto max-w-3xl py-14 md:py-20">
      <CookiePolicy />
    </article>
  );
}
