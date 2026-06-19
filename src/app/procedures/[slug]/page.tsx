import { procedures } from "data";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import CmaCredentialStrip from "components/cma-credential-strip";

import CtaFooter from "components/cta-footer";
import CatalogPurchasePanel from "components/catalog-purchase-panel";
import BlogPostCollection from "components/blog-post-collection";
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
const featuredGuideSlugs: Record<string, string> = {
  botox: "botox-vs-xeomin-williamsburg-va",
  xeomin: "botox-vs-xeomin-williamsburg-va",
  filler: "how-long-do-dermal-fillers-last-in-williamsburg-va",
  "o-shot": "o-shot-for-urinary-incontinence-williamsburg-va",
  "prp-hair-restoration": "prp-hair-restoration-vs-hair-transplant-williamsburg-va",
};
const featuredGuideCopy: Record<string, { button: string; heading: string; description: string; linkLabel: string }> = {
  botox: {
    button: "Botox vs Xeomin Guide",
    heading: "Still deciding between Botox and Xeomin?",
    description: "Review differences in timing, treatment planning, and candidacy before your appointment.",
    linkLabel: "Read the Botox vs Xeomin article",
  },
  xeomin: {
    button: "Botox vs Xeomin Guide",
    heading: "Still deciding between Xeomin and Botox?",
    description: "Review differences in timing, treatment planning, and candidacy before your appointment.",
    linkLabel: "Read the Botox vs Xeomin article",
  },
  filler: {
    button: "Filler Longevity Guide",
    heading: "Wondering how long dermal fillers last?",
    description:
      "Review how longevity can vary across lips, cheeks, under-eyes, and other treatment areas before you book.",
    linkLabel: "Read the dermal filler longevity guide",
  },
  "o-shot": {
    button: "O-Shot Bladder Leakage Guide",
    heading: "Wondering whether the O-Shot can help with bladder leakage?",
    description:
      "Review how stress leakage, urge leakage, pelvic floor care, and O-Shot candidacy fit into a private consultation.",
    linkLabel: "Read the O-Shot urinary incontinence guide",
  },
  "prp-hair-restoration": {
    button: "PRP vs Hair Transplant",
    heading: "Comparing PRP hair restoration with transplant surgery?",
    description:
      "Review how non-surgical PRP support differs from surgical follicle transplant planning before you choose a path.",
    linkLabel: "Read the PRP hair restoration vs hair transplant guide",
  },
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
  const heroImagePath = catalogItem?.imagePath;
  const publishedAilments = await getPublishedAilmentsForProcedure(procedure.slug);
  const articles = (await getPublishedBlogPosts())
    .filter(({ tags }) => tags?.includes(procedure.name))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const hasAilments = Boolean(publishedAilments.length);
  const showOShotCredential = procedure.slug === "o-shot";
  const pageHeading = procedure.seo?.title?.split("|")[0].trim() || `${procedure.name} in Williamsburg, VA`;
  const featuredGuide = articles.find((article) => article.slug === featuredGuideSlugs[procedure.slug]);
  const featuredGuideCta = featuredGuide ? featuredGuideCopy[procedure.slug] : undefined;
  const consultationSupportCopy =
    procedure.slug === "hyperhidrosis-treatment"
      ? "Consultation starts with the area bothering you most, whether that is underarms, palms, feet, or another localized sweating pattern, and whether Xeomin is a good fit."
      : procedure.slug === "o-shot"
        ? "Consultation covers symptoms, candidacy, treatment areas, expected timing, and whether O-Shot® care fits your intimate wellness or bladder leakage concerns."
      : procedure.slug === "blomdahl-ear-piercing"
        ? "Ear piercing visits cover age or sensitivity questions, Blomdahl starter earring options, placement, aftercare, and whether the appointment is for a child, teen, adult, or re-piercing."
      : procedure.slug === "microneedling-with-prp"
        ? "Consultation covers skin goals, acne-scar or texture concerns, PRP candidacy, downtime, aftercare, and whether microneedling with PRP or another skin option is the better fit."
      : `Consultation covers candidacy, treatment areas, expected timing, and whether ${procedure.name} fits your goals with a conservative, natural-looking plan.`;
  const hyperhidrosisFeaturedAilments =
    procedure.slug === "hyperhidrosis-treatment"
      ? ["underarm-sweating", "sweaty-palms", "sweaty-feet"]
          .map((featuredSlug) => publishedAilments.find((ailment) => ailment.slug === featuredSlug))
          .filter((ailment): ailment is NonNullable<typeof ailment> => Boolean(ailment))
      : [];

  return (
    <>
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Procedures", procedure.name]} />
      <StructuredData
        type="Service"
        service={{ name: procedure.name, description: procedure.description, areaServed: "Williamsburg, VA" }}
      />
      <StructuredData type="FAQ" faqs={procedure.faqs} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="grid items-center gap-10 border-b border-base-300 pb-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="text-left">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-primary">Williamsburg med spa procedure</p>
            <h1 className="max-w-4xl text-4xl font-light leading-tight tracking-tight text-base-content md:text-6xl">
              {pageHeading}
            </h1>
            <p className="mt-5 max-w-3xl text-xl font-light leading-relaxed text-base-content/85 lg:text-2xl">
              {humanizeMedicalCopy(procedure.headline)}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-base-content/70 md:text-lg">
              {humanizeMedicalCopy(procedure.subline)}
            </p>
            {showOShotCredential && <CmaCredentialStrip className="mt-6 max-w-3xl" />}
            {procedure.slug === "hyperhidrosis-treatment" && (
              <div className="mt-6 flex flex-wrap gap-2 text-sm">
                {[
                  ["Underarm sweating", "/procedures/hyperhidrosis-treatment/for/underarm-sweating"],
                  ["Treatment areas", "#applications"],
                  ["Pricing", "#pricing"],
                  ["FAQs", "#faqs"],
                  ["Botox vs Xeomin", "/blog/botox-vs-xeomin-williamsburg-va"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-base-content/75 transition hover:border-primary hover:text-primary"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
            {procedure.slug === "microneedling-with-prp" && (
              <div className="mt-6 flex flex-wrap gap-2 text-sm">
                {[
                  ["Acne scars", "#applications"],
                  ["Skin texture", "#applications"],
                  ["Downtime", "#faqs"],
                  ["PRP Facial", "/procedures/prp-facial"],
                  ["Book consult", "/consult?procedure=microneedling-with-prp&utm_source=website&utm_medium=procedure_page&utm_campaign=microneedling_prp"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-base-content/75 transition hover:border-primary hover:text-primary"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
            {procedure.slug === "blomdahl-ear-piercing" && (
              <div className="mt-6 flex flex-wrap gap-2 text-sm">
                {[
                  ["Children's Ear Piercing", "/procedures/blomdahl-ear-piercing/for/children"],
                  ["Sensitive Ears", "/procedures/blomdahl-ear-piercing/for/sensitive-ears"],
                  ["Re-Piercing", "/procedures/blomdahl-ear-piercing/for/re-piercing"],
                  ["Williamsburg", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
                  ["Yorktown", "/procedures/blomdahl-ear-piercing/near/yorktown-va"],
                  ["Newport News", "/procedures/blomdahl-ear-piercing/near/newport-news-va"],
                  ["Toano", "/procedures/blomdahl-ear-piercing/near/toano-va"],
                  ["Norge", "/procedures/blomdahl-ear-piercing/near/norge-va"],
                  ["Lightfoot", "/procedures/blomdahl-ear-piercing/near/lightfoot-va"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-base-content/75 transition hover:border-primary hover:text-primary"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Button asChild>
                <Link
                  href={
                    procedure.slug === "blomdahl-ear-piercing"
                      ? "/consult?procedure=blomdahl-ear-piercing&utm_source=website&utm_medium=procedure_page&utm_campaign=ear_piercing"
                      : procedure.slug === "microneedling-with-prp"
                        ? "/consult?procedure=microneedling-with-prp&utm_source=website&utm_medium=procedure_page&utm_campaign=microneedling_prp"
                        : "/consult"
                  }
                >
                  {procedure.slug === "blomdahl-ear-piercing"
                    ? "Book Blomdahl Ear Piercing"
                    : procedure.slug === "microneedling-with-prp"
                      ? "Book Microneedling with PRP Consult"
                      : "Book a Consultation"}
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={catalogItem ? "#pricing" : "#benefits"}>{catalogItem ? "View Pricing" : "Explore Benefits"}</Link>
              </Button>
              {featuredGuide && featuredGuideCta && (
                <Button asChild variant="outline">
                  <Link href={featuredGuide.href}>{featuredGuideCta.button}</Link>
                </Button>
              )}
            </div>
          </div>

          {heroImagePath && (
            <div className="relative overflow-hidden rounded-[2rem] border border-base-300 bg-base-200 shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src={heroImagePath}
                  alt={`${procedure.name} at Williamsburg Med Spa`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </section>

        <section className="mx-auto max-w-5xl pt-10 text-center" id="pricing">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {catalogItem ? "Pricing & booking" : "Treatment planning"}
          </p>
          {procedure.slug === "blomdahl-ear-piercing" ? (
            <>
              <h2 className="mt-3 text-3xl font-light tracking-tight text-base-content md:text-4xl">
                Clear Blomdahl ear piercing pricing before you visit
              </h2>
              <div className="mx-auto mt-6 grid max-w-4xl gap-4 text-left md:grid-cols-3">
                {[
                  ["$45", "One ear", "Starter jewelry and visit details reviewed when scheduling."],
                  ["$80", "Both ears", "A simple pair price for families booking both ears in one visit."],
                  ["Nurse-led", "Placement + aftercare", "Jenny Coleman, MSN, RN, CPNP, PMHS reviews fit and care."],
                ].map(([price, label, copy]) => (
                  <div key={label} className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                    <p className="text-3xl font-semibold tracking-tight text-base-content">{price}</p>
                    <h3 className="mt-2 text-base font-semibold text-base-content">{label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/70">{copy}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-3xl font-light tracking-tight text-base-content md:text-4xl">
                A conservative plan built around your goals
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-base-content/70 md:text-lg">
                {consultationSupportCopy}
              </p>
            </>
          )}

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
        </section>

        <section className="mx-auto mt-10 max-w-4xl text-left">
          <p className="text-base leading-relaxed text-base-content/75">{humanizeMedicalCopy(procedure.description)}</p>
          <p className="mt-3 text-sm leading-relaxed text-base-content/65">{consultationSupportCopy}</p>
          <p className="mt-4 text-sm text-base-content/70">
            Serving patients from Williamsburg, James City County, Yorktown, Newport News, Toano, Norge, Lightfoot, and nearby communities. {" "}
            <Link href="/locations" className="link link-primary">
              Compare nearby service areas
            </Link>
            {" "}or{" "}
            <Link href="/locations/williamsburg-va" className="link link-primary">
              view our Williamsburg location
            </Link>
            .
          </p>
          <p className="mt-3 text-xs text-base-content/55">
            Educational content only. Treatment suitability, risk profile, and expected response are confirmed during consultation.
          </p>
        </section>

        {procedure.slug === "blomdahl-ear-piercing" && (
          <section className="mx-auto mt-12 max-w-4xl text-left">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Nearby pages</p>
              <h2 className="mt-3 text-2xl font-light tracking-tight text-base-content">Plan around your route</h2>
              <p className="mt-3 text-base leading-relaxed text-base-content/70">
                Start with the local page closest to your visit for directions, expectations, and family planning notes.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["Williamsburg", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
                  ["James City County", "/procedures/blomdahl-ear-piercing/near/james-city-county-va"],
                  ["Yorktown", "/procedures/blomdahl-ear-piercing/near/yorktown-va"],
                  ["Newport News", "/procedures/blomdahl-ear-piercing/near/newport-news-va"],
                  ["Toano", "/procedures/blomdahl-ear-piercing/near/toano-va"],
                  ["Norge", "/procedures/blomdahl-ear-piercing/near/norge-va"],
                  ["Lightfoot", "/procedures/blomdahl-ear-piercing/near/lightfoot-va"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-center justify-between rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-sm font-medium text-base-content transition hover:border-primary hover:text-primary"
                  >
                    <span>{label}</span>
                    <span aria-hidden="true" className="text-base-content/35 transition group-hover:translate-x-0.5 group-hover:text-primary">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="text-center">
          {Boolean(hyperhidrosisFeaturedAilments.length) && (
            <div className="mt-10 max-w-4xl mx-auto">
              <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">Popular symptom pages</p>
              <p className="mt-3 text-base md:text-lg leading-relaxed text-base-content/75">
                Start with the symptom page that best matches what is disrupting daily life most.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {hyperhidrosisFeaturedAilments.map((ailment) => (
                  <Button key={ailment.slug} asChild variant="secondary" size="sm">
                    <Link href={`/procedures/${procedure.slug}/for/${ailment.slug}`}>{ailment.title}</Link>
                  </Button>
                ))}
              </div>
            </div>
          )}

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
                          <Link href={`/procedures/${procedure.slug}/for/${ailmentSlug}`}>Learn More</Link>
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
          <section className="my-32 scroll-mt-28" id="posts" aria-labelledby="procedure-posts-heading">
            <div className="mx-auto max-w-6xl px-6 md:px-0">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.22em] text-base-content/60">Related Guidance</p>
                  <h2
                    id="procedure-posts-heading"
                    className="mt-3 text-4xl/snug font-light tracking-tight text-base-content text-balance sm:text-5xl/snug md:text-6xl/snug"
                  >
                    More About <span className="font-semibold">{procedure.name}</span>
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="self-start rounded-md border border-base-300 px-4 py-2 text-sm font-medium text-base-content transition-colors hover:border-primary/40 hover:bg-base-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 md:self-auto"
                >
                  View all articles
                </Link>
              </div>
              <p className="mt-5 max-w-4xl text-base leading-relaxed text-base-content/70 md:text-lg">
                {humanizeMedicalCopy(procedure.blogHeadline)}
              </p>
              <BlogPostCollection articles={articles} />
            </div>
          </section>
        )}
        {featuredGuide && featuredGuideCta && (
          <div className="my-24 max-w-3xl mx-auto border-t border-base-300 pt-10 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">{featuredGuideCta.heading}</h2>
            <p className="text-base md:text-lg text-base-content/80 mb-6">{featuredGuideCta.description}</p>
            <Button asChild variant="secondary">
              <Link href={featuredGuide.href}>{featuredGuideCta.linkLabel}</Link>
            </Button>
          </div>
        )}
        <CtaFooter />
      </div>
      </div>
    </>
  );
}
