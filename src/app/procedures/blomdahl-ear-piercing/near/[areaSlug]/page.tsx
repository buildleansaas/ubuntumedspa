import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import StructuredData from "components/structured-data";
import ServiceAreaDirections from "components/service-area-directions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { procedures } from "data";
import {
  getPublishedEarPiercingAreaBySlug,
  getRelatedEarPiercingAreas,
  publishedEarPiercingAreas,
} from "lib/local-service-areas";
import { buildPageMetadata } from "lib/metadata";

const procedure = procedures.find((item) => item.slug === "blomdahl-ear-piercing");
const ORIGIN = "https://www.williamsburgmedspa.com";
const providerTrustNote =
  "Jenny Coleman, MSN, RN, CPNP, PMHS brings pediatric nursing experience to ear piercing visits, which is especially helpful for parents planning a child's first earrings.";
const blomdahlTrustNote =
  "Blomdahl medical ear piercing uses sterile disposable piercing cassettes and hypoallergenic starter jewelry options, including Medical Plastic and Medical Grade Titanium.";
const materialTrustNote =
  "Blomdahl describes its Medical Plastic as 0% nickel, which can matter for families and adults worried about sensitive ears.";
const aftercareTrustNote =
  "The appointment includes aftercare review so patients know when to leave starter earrings in place, how to care for the area, and when to call with concerns.";

function getAreaHeadline(area: { name: string; serviceAreaLabel: string; parentIntent: boolean }) {
  if (area.name === "Williamsburg") {
    return "Medical Ear Piercing in Williamsburg, VA";
  }

  return area.parentIntent
    ? `Children's Medical Ear Piercing near ${area.name}`
    : `Medical Ear Piercing near ${area.name}`;
}

function getAreaEyebrow(area: { name: string; serviceAreaLabel: string }) {
  return area.name === "Williamsburg" ? "Williamsburg medical-grade ear piercing" : `${area.serviceAreaLabel} service area`;
}

type Params = { params: { areaSlug: string } };

