import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import StructuredData from "components/structured-data";
import TrackedPhoneLink from "components/tracked-phone-link";
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

      {page.sections?.map((section) => (
        <section key={section.heading} className="mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-light mb-3">{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-base md:text-lg text-base-content/80 mb-3">
              {paragraph}
            </p>
          ))}
          {section.bullets && (
            <ul className="list-disc pl-5 space-y-2 text-base md:text-lg text-base-content/80">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.steps && (
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.steps.map((step, index) => (
                <li key={step.title} className="rounded-xl border border-base-300 p-4">
                  <h3 className="font-semibold text-base-content">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-1 text-base-content/75">{step.description}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}

      {page.showPricing && (
        <section className="mb-10 md:mb-14 rounded-xl border border-base-300 p-5 md:p-6" id="pricing">
          <h2 className="text-2xl md:text-3xl font-light mb-3">Pricing</h2>
          <p className="text-base md:text-lg text-base-content/80">
            <strong>$45</strong> for one ear or <strong>$80</strong> for both ears in one visit. That includes the appointment, a sterile
            single-use Blomdahl cassette, hypoallergenic starter earrings, and aftercare support.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button asChild>
              <Link href={consultHref}>Book an Ear Piercing Visit</Link>
            </Button>
            <Button asChild variant="secondary">
              <TrackedPhoneLink href="tel:+18047389483" location="service_page">
                Call (804) 738-9483
              </TrackedPhoneLink>
            </Button>
          </div>
        </section>
      )}

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Before your visit</h2>
        <ul className="list-disc pl-5 space-y-2 text-base md:text-lg text-base-content/80">
          {page.beforeVisit.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10 md:mb-14 rounded-xl border border-base-300 p-5 md:p-6">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Helpful Blomdahl guides</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          Compare the main decisions before you book: medical piercing vs mall piercing, starter earring material, re-piercing, and aftercare.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ["Blomdahl vs mall ear piercing", "/blog/medical-ear-piercing-vs-mall-piercing"],
            ["Medical Plastic vs titanium", "/blog/blomdahl-medical-plastic-vs-titanium-earrings"],
            ["Ear piercing aftercare", "/blog/ear-piercing-aftercare-williamsburg-va"],
            ["Ear re-piercing", "/procedures/blomdahl-ear-piercing/for/re-piercing"],
          ]
            .filter(([, href]) => !href.endsWith(`/for/${page.slug}`))
            .map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg border border-base-300 px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary">
              {label}
            </Link>
          ))}
        </div>
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
