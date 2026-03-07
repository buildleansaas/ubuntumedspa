import type { Metadata } from "next";
import CtaFooter from "components/cta-footer";
import StructuredData from "components/structured-data";
import ProceduresView from "views/procedures";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Procedures in Williamsburg, VA | Williamsburg Med Spa",
  description:
    "Review injectable, PRP, wellness, and specialty procedures at Williamsburg Med Spa, including Botox, Xeomin, fillers, and regenerative care.",
  canonical: "/procedures",
});

export default function Procedures() {
  return (
    <div className="max-w-7xl mx-auto">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Procedures"]} />
      <ProceduresView headingTag="h1" />
      <CtaFooter />
    </div>
  );
}
