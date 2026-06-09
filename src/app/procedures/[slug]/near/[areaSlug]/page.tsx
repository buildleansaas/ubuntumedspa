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
    canonical: `${ORIGIN}/procedures/${page.procedureSlug}/near/${page.areaSlug}`,
  });
}

export default function LocalInjectableServicePage({ params }: Params) {
  const page = getLocalInjectableServicePage(params.slug, params.areaSlug);
  const procedure = procedures.find((item) => item.slug === params.slug);
  if (!page || !procedure) return notFound();

  const canonicalUrl = `${ORIGIN}/procedures/${page.procedureSlug}/near/${page.areaSlug}`;
  const consultHref = `/consult?procedure=${page.procedureSlug}&area=${page.areaSlug}&utm_source=website&utm_medium=local_service_page&utm_campaign=${page.procedureSlug}_${page.areaSlug}`;
  const primaryCtaLabel = page.procedureSlug === "botox" ? "Request a Botox Consultation" : `Request a ${page.shortName} Consultation`;
  const secondaryCta =
    page.procedureSlug === "botox"
      ? { href: "/blog/botox-vs-xeomin-williamsburg-va", label: "Compare Botox vs Xeomin" }
      : { href: `/procedures/${page.procedureSlug}`, label: `View ${page.shortName} Details` };

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
      <StructuredData type="LocalBusiness" />
      <StructuredData
        type="Person"
        headline="Jenny Coleman, MSN, RN, CPNP, PMHS"
        description="Jenny Coleman provides consultation-first injectable and regenerative aesthetic care at Williamsburg Med Spa."
        url="/staff/jenny-coleman"
      />
      <StructuredData
        type="Service"
        service={{ name: `${page.serviceName} in ${page.areaName}`, description: page.metaDescription, areaServed: page.areaName }}
      />
      <StructuredData type="FAQ" faqs={page.faqs} />

      <header className="text-center mb-10 md:mb-14 px-4 md:px-0">
        <p className="text-sm uppercase tracking-wide text-base-content/60 mb-3">Williamsburg injectable treatment planning</p>
        <h1 className="text-3xl md:text-5xl font-light leading-tight">{page.title}</h1>
        <p className="text-base md:text-lg text-base-content/75 mt-4 max-w-3xl mx-auto">{page.intro}</p>
        {page.heroChips ? (
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {page.heroChips.map((chip) => (
              <span key={chip} className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs md:text-sm text-base-content/75">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Button asChild>
            <Link href={consultHref}>{primaryCtaLabel}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-14 px-4 md:px-0">
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

      {page.fitGuidance ? (
        <section className="mb-10 md:mb-14 px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Botox may be a good fit if</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-base-content/80">
                  {page.fitGuidance.goodFit.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Another option may come first if</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-base-content/80">
                  {page.fitGuidance.considerInstead.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : null}

      {page.treatmentAreas ? (
        <section className="mb-10 md:mb-14 px-4 md:px-0">
          <div className="max-w-3xl mb-5">
            <h2 className="text-2xl md:text-3xl font-light mb-3">Botox treatment areas patients ask about</h2>
            <p className="text-base md:text-lg text-base-content/80">
              The right Botox plan depends on the area, muscle strength, anatomy, and how much expression you want to keep.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.treatmentAreas.map((area) => (
              <Card key={area.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{area.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-base-content/80">
                  <p>{area.body}</p>
                  {area.href ? (
                    <Link href={area.href} className="font-medium text-primary hover:underline">
                      Learn about {area.title.toLowerCase()}
                    </Link>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {page.consultationSteps ? (
        <section className="mb-10 md:mb-14 rounded-xl border border-base-300 p-5 md:p-6 mx-4 md:mx-0">
          <h2 className="text-2xl md:text-3xl font-light mb-3">What Jenny reviews before treatment</h2>
          <p className="text-base md:text-lg text-base-content/80 mb-5">{page.consultNote}</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {page.consultationSteps.map((step) => (
              <div key={step.title} className="rounded-lg bg-base-200/60 p-4">
                <h3 className="font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-base-content/75">{step.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-10 md:mb-14 rounded-xl border border-base-300 p-5 md:p-6 mx-4 md:mx-0">
          <h2 className="text-2xl md:text-3xl font-light mb-3">What to review before booking</h2>
          <p className="text-base md:text-lg text-base-content/80">{page.consultNote}</p>
        </section>
      )}

      {page.pricing ? (
        <section className="mb-10 md:mb-14 px-4 md:px-0">
          <div className="rounded-xl border border-base-300 bg-base-100 p-5 md:p-6">
            <p className="text-sm uppercase tracking-wide text-base-content/60 mb-2">Pricing and treatment credit</p>
            <h2 className="text-2xl md:text-3xl font-light mb-3">{page.pricing.heading}</h2>
            <p className="text-base md:text-lg text-base-content/80 mb-3">{page.pricing.body}</p>
            <p className="text-sm text-base-content/65">{page.pricing.note}</p>
          </div>
        </section>
      ) : null}

      {page.comparison ? (
        <section className="mb-10 md:mb-14 px-4 md:px-0">
          <div className="rounded-xl bg-primary/10 p-5 md:p-6">
            <h2 className="text-2xl md:text-3xl font-light mb-3">{page.comparison.heading}</h2>
            <p className="text-base md:text-lg text-base-content/80 mb-4">{page.comparison.body}</p>
            <div className="flex flex-wrap gap-2">
              {page.comparison.links.map((link) => (
                <Button key={link.href} asChild variant="secondary" size="sm">
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {page.providerNote ? (
        <section className="mb-10 md:mb-14 px-4 md:px-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-light">{page.providerNote.heading}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base md:text-lg text-base-content/80">{page.providerNote.body}</p>
              <div className="flex flex-wrap gap-2">
                {page.providerNote.links.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary">
                    {link.label}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}

      <section className="mb-10 md:mb-14 px-4 md:px-0">
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

      <section className="mb-10 md:mb-14 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Related Williamsburg pages</h2>
        <div className="flex flex-wrap gap-2">
          {page.relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-base-300 p-5 md:p-6 mx-4 md:mx-0">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Plan your visit</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          Williamsburg Med Spa is located at 3900 Powhatan Parkway in Williamsburg, VA. Request a consultation to review candidacy, timing, and pricing before treatment.
        </p>
        <Button asChild>
          <Link href={consultHref}>{primaryCtaLabel}</Link>
        </Button>
      </section>
    </main>
  );
}
