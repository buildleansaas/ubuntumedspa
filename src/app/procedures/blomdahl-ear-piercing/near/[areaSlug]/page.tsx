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

function ScanItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 rounded-2xl border border-base-300/80 bg-base-100 p-4 shadow-sm">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        ✓
      </span>
      <div>
        <p className="font-medium text-base-content">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-base-content/75">{children}</p>
      </div>
    </li>
  );
}

export default function EarPiercingAreaPage({ params }: Params) {
  const area = getPublishedEarPiercingAreaBySlug(params.areaSlug);
  if (!area || !procedure) return notFound();

  const consultHref = `/consult?procedure=blomdahl-ear-piercing&area=${area.slug}&utm_source=website&utm_medium=local_service_page&utm_campaign=ear_piercing_${area.slug}`;
  const canonicalUrl = `${ORIGIN}/procedures/blomdahl-ear-piercing/near/${area.slug}`;
  const relatedAreas = getRelatedEarPiercingAreas(area);
  const headline = getAreaHeadline(area);
  const eyebrow = getAreaEyebrow(area);
  const visitFit = area.parentIntent ? "Children, teens, and sensitive ears" : "Adults, re-piercing, and sensitive ears";
  const trustCards = [
    ["Sterile disposable system", "Blomdahl uses sterile disposable piercing cassettes designed to reduce cross-contamination risk."],
    ["Hypoallergenic jewelry", "Medical Plastic and Medical Grade Titanium options are available for sensitive skin and nickel concerns."],
    [
      "Calm family visit",
      area.parentIntent
        ? "Parents can ask questions, review aftercare, and avoid a rushed mall setting."
        : "Appointments are planned around comfort, placement, and aftercare.",
    ],
  ];

  return (
    <main className="mx-auto max-w-xl px-4 py-10 md:max-w-6xl md:px-8 md:py-12">
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

      <header className="mb-8 grid gap-6 rounded-3xl border border-base-300/80 bg-base-100 p-5 shadow-sm md:mb-10 md:grid-cols-[1.35fr_0.65fr] md:items-center md:p-8">
        <div>
          <p className="mb-3 text-sm uppercase tracking-wide text-base-content/60">{eyebrow}</p>
          <h1 className="text-3xl font-light leading-tight md:text-5xl">{headline}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-base-content/75 md:text-lg">
            {area.localIntro} Williamsburg Med Spa offers Blomdahl sterile ear piercing with hypoallergenic starter jewelry {area.distanceNote} for families and adults who want an appointment-based alternative to retail piercing.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={consultHref}>Request an Ear Piercing Visit</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/procedures/blomdahl-ear-piercing">View Ear Piercing Details</Link>
            </Button>
          </div>
        </div>
        <aside className="rounded-2xl bg-base-200/70 p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/55">Quick read</p>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-base-content/55">Best for</dt>
              <dd className="font-medium text-base-content">{visitFit}</dd>
            </div>
            <div>
              <dt className="text-base-content/55">Visit style</dt>
              <dd className="font-medium text-base-content">Appointment-based, not retail-counter rushed</dd>
            </div>
            <div>
              <dt className="text-base-content/55">What parents can ask about</dt>
              <dd className="font-medium text-base-content">Placement, jewelry material, healing, and aftercare</dd>
            </div>
          </dl>
        </aside>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-3 md:mb-10 md:grid-cols-3 md:gap-4">
        {trustCards.map(([title, body]) => (
          <Card key={title} className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-base-content/80">{body}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-8 grid gap-5 md:mb-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Why medical-grade piercing</p>
          <h2 className="mt-2 text-2xl font-light md:text-3xl">Why {area.name} families choose a medical setting</h2>
          <p className="mt-3 text-base leading-relaxed text-base-content/75 md:text-lg">
            For {area.name} patients, Williamsburg Med Spa is {area.earPiercingAngle}. {area.whyMedicalSetting}
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          <ScanItem label="Not a rushed counter visit">Appointments leave room for placement, questions, and comfort.</ScanItem>
          <ScanItem label="Sensitive-ear friendly">Hypoallergenic starter jewelry helps families compare safer material choices.</ScanItem>
          <ScanItem label="Pediatric-aware care">{area.pediatricAngle || "Parent questions, child comfort, and aftercare are part of the process."}</ScanItem>
          <ScanItem label="Clear healing guidance">Aftercare is reviewed before patients leave the clinic.</ScanItem>
        </ul>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 md:mb-10 md:grid-cols-2 md:gap-5">
        <Card>
          <CardHeader>
            <CardTitle>A pediatric-aware Blomdahl provider near {area.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-base-content/80 md:text-base">
            <p>{area.providerTrustNote || providerTrustNote}</p>
            <p>{area.parentConcern}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clean materials and starter jewelry</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-relaxed text-base-content/80 md:text-base">
              <li><strong className="text-base-content">Sterile cassettes:</strong> {area.blomdahlAngle || blomdahlTrustNote}</li>
              <li><strong className="text-base-content">Material options:</strong> {area.materialNote || materialTrustNote}</li>
              <li><strong className="text-base-content">Aftercare:</strong> {area.aftercareNote || aftercareTrustNote}</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8 rounded-3xl border border-base-300/80 bg-base-100 p-5 shadow-sm md:mb-10 md:p-7">
        <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Visit planning</p>
            <h2 className="mt-2 text-2xl font-light md:text-3xl">Planning your visit from {area.name}</h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-base-content/80 md:text-lg">
            <p>{area.routeNote}</p>
            <p>{area.visitLogistics} The clinic is in Williamsburg, VA.</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {area.nearbyNeighborhoods.map((neighborhood) => (
                <span key={neighborhood} className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-sm">
                  {neighborhood}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ServiceAreaDirections area={area} consultHref={consultHref} />

      <section className="mb-8 grid gap-6 md:mb-10 md:grid-cols-[1fr_0.85fr] md:items-start">
        <div>
          <h2 className="mb-3 text-2xl font-light md:text-3xl">Questions from {area.name} families</h2>
          <Accordion type="single" collapsible className="text-left">
            {area.faqs.map(({ question, answer }) => (
              <AccordionItem key={question} value={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <aside className="rounded-3xl border border-base-300/80 bg-base-100 p-5 shadow-sm">
          <h2 className="text-xl font-light">Nearby service areas</h2>
          <div className="mt-4 flex flex-wrap gap-2">
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
        </aside>
      </section>

      <section className="rounded-3xl border border-primary/20 bg-primary/5 p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-light md:text-3xl">Plan your visit</h2>
            <p className="mt-2 text-base leading-relaxed text-base-content/80 md:text-lg">
              Book a consultation request and mention ear piercing, your preferred timing, and whether the visit is for a child, teen, or adult.
            </p>
          </div>
          <Button asChild>
            <Link href={consultHref}>Request an Ear Piercing Visit</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