export function generateStaticParams() {
  return publishedEarPiercingAreas.map((area) => ({ areaSlug: area.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const area = getPublishedEarPiercingAreaBySlug(params.areaSlug);
  if (!area || !procedure) {
    return buildPageMetadata({
      title: "Medical Ear Piercing Near Williamsburg, VA",
      description: "Medical-grade Blomdahl ear piercing near Williamsburg, VA.",
      canonical: "/procedures/blomdahl-ear-piercing",
    });
  }

  return buildPageMetadata({
    title: area.metaTitle,
    description: area.metaDescription,
    canonical: `/procedures/blomdahl-ear-piercing/near/${area.slug}`,
  });
}

export default function EarPiercingAreaPage({ params }: Params) {
  const area = getPublishedEarPiercingAreaBySlug(params.areaSlug);
  if (!area || !procedure) return notFound();

  const consultHref = `/consult?procedure=blomdahl-ear-piercing&area=${area.slug}&utm_source=website&utm_medium=local_service_page&utm_campaign=ear_piercing_${area.slug}`;
  const canonicalUrl = `${ORIGIN}/procedures/blomdahl-ear-piercing/near/${area.slug}`;
  const relatedAreas = getRelatedEarPiercingAreas(area);
  const headline = getAreaHeadline(area);
  const eyebrow = getAreaEyebrow(area);

  return (
    <main className="max-w-xl md:max-w-6xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData
        type="Breadcrumb"
        breadcrumbItems={[
          { name: "Home", item: ORIGIN },
          { name: "Procedures", item: `${ORIGIN}/procedures` },
          { name: "Blomdahl Ear Piercing", item: `${ORIGIN}/procedures/blomdahl-ear-piercing` },
          { name: `Near ${area.name}`, item: canonicalUrl },
        ]}
      />
      <StructuredData
        type="Service"
        service={{
          name: `Blomdahl Ear Piercing near ${area.name}`,
          description: procedure.seo.description,
          areaServed: area.serviceAreaLabel,
        }}
      />
      <StructuredData type="FAQ" faqs={area.faqs} />

      <header className="text-center mb-10 md:mb-14">
        <p className="text-sm uppercase tracking-wide text-base-content/60 mb-3">{eyebrow}</p>
        <h1 className="text-3xl md:text-5xl font-light leading-tight">{headline}</h1>
        <p className="text-base md:text-lg text-base-content/75 mt-4 max-w-3xl mx-auto">
          {area.localIntro} Williamsburg Med Spa offers Blomdahl sterile ear piercing with hypoallergenic starter jewelry{" "}
          {area.distanceNote} for families and adults who want an appointment-based alternative to retail piercing.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Button asChild>
            <Link href={consultHref}>Request an Ear Piercing Visit</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/procedures/blomdahl-ear-piercing">View Ear Piercing Details</Link>
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-14">
        {[
          ["Sterile disposable system", "Blomdahl uses sterile disposable piercing cassettes designed to reduce cross-contamination risk."],
          ["Hypoallergenic jewelry", "Medical Plastic and Medical Grade Titanium options are available for sensitive skin and nickel concerns."],
          ["Calm family visit", area.parentIntent ? "Parents can ask questions, review aftercare, and avoid a rushed mall setting." : "Appointments are planned around comfort, placement, and aftercare."],
        ].map(([title, body]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-base-content/80">{body}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Why {area.name} families choose a medical setting</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          For {area.name} patients, Williamsburg Med Spa is {area.earPiercingAngle}. {area.whyMedicalSetting}
        </p>
        <p className="text-base md:text-lg text-base-content/80">
          {area.parentConcern} This page is intended for people comparing options for children&apos;s first piercings,
          sensitive skin, re-piercing, or a more controlled piercing experience near {area.countyOrContext}.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-14">
        <Card>
          <CardHeader>
            <CardTitle>A pediatric-aware Blomdahl provider near {area.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm md:text-base text-base-content/80">
            <p>{area.providerTrustNote || providerTrustNote}</p>
            <p>{area.pediatricAngle || "The visit is appointment-based, so parent questions, child comfort, and aftercare are part of the process."}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clean materials and starter jewelry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm md:text-base text-base-content/80">
            <p>{area.blomdahlAngle || blomdahlTrustNote}</p>
            <p>{area.materialNote || materialTrustNote}</p>
            <p>{area.aftercareNote || aftercareTrustNote}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Planning your visit from {area.name}</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">{area.routeNote}</p>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          {area.visitLogistics} The clinic is in Williamsburg, VA.
        </p>
        <div className="flex flex-wrap gap-2">
          {area.nearbyNeighborhoods.map((neighborhood) => (
            <span key={neighborhood} className="rounded-full border border-base-300 px-3 py-1 text-sm">
              {neighborhood}
            </span>
          ))}
        </div>
      </section>

      <ServiceAreaDirections area={area} consultHref={consultHref} />

      <section className="mb-10 md:mb-14 rounded-xl border border-base-300 p-5 md:p-6">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Compare before you book</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          If you are weighing convenience against a more controlled appointment, start with the Blomdahl comparison guides and then choose the visit path that fits your family.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ["Blomdahl vs mall ear piercing", "/blog/medical-ear-piercing-vs-mall-piercing"],
            ["Medical Plastic vs titanium", "/blog/blomdahl-medical-plastic-vs-titanium-earrings"],
            ["Children's first ear piercing", "/procedures/blomdahl-ear-piercing/for/children"],
            ["Sensitive ears", "/procedures/blomdahl-ear-piercing/for/sensitive-ears"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg border border-base-300 px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary">
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Questions from {area.name} families</h2>
        <Accordion type="single" collapsible className="text-left">
          {area.faqs.map(({ question, answer }) => (
            <AccordionItem key={question} value={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Nearby service areas</h2>
        <div className="flex flex-wrap gap-2">
          {relatedAreas.map((item) => (
            <Link
              key={item.slug}
              href={`/procedures/blomdahl-ear-piercing/near/${item.slug}`}
              className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-base-300 p-5 md:p-6">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Plan your visit</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          Book a consultation request and mention ear piercing, your preferred timing, and whether the visit is for a
          child, teen, or adult.
        </p>
        <Button asChild>
          <Link href={consultHref}>Start Request</Link>
        </Button>
      </section>
    </main>
  );
}
