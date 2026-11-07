import type { Metadata } from "next";
import Link from "next/link";
import CtaFooter from "components/cta-footer";
import StructuredData from "components/structured-data";
import ProceduresView from "views/procedures";
import { buildPageMetadata } from "lib/metadata";
import HomeOwnerLink from "components/home-owner-link";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Procedures in Williamsburg, VA | Williamsburg Med Spa",
  description:
    "Review injectable, PRP, wellness, and specialty procedures at Williamsburg Med Spa, including Xeomin® (a Botox® alternative) and regenerative PRP care.",
  canonical: "/procedures",
});

export default function Procedures() {
  return (
    <div className="max-w-7xl mx-auto">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Procedures"]} />
      <ProceduresView headingTag="h1" variant="editorial" kicker="Treatments" showBotoxAlternativeLink />
      <p className="border-t border-base-300 py-8 text-base text-base-content/85">
        Comparing costs?{" "}
        <Link href="/prices" className="link link-primary">
          See every price on one page
        </Link>
        , cash price first.
      </p>
      <HomeOwnerLink className="mt-10" />
      <CtaFooter />
    </div>
  );
}
