import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AilmentProcessVisualization from "components/ailment-process-visualization";
import CtaButtons from "components/cta-buttons";
import CtaFooter from "components/cta-footer";
import StructuredData from "components/structured-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import { Badge } from "components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { getAilmentPageData, isAilmentPagePublished } from "lib/ailments/get-ailment-page-data";
import ProviderCallout from "views/provider-callout";

const ORIGIN = "https://www.williamsburgmedspa.com";

type Params = {
  params: {
    slug: string;
    "ailment-slug": string;
  };
};

const ailmentTagLabels: Record<string, string> = {
  common: "Commonly Treated",
  uncommon: "Less Common Area",
  experimental: "Ask About Clinical Options",
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const ailmentPage = await getAilmentPageData(params.slug, params["ailment-slug"]);
  if (!ailmentPage) {
    return {
      title: "Procedure",
      description: "",
    };
  }

  const { procedure, ailment, metadata } = ailmentPage;
  const canonical = `/procedures/${procedure.slug}/for/${ailment.slug}`;
  const shareImage = metadata.mechanismImage.startsWith("http")
    ? metadata.mechanismImage
    : `${ORIGIN}${metadata.mechanismImage}`;

  return {
    title: metadata.seoTitle,
    description: metadata.seoDescription,
    alternates: { canonical },
    robots: isAilmentPagePublished(metadata) ? undefined : { index: false, follow: false },
    openGraph: {
      title: metadata.seoTitle,
      description: metadata.seoDescription,
      url: canonical,
      siteName: "Williamsburg Med Spa",
      images: [
        {
          url: shareImage,
          alt: metadata.mechanismImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.seoTitle,
      description: metadata.seoDescription,
      images: [shareImage],
    },
  };
}

export default async function AilmentPage({ params }: Params) {
  const procedureSlug = params.slug;
  const ailmentSlug = params["ailment-slug"];

  const ailmentPage = await getAilmentPageData(procedureSlug, ailmentSlug);
  if (!ailmentPage) return notFound();

  const { procedure, ailment, metadata, relatedAilments } = ailmentPage;
  const canonical = `/procedures/${procedure.slug}/for/${ailment.slug}`;
  const heroImage = metadata.mechanismImage;
  const heroImageAlt = metadata.mechanismImageAlt;

  return (
    <>
      <StructuredData
        type="Breadcrumb"
        breadcrumbItems={[
          { name: "Home", item: `${ORIGIN}/` },
          { name: "Procedures", item: `${ORIGIN}/procedures` },
          { name: procedure.name, item: `${ORIGIN}/procedures/${procedure.slug}` },
          { name: ailment.title, item: `${ORIGIN}${canonical}` },
        ]}
      />
      <StructuredData
        type="Service"
        service={{
          name: `${procedure.name} for ${ailment.title}`,
          description: metadata.seoDescription,
          areaServed: "Williamsburg, VA",
        }}
      />
      <StructuredData type="FAQ" faqs={metadata.faqs} />

      <div className="max-w-7xl mx-auto py-16">
        <section className="text-center scroll-mt-24" id="overview">
          <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto mb-6 text-sm text-base-content/70">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/procedures" className="link link-hover no-underline hover:underline">
                  Procedures
                </Link>
              </li>
              <li aria-hidden="true" className="text-base-content/40">
                &gt;
              </li>
              <li>
                <Link href={`/procedures/${procedure.slug}`} className="link link-hover no-underline hover:underline">
                  {procedure.name}
                </Link>
              </li>
              <li aria-hidden="true" className="text-base-content/40">
                &gt;
              </li>
              <li className="text-base-content">for {ailment.title}</li>
            </ol>
          </nav>
          <div className="max-w-6xl mx-auto mb-8">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-base-300 bg-base-200">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1152px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl mx-auto leading-tight pb-4">{metadata.heroHeadline}</h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-5xl mx-auto font-light">{metadata.heroSubheadline}</p>
          <p className="text-lg max-w-4xl mx-auto">{metadata.description}</p>
          <div className="my-8">
            <CtaButtons />
          </div>
          <p className="text-sm md:text-base text-base-content/70 max-w-3xl mx-auto">
            Serving patients from Williamsburg, James City County, Yorktown, Newport News, and nearby communities.{" "}
            <Link href="/locations/williamsburg-va" className="link link-primary">
              View our Williamsburg location
            </Link>
            .
          </p>
        </section>

        <section className="my-32 max-w-5xl mx-auto scroll-mt-24" id="pain">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">{metadata.painHeading}</h2>
          <div className="rounded-2xl border border-base-300 bg-base-200 p-6 md:p-10 space-y-4">
            {metadata.painParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-base md:text-lg text-base-content/80 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="my-32 max-w-6xl mx-auto scroll-mt-24" id="how-it-works">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">{metadata.mechanismHeading}</h2>
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-base md:text-lg text-base-content/80 leading-relaxed">
              {metadata.mechanismParagraphs.join(" ")}
            </p>
          </div>

          {metadata.processVisualization ? (
            <AilmentProcessVisualization data={metadata.processVisualization} />
          ) : (
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="relative aspect-[16/9] bg-base-200 rounded-2xl overflow-hidden border border-base-300">
                <Image
                  src={metadata.mechanismImage}
                  alt={metadata.mechanismImageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
              </div>
            </div>
          )}
        </section>

        <section className="my-32 max-w-6xl mx-auto scroll-mt-24" id="expectations">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
            {metadata.expectationsHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {metadata.expectationsSteps.map((step, index) => (
              <Card key={step.title} className="border-4 border-primary bg-primary text-primary-content text-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-full bg-primary-content text-primary text-sm font-semibold">
                      {index + 1}
                    </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>{step.description}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {Boolean(relatedAilments.length) && (
          <section className="my-32 max-w-7xl mx-auto scroll-mt-24" id="related">
            <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
              Explore Other Areas We Treat with <span className="font-bold">{procedure.name}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {relatedAilments.map((relatedAilment) => (
                <Card key={relatedAilment.slug} className="text-left border-2 h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      <span>{relatedAilment.title}</span>
                      <Badge className="bg-primary text-white hover:bg-primary-focus border-transparent">
                        {ailmentTagLabels[relatedAilment.tag] ?? "Treatment Area"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="mb-6">{relatedAilment.description}</p>
                    <Button asChild className="mt-auto w-fit">
                      <Link href={`/procedures/${procedure.slug}/for/${relatedAilment.slug}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="my-32 max-w-5xl mx-auto scroll-mt-24" id="faqs">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">{metadata.faqHeading}</h2>
          <Accordion type="single" collapsible className="text-left mb-12">
            {metadata.faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="my-32 max-w-5xl mx-auto scroll-mt-24" id="provider">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-8 text-center font-light">
            About <span className="font-bold">Dr. Jenny</span>
          </h2>
          <ProviderCallout />
        </section>

        <CtaFooter />
      </div>
    </>
  );
}
