import Link from "next/link";

import StructuredData from "components/structured-data";
import TextToBook from "components/text-to-book";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import { Button, buttonVariants } from "components/ui/button";
import PeninsulaRouteMap from "components/peninsula-route-map";
import { COMMERCE_CATALOG_BY_SLUG } from "config/commerce-catalog";
import { cardPriceSchemaValue } from "lib/price";
import {
  getSatelliteLinks,
  hubPath,
  peninsulaDirectionsHref,
  SATELLITE_TEMPLATE_COPY,
  satelliteHubLabel,
  satellitePath,
  type ServiceSatellitePage,
} from "lib/service-satellites";
import { HyperhidrosisSteps } from "components/clinic-photos";

const ORIGIN = "https://www.williamsburgmedspa.com";

/** Shared layout for the hyperhidrosis concern pages and the PRP and Xeomin area pages (data in lib/service-satellites.ts). */
export default function ServiceSatellitePageView({ page }: { page: ServiceSatellitePage }) {
  const canonicalUrl = `${ORIGIN}${satellitePath(page)}`;
  const hubLabel = satelliteHubLabel(page.hubSlug);
  const catalogItem = COMMERCE_CATALOG_BY_SLUG[page.hubSlug];
  const links = getSatelliteLinks(page);

  return (
    <main className="w-full py-14 md:py-20">
      <StructuredData
        type="Breadcrumb"
        breadcrumbItems={[
          { name: "Home", item: ORIGIN },
          { name: "Procedures", item: `${ORIGIN}/procedures` },
          { name: hubLabel, item: `${ORIGIN}${hubPath(page.hubSlug)}` },
          { name: page.h1, item: canonicalUrl },
        ]}
      />
      <StructuredData
        type="Service"
        service={{
          name: page.h1,
          description: page.metaDescription,
          areaServed: page.kind === "near" ? `${page.label}, VA` : "Williamsburg, VA",
          // Offer price is the card / online price, which is what checkout charges (same as the hub).
          price: catalogItem ? cardPriceSchemaValue(catalogItem.cashAmountCents) : undefined,
          priceCurrency: catalogItem ? "USD" : undefined,
        }}
      />
      <StructuredData type="FAQ" faqs={page.faqs} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-base-content/70">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/procedures" className="hover:underline">
              Procedures
            </Link>
          </li>
          <li aria-hidden="true" className="text-base-content/40">
            &gt;
          </li>
          <li>
            <Link href={hubPath(page.hubSlug)} className="hover:underline">
              {hubLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="text-base-content/40">
            &gt;
          </li>
          <li className="text-base-content">{page.label}</li>
        </ol>
      </nav>

      <header className="mb-10 md:mb-14 max-w-3xl text-left">
        <h1 className="text-3xl md:text-5xl font-light leading-tight">{page.h1}</h1>
        {page.intro.map((paragraph) => (
          <p key={paragraph} className="text-base md:text-lg text-base-content/75 mt-4">
            {paragraph}
          </p>
        ))}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button asChild>
            <Link href={page.consultHref}>{page.ctaLabel}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={hubPath(page.hubSlug)}>{SATELLITE_TEMPLATE_COPY.hubButton(page.hubSlug)}</Link>
          </Button>
        </div>
      </header>

      {page.hubSlug === "hyperhidrosis-treatment" && page.slug === "underarm-sweating" && <HyperhidrosisSteps />}

      <section className="mb-10 md:mb-14 rounded-xl border border-base-300 p-5 md:p-6" id="pricing">
        <h2 className="text-2xl md:text-3xl font-light mb-3">{page.price.heading}</h2>
        <p className="text-2xl font-semibold tracking-tight text-base-content mb-3">{page.price.label}</p>
        <p className="text-base md:text-lg text-base-content/80">{page.price.body}</p>
      </section>

      {page.sections.map((section) => (
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
          {section.routeMap && (
            <figure className="my-6 max-w-3xl overflow-hidden rounded-2xl border border-base-300">
              <PeninsulaRouteMap route={section.routeMap} size="large" />
              <figcaption className="flex flex-col gap-3 border-t border-base-300 bg-base-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-base-content/75">Schematic map, not to scale. Numbers match the steps below.</span>
                <a
                  href={peninsulaDirectionsHref(page.label)}
                  target="_blank"
                  rel="noopener"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Open directions
                </a>
              </figcaption>
            </figure>
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

      {page.safety && (
        <section className="mb-10 md:mb-14 rounded-xl border border-base-300 bg-base-200/60 p-5 md:p-6">
          <h2 className="text-2xl md:text-3xl font-light mb-3">{page.safety.heading}</h2>
          <p className="text-base md:text-lg text-base-content/80">{page.safety.body}</p>
        </section>
      )}

      <section className="mb-10 md:mb-14" id="faqs">
        <h2 className="text-2xl md:text-3xl font-light mb-3">{SATELLITE_TEMPLATE_COPY.faqHeading}</h2>
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
        <h2 className="text-2xl md:text-3xl font-light mb-3">{SATELLITE_TEMPLATE_COPY.relatedHeading}</h2>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-secondary transition-colors hover:text-base-content after:ml-2 after:text-base-content/30 after:content-['·'] last:after:content-none">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <TextToBook
          heading={SATELLITE_TEMPLATE_COPY.bookHeading}
          intro={SATELLITE_TEMPLATE_COPY.bookIntro}
          message={page.textMessage}
          location="service_page"
        />
        <div className="mt-4">
          <Button asChild>
            <Link href={page.consultHref}>{page.ctaLabel}</Link>
          </Button>
        </div>
      </section>
      {page.footnote && <p className="mt-10 text-xs leading-relaxed text-base-content/80">{page.footnote}</p>}
    </main>
  );
}
