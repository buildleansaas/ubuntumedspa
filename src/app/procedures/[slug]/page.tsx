import { procedures } from "data";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";

import CtaFooter from "components/cta-footer";
import CatalogPurchasePanel from "components/catalog-purchase-panel";
import StructuredData from "components/structured-data";
import { twMerge } from "tailwind-merge";
import CtaButtons from "components/cta-buttons";
import { notFound } from "next/navigation";
import ProcedureTestimonials from "components/procedure-testimonials";
import { getPublishedAilmentsForProcedure } from "lib/ailments/get-ailment-page-data";
import { getPublishedBlogPosts } from "lib/blog";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { humanizeMedicalCopy } from "lib/humanize";

const ailmentsSortOrder = { common: 1, uncommon: 2, experimental: 3 };
const ailmentsTagLabels = {
  common: "Common Treatment Area",
  uncommon: "Less Common Area",
  experimental: "Clinical Evaluation Needed",
};

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params) {
  const procedure = procedures.find((med) => med.slug === params.slug);
  const { title, description } = procedure?.seo ?? {
    title: "Procedure",
    description: "",
  };

  const withLocation = /williamsburg/i.test(title) ? title : `${title} in Williamsburg, VA`;
  const canonical = `/procedures/${params.slug}`;

  return {
    title: withLocation,
    description,
    alternates: { canonical },
    openGraph: {
      title: withLocation,
      description,
      url: canonical,
      siteName: "Williamsburg Med Spa",
      images: [
        {
          url: `${canonical}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: withLocation,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: withLocation,
      description,
      images: [`${canonical}/twitter-image`],
    },
    robots: "published" in (procedure || {}) && procedure?.published === false ? { index: false, follow: false } : undefined,
  };
}

export default async function ProcedurePage({ params: { slug } }: { params: { slug: string } }) {
  const procedure = procedures.find((procedure) => procedure.slug === slug);
  if (!procedure) return notFound();
  const catalogItem = getCatalogConfigBySlug(slug);
  const comparisonSlug = "botox-vs-xeomin-williamsburg-va";
  const publishedAilments = await getPublishedAilmentsForProcedure(procedure.slug);
  const articles = (await getPublishedBlogPosts())
    .filter(({ tags }) => tags?.includes(procedure.name))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const hasAilments = Boolean(publishedAilments.length);
  const showComparisonGuide =
    (procedure.slug === "botox" || procedure.slug === "xeomin") && articles.some((article) => article.slug === comparisonSlug);

  return (
    <>
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Procedures", procedure.name]} />
      <StructuredData
        type="Service"
        service={{ name: procedure.name, description: procedure.description, areaServed: "Williamsburg, VA" }}
      />
      <StructuredData type="FAQ" faqs={procedure.faqs} />
      <div className="max-w-7xl mx-auto py-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl mx-auto leading-tight pb-4">
            <span className="font-bold">{procedure.name}</span> by Williamsburg Med Spa
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-5xl mx-auto font-light">{humanizeMedicalCopy(procedure.headline)}</p>
          <p className="text-lg max-w-4xl mx-auto">{humanizeMedicalCopy(procedure.description)}</p>
          <div className="flex space-x-4 mx-auto my-8 justify-center">
            <Button asChild>
              <Link href="/consult">Book a Consultation</Link>
            </Button>
            {Boolean(articles.length) && (
              <Button asChild variant="secondary">
                <Link href="#benefits">Explore Benefits</Link>
              </Button>
            )}
            {showComparisonGuide && (
              <Button asChild variant="outline">
                <Link href={`/blog/${comparisonSlug}`}>Botox vs Xeomin Guide</Link>
              </Button>
            )}
          </div>
          <p className="text-sm md:text-base text-base-content/70 max-w-3xl mx-auto">
            Serving patients from Williamsburg, James City County, Yorktown, Newport News, and nearby communities.
            {" "}
            <Link href="/locations/williamsburg-va" className="link link-primary">
              View our Williamsburg location
            </Link>
            .
          </p>
          <p className="text-xs md:text-sm text-base-content/60 max-w-3xl mx-auto mt-3">
            Educational content only. Treatment suitability, risk profile, and expected response are confirmed during
            consultation.
          </p>
          {catalogItem && (
            <CatalogPurchasePanel
              slug={catalogItem.slug}
              kind={catalogItem.kind}
              name={catalogItem.name}
              displayPrice={catalogItem.displayPrice}
              pricingMode={catalogItem.pricingMode}
              unitAmountCents={catalogItem.unitAmountCents}
              quantityLabel={catalogItem.quantityLabel}
              minQuantity={catalogItem.minQuantity}
              maxQuantity={catalogItem.maxQuantity}
              fulfillment={catalogItem.fulfillment}
              customerNote={catalogItem.customerNote}
            />
          )}
        </div>

        <div className="my-32 text-center max-w-5xl mx-auto" id="benefits">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
            <span className="font-bold">{procedure.name}</span> Benefits
          </h2>
          <p className="text-xl lg:text-2xl mb-8 font-light">{humanizeMedicalCopy(procedure.benefitsHeadline)}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {procedure.benefits.map(({ emoji, benefit, description }) => (
              <Card key={benefit} className="text-left bg-primary text-primary-content border-4 border-primary">
                <CardHeader>
                  <CardTitle>
                    {emoji} {benefit}
                  </CardTitle>
                </CardHeader>
                <CardContent>{humanizeMedicalCopy(description)}</CardContent>
              </Card>
            ))}
          </div>
          {Boolean(procedure.testimonials?.length) && (
            <ProcedureTestimonials procedureName={procedure.name} items={procedure.testimonials} />
          )}
          <CtaButtons />
        </div>

        {hasAilments && (
          <div className="my-32 text-center max-w-7xl mx-auto" id="applications">
            <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
              How can{" "}
              {[
                "o-shot",
                "p-shot",
                "prp-face-lift",
                "prp-facial",
                "prp-breast-lift",
              ].includes(procedure.slug) && "the "}
              <span className="font-bold">{procedure.name}</span> help me?
            </h2>
            <p className="text-xl lg:text-2xl mb-8 font-light text-justify">{humanizeMedicalCopy(procedure.ailmentsHeadline)}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {publishedAilments
                ?.sort((a, b) => ailmentsSortOrder[a.tag] - ailmentsSortOrder[b.tag])
                .map(({ title, tag, description, slug: ailmentSlug }) => {
                  const isBotox = procedure.slug === "botox";
                  const ctaHref = isBotox ? "/consult" : `/procedures/${procedure.slug}/for/${ailmentSlug}`;
                  const ctaLabel = isBotox ? "Discuss This Area" : "Learn More";

                  return (
                    <Card
                      key={title}
                      className={twMerge(
                        "text-left border-4",
                        tag === "common" && "bg-primary border-primary text-primary-content",
                        tag === "uncommon" && "bg-purple-500 border-purple-400 text-white",
                        tag === "experimental" && "bg-rose-500 border-rose-400 text-white"
                      )}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {title} <Badge>{ailmentsTagLabels[tag] ?? "Treatment Area"}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>{humanizeMedicalCopy(description)}</CardContent>
                      <CardFooter>
                        <Button asChild>
                          <Link href={ctaHref}>{ctaLabel}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
            <CtaButtons />
          </div>
        )}

        <div className="my-32 text-center max-w-5xl mx-auto" id="faqs">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
            Frequently Asked Questions about <span className="font-bold">{procedure.name}</span>
          </h2>
          <h2 className="text-xl lg:text-2xl mb-8 font-light">{humanizeMedicalCopy(procedure.faqHeadline)}</h2>
          <Accordion type="single" collapsible className="text-left mb-12">
            {procedure.faqs.map(({ question, answer }) => (
              <AccordionItem key={question} value={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <CtaButtons />
        </div>

        {Boolean(articles.length) && (
          <div className="my-32" id="posts">
            <div className="mb-16">
              <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
                More About <span className="font-semibold">{procedure.name}</span>
              </h2>
              <p className="text-lg lg:text-xl max-w-5xl mx-auto text-center">{humanizeMedicalCopy(procedure.blogHeadline)}</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {articles.map((article) => (
                <article key={article.slug} className="relative isolate flex flex-col gap-8 lg:flex-row">
                  <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0 bg-base-200">
                    <Image
                      src={article.image}
                      alt={article.imageAlt ?? article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 256px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 shadow-inner bg-gradient-to-br from-white/20" />
                  </div>
                  <div className="py-4">
                    <div className="flex flex-wrap items-center text-xs gap-2">
                      <Badge className="bg-purple-500 hover:bg-purple-600">
                        {new Date(article.date).toLocaleDateString("en-GB", {
                          dateStyle: "long",
                        })}
                      </Badge>
                      {article.tags.map((tag) => (
                        <Badge key={tag} className="bg-primary hover:bg-primary-focus">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="group relative max-w-xl">
                      <h2 className="mt-3 text-lg/snug sm:text-xl/snug md:text-2xl/snug font-semibold text-base-content hover:text-base-content/80">
                        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-primary-content">{humanizeMedicalCopy(article.description)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        {showComparisonGuide && (
          <div className="my-24 max-w-3xl mx-auto rounded-2xl border border-base-300 bg-base-200 p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">Still deciding between Botox and Xeomin?</h2>
            <p className="text-base md:text-lg text-base-content/80 mb-6">
              Review differences in timing, treatment planning, and candidacy before your appointment.
            </p>
            <Button asChild variant="secondary">
              <Link href={`/blog/${comparisonSlug}`}>Read the Botox vs Xeomin article</Link>
            </Button>
          </div>
        )}
        <CtaFooter />
      </div>
    </>
  );
}
