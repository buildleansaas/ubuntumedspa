import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import StructuredData from "components/structured-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { procedures } from "data";
import { buildPageMetadata } from "lib/metadata";
import { getLocalInjectableServicePage, localInjectableServicePages } from "lib/local-injectable-service-pages";

const ORIGIN = "https://www.williamsburgmedspa.com";

type Params = { params: { slug: string; areaSlug: string } };

export function generateStaticParams() {
  return localInjectableServicePages.map((page) => ({ slug: page.procedureSlug, areaSlug: page.areaSlug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const page = getLocalInjectableServicePage(params.slug, params.areaSlug);
  if (!page) {
    return buildPageMetadata({
      title: "Injectables in Williamsburg, VA",
      description: "Injectable treatment planning at Williamsburg Med Spa.",
      canonical: "/procedures",
    });
  }

  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    canonical: `/procedures/${page.procedureSlug}/near/${page.areaSlug}`,
  });
}

export default function LocalInjectableServicePage({ params }: Params) {
  const page = getLocalInjectableServicePage(params.slug, params.areaSlug);
  const procedure = procedures.find((item) => item.slug === params.slug);
  if (!page || !procedure) return notFound();

  const canonicalUrl = `${ORIGIN}/procedures/${page.procedureSlug}/near/${page.areaSlug}`;
  const consultHref = `/consult?procedure=${page.procedureSlug}&area=${page.areaSlug}&utm_source=website&utm_medium=local_service_page&utm_campaign=${page.procedureSlug}_${page.areaSlug}`;

  return (
    <main className="max-w-xl md:max-w-6xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData
        type="Breadcrumb"
        breadcrumbItems={[
          { name: "Home", item: ORIGIN },
          { name: "Procedures", item: `${ORIGIN}/procedures` },
          { name: procedure.name, item: `${ORIGIN}/procedures/${procedure.slug}` },
          { name: page.areaName, item: canonicalUrl },
        ]}
      />
      <StructuredData
        type="Service"
        service={{ name: `${page.serviceName} in ${page.areaName}`, description: page.metaDescription, areaServed: page.areaName }}
      />
      <StructuredData type="FAQ" faqs={page.faqs} />

      <header className="text-center mb-10 md:mb-14">
        <p className="text-sm uppercase tracking-wide text-base-content/60 mb-3">Williamsburg injectable treatment planning</p>
        <h1 className="text-3xl md:text-5xl font-light leading-tight">{page.title}</h1>
        <p className="text-base md:text-lg text-base-content/75 mt-4 max-w-3xl mx-auto">{page.intro}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Button asChild>
            <Link href={consultHref}>Request a {page.shortName} Consultation</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={`/procedures/${page.procedureSlug}`}>View {page.shortName} Details</Link>
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-14">
        {[
          ["Local treatment planning", page.whyLocal],
          ["Conservative injectable care", page.treatmentPlanning],
          ["Medical-provider guidance", page.trustNote],
        ].map(([title, body]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-base-content/80">{body}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-10 md:mb-14 rounded-xl border border-base-300 p-5 md:p-6">
        <h2 className="text-2xl md:text-3xl font-light mb-3">What to review before booking</h2>
        <p className="text-base md:text-lg text-base-content/80">{page.consultNote}</p>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Questions about {page.shortName} in Williamsburg</h2>
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
        <h2 className="text-2xl md:text-3xl font-light mb-3">Related Williamsburg pages</h2>
        <div className="flex flex-wrap gap-2">
          {page.relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-base-300 p-5 md:p-6">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Plan your visit</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          Williamsburg Med Spa is located at 3900 Powhatan Parkway in Williamsburg, VA. Request a consultation to review candidacy, timing, and pricing before treatment.
        </p>
        <Button asChild>
          <Link href={consultHref}>Start Consultation Request</Link>
        </Button>
      </section>
    </main>
  );
}
