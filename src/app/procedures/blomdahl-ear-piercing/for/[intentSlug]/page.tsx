import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import StructuredData from "components/structured-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  getPublishedEarPiercingIntentPage,
  getRelatedAreasForIntent,
  publishedEarPiercingIntentPages,
} from "lib/ear-piercing-intents";
import { buildPageMetadata } from "lib/metadata";

const ORIGIN = "https://www.williamsburgmedspa.com";

type Params = { params: { intentSlug: string } };

export function generateStaticParams() {
  return publishedEarPiercingIntentPages.map((page) => ({ intentSlug: page.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const page = getPublishedEarPiercingIntentPage(params.intentSlug);
  if (!page) {
    return buildPageMetadata({
      title: "Blomdahl Ear Piercing in Williamsburg, VA",
      description: "Medical-grade Blomdahl ear piercing at Williamsburg Med Spa.",
      canonical: "/procedures/blomdahl-ear-piercing",
    });
  }

  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    canonical: `/procedures/blomdahl-ear-piercing/for/${page.slug}`,
  });
}

export default function EarPiercingIntentPage({ params }: Params) {
  const page = getPublishedEarPiercingIntentPage(params.intentSlug);
  if (!page) return notFound();

  const canonicalUrl = `${ORIGIN}/procedures/blomdahl-ear-piercing/for/${page.slug}`;
  const consultHref = `/consult?procedure=blomdahl-ear-piercing&intent=${page.slug}&utm_source=website&utm_medium=intent_page&utm_campaign=ear_piercing_${page.slug}`;
  const relatedAreas = getRelatedAreasForIntent(page);

  return (
    <main className="max-w-xl md:max-w-6xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData
        type="Breadcrumb"
        breadcrumbItems={[
          { name: "Home", item: ORIGIN },
          { name: "Procedures", item: `${ORIGIN}/procedures` },
          { name: "Blomdahl Ear Piercing", item: `${ORIGIN}/procedures/blomdahl-ear-piercing` },
          { name: page.title, item: canonicalUrl },
        ]}
      />
      <StructuredData
        type="Service"
        service={{
          name: `${page.title} at Williamsburg Med Spa`,
          description: page.metaDescription,
          areaServed: "Williamsburg, VA",
        }}
      />
      <StructuredData type="FAQ" faqs={page.faqs} />

      <header className="text-center mb-10 md:mb-14">
        <p className="text-sm uppercase tracking-wide text-base-content/60 mb-3">Certified Blomdahl provider</p>
        <h1 className="text-3xl md:text-5xl font-light leading-tight">{page.h1}</h1>
        <p className="text-base md:text-lg text-base-content/75 mt-4 max-w-3xl mx-auto">{page.audience}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Button asChild>
            <Link href={consultHref}>Request an Ear Piercing Visit</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/procedures/blomdahl-ear-piercing">View Blomdahl Details</Link>
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-14">
        <Card>
          <CardHeader>
            <CardTitle>Why Jenny</CardTitle>
          </CardHeader>
          <CardContent className="text-base-content/80">{page.whyJenny}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Why Blomdahl</CardTitle>
          </CardHeader>
          <CardContent className="text-base-content/80">{page.whyBlomdahl}</CardContent>
        </Card>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Before your visit</h2>
        <ul className="list-disc pl-5 space-y-2 text-base md:text-lg text-base-content/80">
          {page.beforeVisit.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Questions</h2>
        <Accordion type="single" collapsible className="text-left">
          {page.faqs.map(({ question, answer }) => (
            <AccordionItem key={question} value={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Nearby areas</h2>
        <div className="flex flex-wrap gap-2">
          {relatedAreas.map((area) => (
            <Link
              key={area.slug}
              href={`/procedures/blomdahl-ear-piercing/near/${area.slug}`}
              className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary"
            >
              {area.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-base-300 p-5 md:p-6">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Plan a Blomdahl piercing visit</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          Tell us who the visit is for, any sensitivity history, and your preferred timing.
        </p>
        <Button asChild>
          <Link href={consultHref}>Start Request</Link>
        </Button>
      </section>
    </main>
  );
}
