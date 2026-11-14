import { procedures } from "data";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import CmaCredentialStrip from "components/cma-credential-strip";
import {
  AFTER_HEADER,
  BUTTON_ROW,
  CARD,
  CARD_GRID,
  CARD_GRID_2,
  CARD_LINK,
  CARD_TITLE,
  SPLIT,
  SPLIT_MEDIA,
  SPLIT_TEXT,
  Section,
  SectionHeader,
  cardGridFor,
} from "components/layout";

import CtaFooter from "components/cta-footer";
import CatalogPurchasePanel from "components/catalog-purchase-panel";
import BlogPostCollection from "components/blog-post-collection";
import StructuredData from "components/structured-data";
import CtaButtons from "components/cta-buttons";
import TrackedPhoneLink from "components/tracked-phone-link";
import { notFound } from "next/navigation";
import NamedReviews from "components/named-reviews";
import ProcedureTestimonials from "components/procedure-testimonials";
import { getPublishedAilmentsForProcedure } from "lib/ailments/get-ailment-page-data";
import { getPublishedBlogPosts } from "lib/blog";
import { EAR_PIERCING_PRICES, getCatalogConfigBySlug } from "config/commerce-catalog";
import { humanizeMedicalCopy } from "lib/humanize";
import { cashCardProse, cardPriceSchemaValue } from "lib/price";
import { EAR_PIERCING_BOOKING } from "lib/ear-piercing-booking";
import { getHubSatelliteGroup } from "lib/service-satellites";
import { CrowsFeetResults, EarPiercingPhotos, HyperhidrosisSteps, JointPhotos, PrpTubePhoto, RunelsTraining } from "components/clinic-photos";
import { clinicPhotoBySrc } from "config/clinic-photos";
import { activeOfferMetaDescription, getActiveOffers } from "config/offers";
import { XEOMIN_HYPERHIDROSIS_OFF_LABEL, XEOMIN_OFF_LABEL_NOTE, xeominClusterPages } from "lib/xeomin-concerns";
import HomeOwnerLink, { HOME_OWNER_LINK_PROCEDURES } from "components/home-owner-link";

// Quiet in-page links under the hero, separated by a middle dot.
const HERO_LINKS = "mt-6 flex flex-wrap gap-x-2 gap-y-1 text-sm";
const HERO_LINK =
  "text-secondary transition-colors hover:text-base-content after:ml-2 after:text-base-content/30 after:content-['·'] last:after:content-none";

const ailmentsSortOrder = { common: 1, uncommon: 2, experimental: 3 };
const ailmentsTagLabels = {
  common: "Common Treatment Area",
  uncommon: "Less Common Area",
  experimental: "Clinical Evaluation Needed",
};
const featuredGuideSlugs: Record<string, string> = {
  botox: "botox-vs-xeomin-williamsburg-va",
  xeomin: "botox-vs-xeomin-williamsburg-va",
  "oh-shot": "oh-shot-for-urinary-incontinence-williamsburg-va",
  "prp-hair-restoration": "prp-hair-restoration-vs-hair-transplant-williamsburg-va",
  "blomdahl-ear-piercing": "medical-ear-piercing-vs-mall-piercing",
};
const featuredGuideCopy: Record<string, { button: string; heading: string; description: string; linkLabel: string }> = {
  botox: {
    button: "Xeomin vs Botox Guide",
    heading: "Had Botox® before and wondering how Xeomin compares?",
    description: "We use Xeomin® only. Review how it compares with Botox® on timing, dosing units, and treatment planning before your appointment.",
    linkLabel: "Read the Xeomin vs Botox article",
  },
  xeomin: {
    button: "Xeomin vs Botox Guide",
    heading: "Comparing Xeomin with Botox®?",
    description: "We use Xeomin® only. Review how it compares with Botox® on timing, dosing units, and treatment planning before your appointment.",
    linkLabel: "Read the Xeomin vs Botox article",
  },
  "oh-shot": {
    button: "OH-Shot Bladder Leakage Guide",
    heading: "Wondering whether the OH-Shot can help with bladder leakage?",
    description:
      "Review how stress leakage, urge leakage, pelvic floor care, and OH-Shot candidacy fit into a private consultation.",
    linkLabel: "Read the OH-Shot urinary incontinence guide",
  },
  "prp-hair-restoration": {
    button: "PRP vs Hair Transplant",
    heading: "Comparing PRP hair restoration with transplant surgery?",
    description:
      "Review how non-surgical PRP support differs from surgical follicle transplant planning before you choose a path.",
    linkLabel: "Read the PRP hair restoration vs hair transplant guide",
  },
  "blomdahl-ear-piercing": {
    button: "Blomdahl vs Mall Piercing",
    heading: "Comparing Blomdahl with mall ear piercing?",
    description:
      "Review the differences in setting, sterile single-use equipment, starter jewelry, pediatric-aware support, and aftercare before you book.",
    linkLabel: "Read the Blomdahl vs mall ear piercing guide",
  },
};

const relatedProcedureLinks: Record<string, Array<{ href: string; label: string }>> = {
  botox: [
    { href: "/procedures/xeomin", label: "Xeomin" },
    { href: "/procedures/hyperhidrosis-treatment", label: "sweating treatment" },
  ],
  xeomin: [
    { href: "/procedures/botox", label: "Botox alternative in Williamsburg" },
    { href: "/procedures/hyperhidrosis-treatment", label: "sweating treatment" },
  ],
  "prp-facial": [
    { href: "/procedures/microneedling-with-prp", label: "microneedling with PRP" },
    { href: "/procedures/prp-face-lift", label: "PRP Face Lift" },
    { href: "/blog/hydrafacial-alternatives-in-williamsburg-va", label: "HydraFacial alternatives in Williamsburg" },
  ],
  "microneedling-with-prp": [
    { href: "/procedures/prp-facial", label: "PRP Facial" },
    { href: "/procedures/prp-face-lift", label: "PRP Face Lift" },
  ],
};

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Params) {
  const params = await props.params;
  const procedure = procedures.find((med) => med.slug === params.slug);
  const seo = procedure?.seo;
  const headingTitle = seo?.title ?? "Procedure";
  const description = activeOfferMetaDescription(`/procedures/${params.slug}`) ?? seo?.description ?? "";
  const documentTitle =
    seo && "documentTitle" in seo && typeof seo.documentTitle === "string" && seo.documentTitle
      ? seo.documentTitle
      : /williamsburg/i.test(headingTitle)
        ? headingTitle
        : `${headingTitle} in Williamsburg, VA`;
  const canonical = `/procedures/${params.slug}`;

  return {
    title: documentTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: documentTitle,
      description,
      url: canonical,
      siteName: "Williamsburg Med Spa",
      images: [
        {
          url: `${canonical}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: documentTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: documentTitle,
      description,
      images: [`${canonical}/twitter-image`],
    },
    robots: "published" in (procedure || {}) && procedure?.published === false ? { index: false, follow: false } : undefined,
  };
}

export default async function ProcedurePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  const {
    slug
  } = params;

  const procedure = procedures.find((procedure) => procedure.slug === slug);
  if (!procedure) return notFound();
  // The /procedures/botox page is the Botox-alternative page: it sells the Xeomin item (the clinic does not offer Botox® brand).
  const catalogItem = getCatalogConfigBySlug(("catalogSlug" in procedure && procedure.catalogSlug) || slug);
  const heroImagePath = catalogItem?.imagePath;
  const heroClinicPhoto = heroImagePath ? clinicPhotoBySrc(heroImagePath) : undefined;
  const publishedAilments = await getPublishedAilmentsForProcedure(procedure.slug);
  const articles = (await getPublishedBlogPosts())
    .filter(({ tags }) => tags?.includes(procedure.slug === "botox" ? "Botox Alternative" : procedure.name))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const hasAilments = Boolean(publishedAilments.length);
  const showOShotCredential = procedure.slug === "oh-shot";
  const pageHeading =
    (procedure.seo && "h1" in procedure.seo ? procedure.seo.h1 : undefined) ||
    procedure.seo?.title?.split("|")[0].trim() ||
    `${procedure.name} in Williamsburg, VA`;
  const featuredGuide = articles.find((article) => article.slug === featuredGuideSlugs[procedure.slug]);
  const featuredGuideCta = featuredGuide ? featuredGuideCopy[procedure.slug] : undefined;
  const relatedLinks = relatedProcedureLinks[procedure.slug] ?? [];
  const satelliteGroup = getHubSatelliteGroup(procedure.slug);
  const ownerConsultationHref =
    procedure.slug === "prp-breast-lift"
      ? "/consult?procedure=prp-breast-lift&utm_source=website&utm_medium=procedure_page&utm_campaign=prp_breast_lift"
      : procedure.slug === "prp-hair-restoration"
        ? "/consult?procedure=prp-hair-restoration&utm_source=website&utm_medium=procedure_page&utm_campaign=prp_hair_restoration"
        : procedure.slug === "b12-injections"
          ? "/consult?procedure=b12-injections&utm_source=website&utm_medium=procedure_page&utm_campaign=b12_injections"
          : undefined;
  const consultationSupportCopy =
    "consultationSupportCopy" in procedure && procedure.consultationSupportCopy
      ? procedure.consultationSupportCopy
      : procedure.slug === "prp-breast-lift"
      ? "This page does not document the clinic's current method or promise a cosmetic result. Ask for the current service details before purchasing the one-visit treatment."
      : procedure.slug === "prp-hair-restoration"
        ? "Start with a hair-loss consultation before paying. Jenny reviews your pattern, timeline, scalp symptoms, health history, medications, and whether PRP, medical evaluation, or a transplant specialist is the more useful next step."
      : procedure.slug === "hyperhidrosis-treatment"
      ? "Consultation starts with the area bothering you most, whether that is underarms, palms, feet, or another localized sweating pattern, and whether Xeomin is a good fit."
      : procedure.slug === "oh-shot"
        ? "Consultation covers symptoms, candidacy, treatment areas, expected timing, and whether OH-Shot care fits your intimate wellness or bladder leakage concerns."
      : procedure.slug === "blomdahl-ear-piercing"
        ? "Ear piercing visits cover age or sensitivity questions, Blomdahl starter earring options, placement, aftercare, and whether the appointment is for a child, teen, adult, or re-piercing."
      : procedure.slug === "microneedling-with-prp"
        ? "Consultation covers skin goals, acne-scar or texture concerns, PRP candidacy, downtime, aftercare, and whether microneedling with PRP or another skin option is the better fit."
      : `Consultation covers candidacy, treatment areas, expected timing, and whether ${procedure.name} fits your goals with a conservative, natural-looking plan.`;

  return (
    <>
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Procedures", procedure.name]} />
      <StructuredData
        type="Service"
        service={{
          name: procedure.name,
          description: procedure.description,
          areaServed: "Williamsburg, VA",
          // Offer price is the card / online price, which is what checkout charges.
          price: catalogItem ? cardPriceSchemaValue(catalogItem.cashAmountCents) : undefined,
          priceCurrency: catalogItem ? "USD" : undefined,
        }}
      />
      <StructuredData type="FAQ" faqs={procedure.faqs} />
      <Section tight>
        <div className={`${SPLIT} items-center`}>
          <div className={heroImagePath ? SPLIT_TEXT.even : "lg:col-span-9"}>
            <h1 className="font-display text-4xl font-light leading-tight tracking-tight text-base-content sm:text-5xl lg:text-6xl">
              {pageHeading}
            </h1>
            <p className="mt-6 max-w-[62ch] text-xl font-light leading-relaxed text-base-content/85 lg:text-2xl">
              {humanizeMedicalCopy(procedure.headline)}
            </p>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/70 md:text-lg">
              {humanizeMedicalCopy(procedure.subline)}
            </p>
            {(procedure.slug === "botox" || procedure.slug === "xeomin") && (
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-base-content/80" data-off-label-note>
                {XEOMIN_OFF_LABEL_NOTE}
              </p>
            )}
            {(procedure.slug === "hyperhidrosis-treatment" || procedure.slug === "xeomin") && (
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-base-content/80" data-off-label-note>
                {XEOMIN_HYPERHIDROSIS_OFF_LABEL}
              </p>
            )}
            {showOShotCredential && <CmaCredentialStrip className="mt-6 max-w-3xl" />}
            {procedure.slug === "hyperhidrosis-treatment" && (
              <div className={HERO_LINKS}>
                {[
                  ["Treatment areas", "#applications"],
                  ["Pricing", "#pricing"],
                  ["FAQs", "#faqs"],
                  ["Xeomin vs Botox", "/blog/botox-vs-xeomin-williamsburg-va"],
                ].map(([label, href]) => (
                  <Link key={href} href={href} className={HERO_LINK}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
            {procedure.slug === "microneedling-with-prp" && (
              <div className={HERO_LINKS}>
                {[
                  ["Acne scars", "#applications"],
                  ["Skin texture", "#applications"],
                  ["Downtime", "#faqs"],
                  ["PRP Facial", "/procedures/prp-facial"],
                  ["Book consult", "/consult?procedure=microneedling-with-prp&utm_source=website&utm_medium=procedure_page&utm_campaign=microneedling_prp"],
                ].map(([label, href]) => (
                  <Link key={href} href={href} className={HERO_LINK}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
            {procedure.slug === "blomdahl-ear-piercing" &&
              getActiveOffers()
                .filter((offer) => offer.learnMoreHref === "/procedures/blomdahl-ear-piercing")
                .map((offer) => (
                  <Link
                    key={offer.slug}
                    href={`/offers#${offer.slug}`}
                    data-offer-callout={offer.slug}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-content"
                  >
                    Offer: {offer.title} →
                  </Link>
                ))}
            {procedure.slug === "blomdahl-ear-piercing" && (
              <div className={HERO_LINKS}>
                {[
                  ["Infant & Kids Ear Piercing", "/procedures/blomdahl-ear-piercing/for/children"],
                  ["Sensitive Ears", "/procedures/blomdahl-ear-piercing/for/sensitive-ears"],
                  ["Re-Piercing", "/procedures/blomdahl-ear-piercing/for/re-piercing"],
                  ["Blomdahl vs Mall", "/blog/medical-ear-piercing-vs-mall-piercing"],
                  ["Aftercare", "/blog/ear-piercing-aftercare-williamsburg-va"],
                  ["Williamsburg", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
                  ["Yorktown", "/procedures/blomdahl-ear-piercing/near/yorktown-va"],
                  ["Newport News", "/procedures/blomdahl-ear-piercing/near/newport-news-va"],
                ].map(([label, href]) => (
                  <Link key={href} href={href} className={HERO_LINK}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
            {(procedure.slug === "botox" || procedure.slug === "xeomin") && (
              <div className={HERO_LINKS}>
                {xeominClusterPages.map((page) => (
                  <Link key={page.path} href={page.path} className={HERO_LINK}>
                    {page.label}
                  </Link>
                ))}
              </div>
            )}
            <div className={`mt-8 ${BUTTON_ROW}`}>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link
                  href={
                    procedure.slug === "blomdahl-ear-piercing"
                      ? EAR_PIERCING_BOOKING.hub
                      : procedure.slug === "microneedling-with-prp"
                        ? "/consult?procedure=microneedling-with-prp&utm_source=website&utm_medium=procedure_page&utm_campaign=microneedling_prp"
                        : procedure.slug === "prp-breast-lift"
                          ? "/consult?procedure=prp-breast-lift&utm_source=website&utm_medium=procedure_page&utm_campaign=prp_breast_lift"
                        : procedure.slug === "prp-hair-restoration"
                          ? "/consult?procedure=prp-hair-restoration&utm_source=website&utm_medium=procedure_page&utm_campaign=prp_hair_restoration"
                        : ownerConsultationHref ?? "/consult"
                  }
                >
                  {procedure.slug === "blomdahl-ear-piercing"
                    ? "Book Blomdahl Ear Piercing"
                    : procedure.slug === "microneedling-with-prp"
                      ? "Book Microneedling with PRP Consult"
                      : procedure.slug === "prp-breast-lift"
                        ? "Book a Private PRP Breast Consultation"
                        : procedure.slug === "prp-hair-restoration"
                          ? "Book a PRP Hair Consultation"
                        : "Book a Consultation"}
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                <Link href={catalogItem ? "#pricing" : "#benefits"}>{catalogItem ? "View Pricing" : "Explore Benefits"}</Link>
              </Button>
              {procedure.slug === "blomdahl-ear-piercing" && (
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <TrackedPhoneLink href="tel:+18047389483" location="service_page">
                    Call (804) 738-9483
                  </TrackedPhoneLink>
                </Button>
              )}
              {featuredGuide && featuredGuideCta && (
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href={featuredGuide.href}>{featuredGuideCta.button}</Link>
                </Button>
              )}
            </div>
          </div>

          {heroImagePath && (
            <div className={`relative overflow-hidden rounded-2xl bg-base-200 ${SPLIT_MEDIA.even}`}>
              <div className="relative aspect-[4/3]">
                <Image
                  src={heroImagePath}
                  alt={heroClinicPhoto?.alt ?? `${procedure.name} at Williamsburg Med Spa`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 576px"
                  className={heroClinicPhoto ? "object-cover object-[50%_25%]" : "object-cover"}
                />
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Real clinic photos sit right under the hero (Austin, 2026-11-05: proof of work higher on the page). */}
      {procedure.slug === "oh-shot" && <RunelsTraining />}
      {(procedure.slug === "botox" || procedure.slug === "xeomin") && <CrowsFeetResults />}
      {procedure.slug === "hyperhidrosis-treatment" && <HyperhidrosisSteps />}
      {procedure.slug === "blomdahl-ear-piercing" && <EarPiercingPhotos exclude={heroImagePath} />}
      {procedure.slug === "joint-restoration" && (
        <Section label="Jenny's joint treatment and orthopedic PRP training">
          <JointPhotos />
        </Section>
      )}
      {["prp-facial", "prp-hair-restoration", "joint-restoration"].includes(procedure.slug) && <PrpTubePhoto />}

      {/* The PRP Breast Lift copy below is locked by verify-seo, byte for byte. The wrapper only places it on the
          shared grid: it drops the block's own centring, divider lines and padding, and sets the shared H2 size. */}
      {procedure.slug === "prp-breast-lift" && (
        <Section className="[&>section]:mx-0 [&>section]:mt-0 [&>section]:border-y-0 [&>section]:py-0 md:[&>section_h2]:text-[2.75rem]">
        {/* PRP_BREAST_OWNER_COPY_CONTRACT_START */}
        {procedure.slug === "prp-breast-lift" && (
          <section className="mx-auto mt-12 max-w-4xl border-y border-base-300 py-10 text-left" aria-labelledby="prp-breast-lift-expectations">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Before you decide</p>
            <h2 id="prp-breast-lift-expectations" className="mt-3 text-3xl font-light tracking-tight text-base-content md:text-4xl">
              What a PRP Breast Lift can and cannot do
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-base-content/75 md:text-lg">
              <p>
                If you are comparing a breast lift in Williamsburg, VA, start here. The PRP visit ({cashCardProse(catalogItem?.cashAmountCents ?? 180000)}) is not mastopexy,
                implants, or fat transfer, and this page does not promise a cosmetic result.
              </p>
              <p>
                This page does not document the clinic&apos;s current method for this service and does not promise a cosmetic result. Before choosing it,
                ask the clinic to define what the service includes, how it is performed, and what one paid visit covers.
              </p>
              <p>
                Do not treat the name “PRP Breast Lift” as a promise of the structural changes associated with mastopexy, implants, or fat transfer.
                Compare the change you want with those distinct options before deciding what kind of appointment to book.
              </p>
            </div>

            <ol className="mt-8 grid gap-x-8 gap-y-6 border-t border-base-300 pt-7 sm:grid-cols-2">
              {[
                ["01", "Define the change you want", "Write down the appearance concern you want to discuss so you can compare this service with other cosmetic or surgical options."],
                ["02", "Request the current service details", "Ask the clinic what happens during the service, what the visit includes, and which written terms govern the purchase."],
                ["03", "Ask what is and is not promised", "Request a direct explanation of the intended cosmetic goal, the limits of that goal, and whether the clinic promises any result or timeline."],
                ["04", "Compare the alternatives", "If your goal involves removing skin, repositioning tissue, or adding volume, compare this service with an appropriate surgical consultation before deciding."],
              ].map(([number, title, copy]) => (
                <li key={number} className="grid grid-cols-[2.5rem_1fr] gap-3">
                  <span className="text-sm font-semibold tracking-[0.12em] text-primary">{number}</span>
                  <div>
                    <h3 className="font-semibold text-base-content">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-base-content/70">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 border-t border-base-300 pt-6 text-sm leading-relaxed text-base-content/70">
              Full upfront payment for one treatment visit is <strong className="font-semibold text-base-content">{catalogItem?.displayPrice}</strong>.
              The checkout is for one visit. Contact the clinic before purchasing if you need the current service details or written purchase terms.
            </p>
          </section>
        )}
        {/* PRP_BREAST_OWNER_COPY_CONTRACT_END */}
        </Section>
      )}

      {procedure.slug === "prp-hair-restoration" && (
        <Section labelledBy="prp-hair-fit">
          <SectionHeader id="prp-hair-fit" title="Is PRP a reasonable fit for your hair-loss pattern?" />
          <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-relaxed text-base-content/75 md:text-lg">
            <p>
              If you searched for a female hair transplant or a hairline transplant in Williamsburg, this visit is not that surgery. PRP does
              not move follicles. A transplant specialist may be more useful when the goal is to rebuild a hairline.
            </p>
            <p>
              Research suggests platelet-rich plasma may improve hair density for some people with pattern hair loss, but response varies and
              treatment protocols are not standardized. A consultation can review the pattern and whether medical or dermatology evaluation
              should come before a cosmetic treatment.
            </p>
            <p>
              PRP may support existing follicles. It does not create new follicles in a bald area, diagnose the cause of shedding, or move follicles
              the way hair transplant surgery does.
            </p>
          </div>

          <ul className={`${AFTER_HEADER} ${CARD_GRID}`}>
            {[
              ["PRP may belong in the conversation", "Gradual thinning, a widening part, lower density, or earlier pattern changes where follicles may still be active."],
              ["Medical evaluation may come first", "Sudden or patchy loss, rapid shedding, scalp pain, redness, scaling, or a new medication or health change."],
              ["A transplant specialist may be more useful", "Advanced bald areas or a goal that requires moving follicles to rebuild coverage or a hairline."],
            ].map(([title, copy]) => (
              <li key={title} className={CARD}>
                <h3 className={CARD_TITLE}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70">{copy}</p>
              </li>
            ))}
          </ul>

          <ol className={`mt-6 md:mt-8 ${CARD_GRID_2}`}>
            {[
              ["01", "Consultation and pattern review", "Review when the change started, where it is happening, scalp symptoms, health history, medications, prior treatment, and your goals."],
              ["02", "Blood draw and PRP preparation", "A small blood sample is processed to prepare the platelet-rich portion used for treatment."],
              ["03", "Targeted scalp treatment", "Jenny confirms the selected scalp areas and reviews what to expect before PRP is placed with small injections."],
              ["04", "Aftercare and next-step plan", "Leave with guidance for temporary tenderness, redness, swelling, bruising, or pinpoint bleeding and when to contact the office."],
            ].map(([number, title, copy]) => (
              <li key={number} className={CARD}>
                <span className="text-sm font-semibold tracking-wide text-primary">{number}</span>
                <h3 className={`mt-2 ${CARD_TITLE}`}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70">{copy}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-base-content/70">
            PRP hair restoration is <strong className="font-semibold text-base-content">{catalogItem?.displayPrice}</strong>. Book the consultation
            first if Jenny has not already reviewed your candidacy. If PRP fits your plan, purchase one session, then text or call Jenny
            to book it.
          </p>
        </Section>
      )}

      <Section id="pricing">
        <div className={`${SPLIT} items-start`}>
          <div className={catalogItem ? SPLIT_TEXT.even : "lg:col-span-9"}>
            <SectionHeader
              eyebrow={catalogItem ? "Pricing & booking" : "Treatment planning"}
              title={
                procedure.slug === "blomdahl-ear-piercing"
                  ? "Clear Blomdahl ear piercing pricing before you visit"
                  : "A conservative plan built around your goals"
              }
              intro={procedure.slug === "blomdahl-ear-piercing" ? undefined : consultationSupportCopy}
            />
            {procedure.slug === "blomdahl-ear-piercing" && (
              <div className={`${AFTER_HEADER} grid gap-6 sm:grid-cols-3 lg:grid-cols-1`}>
                {[
                  {
                    price: EAR_PIERCING_PRICES.oneEarCash,
                    card: EAR_PIERCING_PRICES.oneEarCard,
                    label: "One ear",
                    copy: "Starter jewelry and visit details reviewed when scheduling.",
                  },
                  {
                    price: EAR_PIERCING_PRICES.bothEarsCash,
                    card: EAR_PIERCING_PRICES.bothEarsCard,
                    label: "Both ears",
                    copy: "A simple pair price for families booking both ears in one visit.",
                  },
                  { price: "Nurse-led", card: null, label: "Placement + aftercare", copy: "Jenny Brady, MSN, RN, CPNP, PMHS reviews fit and care." },
                ].map(({ price, card, label, copy }) => (
                  <div key={label} className={`${CARD} lg:grid lg:grid-cols-2 lg:gap-x-6`}>
                    <div>
                      <p className="font-display text-3xl font-light tracking-tight text-base-content">{price}</p>
                      {card && <p className="mt-1 text-sm text-base-content/70">cash · {card} card/online</p>}
                    </div>
                    <div>
                      <h3 className="mt-3 text-base font-semibold text-base-content lg:mt-0">{label}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-base-content/70">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {catalogItem && (
            <div className={SPLIT_MEDIA.even}>
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
                purchaseLabel={catalogItem.purchaseLabel}
                customerNote={catalogItem.customerNote}
              />
            </div>
          )}
        </div>

        <div className="mt-16 max-w-3xl md:mt-20 [&>p]:max-w-[62ch]">
          <p className="text-base leading-relaxed text-base-content/75 md:text-lg">{humanizeMedicalCopy(procedure.description)}</p>
          {"trademarkNote" in procedure && procedure.trademarkNote && (
            <p className="mt-3 text-xs leading-relaxed text-base-content/80">{procedure.trademarkNote}</p>
          )}
          {procedure.slug !== "prp-breast-lift" && procedure.slug !== "prp-hair-restoration" && (
            <p className="mt-3 text-sm leading-relaxed text-base-content/80">{consultationSupportCopy}</p>
          )}
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
          <p className="mt-4 border-y border-base-300 py-4 text-sm leading-relaxed text-base-content/70">
            Care is provided by{" "}
            <Link href="/staff/jenny-brady" className="link link-primary">
              Jenny Brady, MSN, RN, CPNP, PMHS
            </Link>{" "}
            at our{" "}
            <Link href="/locations/williamsburg-va" className="link link-primary">
              Williamsburg office at 3900 Powhatan Parkway
            </Link>
            . {procedure.slug === "prp-breast-lift"
              ? "Ask the clinic to define the current service, one-visit purchase terms, and available alternatives before you decide."
              : "Visits are appointment-led so Jenny can review fit, timing, treatment areas, pricing, and aftercare before you proceed."}
          </p>
          {Boolean(relatedLinks.length) && (
            <p className="mt-4 text-sm leading-relaxed text-base-content/80">
              Compare related options: {relatedLinks.map((item, index) => (
                <span key={item.href}>
                  {index > 0 && (index === relatedLinks.length - 1 ? " and " : ", ")}
                  <Link href={item.href} className="link link-primary">
                    {item.label}
                  </Link>
                </span>
              ))}
              .
            </p>
          )}
        </div>
      </Section>

      {satelliteGroup && (
        <Section labelledBy="satellite-pages">
          <SectionHeader id="satellite-pages" title={satelliteGroup.heading} intro={satelliteGroup.intro} />
          <div className={`${AFTER_HEADER} ${cardGridFor(satelliteGroup.links.length)}`}>
            {satelliteGroup.links.map(({ href, label, description }) => (
              <Link key={href} href={href} className={`group ${CARD} ${CARD_LINK}`}>
                <span className={`block ${CARD_TITLE} group-hover:text-primary`}>{label}</span>
                <span className="mt-2 block text-sm leading-relaxed text-base-content/80">{description}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {"whatToExpect" in procedure && procedure.whatToExpect && (
        <Section labelledBy="what-to-expect">
          <SectionHeader id="what-to-expect" title={procedure.whatToExpect.heading} />
          <ol className={`${AFTER_HEADER} ${cardGridFor(procedure.whatToExpect.steps.length)}`}>
            {procedure.whatToExpect.steps.map(({ title, description }, index) => (
              <li key={title} className={CARD}>
                <p className="eyebrow">Step {index + 1}</p>
                <h3 className={`mt-2 ${CARD_TITLE}`}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/75">{description}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {procedure.slug === "blomdahl-ear-piercing" && (
        <Section labelledBy="infant-ear-piercing">
          <SectionHeader id="infant-ear-piercing" title={<>Infant &amp; baby ear piercing with a pediatric nurse practitioner</>} />
          <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-relaxed text-base-content/75 md:text-lg">
            <p>
              Jenny Brady is a certified pediatric nurse practitioner (CPNP), so infant and baby ear piercing is a big part of her
              practice. Babies are generally pierced at 6 months or older with your pediatrician&apos;s guidance, and Jenny will not
              pierce if she has any safety concerns.
            </p>
            <p>
              Visits are private and unhurried. Jenny reviews health history and placement with you, uses a sterile single-use Blomdahl
              cassette and hypoallergenic starter earrings, and teaches aftercare written for babies and toddlers before you leave.
            </p>
          </div>
          <div className={`mt-8 ${BUTTON_ROW}`}>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/consult?procedure=blomdahl-ear-piercing&intent=children&utm_source=website&utm_medium=procedure_page&utm_campaign=ear_piercing_infant">
                Book a baby&apos;s first earrings
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/procedures/blomdahl-ear-piercing/for/children">Infant &amp; kids ear piercing details</Link>
            </Button>
          </div>
        </Section>
      )}

      {procedure.slug === "blomdahl-ear-piercing" && (
        <Section>
          <SectionHeader
            title="Start with the question your family is actually asking"
            intro="Parents, sensitive-ear patients, re-piercing patients, and nearby families need different answers. These guides keep the Blomdahl details practical and make it easier to choose the right Williamsburg appointment."
          />
          <div className={`${AFTER_HEADER} ${CARD_GRID}`}>
            {[
              ["Infant, baby & kids ear piercing", "/procedures/blomdahl-ear-piercing/for/children", "For parents planning a baby's or child's first earrings."],
              ["Sensitive ears or nickel concerns", "/procedures/blomdahl-ear-piercing/for/sensitive-ears", "For families comparing Medical Plastic, titanium, and hypoallergenic starter earrings."],
              ["Re-piercing closed or problem piercings", "/procedures/blomdahl-ear-piercing/for/re-piercing", "For patients who need placement reviewed before piercing again."],
              ["Blomdahl vs mall ear piercing", "/blog/medical-ear-piercing-vs-mall-piercing", "For parents comparing a medical setting with retail piercing."],
              ["Medical Plastic vs titanium", "/blog/blomdahl-medical-plastic-vs-titanium-earrings", "For sensitive-ear patients choosing starter jewelry."],
              ["Ear piercing aftercare", "/blog/ear-piercing-aftercare-williamsburg-va", "For cleaning, healing, sports, swimming, and when to call."],
            ].map(([label, href, copy]) => (
              <Link key={href} href={href} className={`group ${CARD} ${CARD_LINK}`}>
                <span className={`block ${CARD_TITLE} group-hover:text-primary`}>{label}</span>
                <span className="mt-2 block text-sm leading-relaxed text-base-content/80">{copy}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {procedure.slug === "blomdahl-ear-piercing" && (
        <Section>
          <SectionHeader
            title="Plan around your route"
            intro="Start with the local page closest to your visit for directions, expectations, and family planning notes."
          />
          <div className={`${AFTER_HEADER} ${CARD_GRID}`}>
            {[
              ["Williamsburg", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
              ["Yorktown", "/procedures/blomdahl-ear-piercing/near/yorktown-va"],
              ["Newport News", "/procedures/blomdahl-ear-piercing/near/newport-news-va"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className={`group ${CARD} ${CARD_LINK} flex-row items-center justify-between`}>
                <span className={CARD_TITLE}>{label}</span>
                <span aria-hidden="true" className="text-base-content/35 transition group-hover:translate-x-0.5 group-hover:text-primary">
                  →
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {(procedure.slug === "botox" || procedure.slug === "xeomin") && (
        <Section labelledBy="xeomin-by-concern">
          <SectionHeader
            id="xeomin-by-concern"
            title="Xeomin by concern"
            intro={
              <>
                Start with the area that bothers you most. Each page covers how Jenny plans Xeomin for that concern, what to expect, and
                pricing.
              </>
            }
          />
          <div className={`${AFTER_HEADER} ${cardGridFor(xeominClusterPages.length)}`}>
            {xeominClusterPages.map((page) => (
              <Link key={page.path} href={page.path} className={`group ${CARD} ${CARD_LINK}`}>
                <span className={`block ${CARD_TITLE} group-hover:text-primary`}>{page.h1.replace(/ in Williamsburg, VA$/, "")}</span>
                <span className="mt-2 block text-sm leading-relaxed text-base-content/80">{page.summary}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section id="benefits">
        <SectionHeader
          title={
            procedure.slug === "prp-breast-lift" ? (
              "What this treatment approach involves"
            ) : procedure.slug === "prp-hair-restoration" ? (
              "What PRP hair restoration may support"
            ) : "benefitsHeading" in procedure && procedure.benefitsHeading ? (
              procedure.benefitsHeading
            ) : (
              <><span className="font-bold">{procedure.name}</span> Benefits</>
            )
          }
          intro={humanizeMedicalCopy(procedure.benefitsHeadline)}
        />
        <div className={`${AFTER_HEADER} ${cardGridFor(procedure.benefits.length)}`}>
          {procedure.benefits.map(({ benefit, description }) => (
            <Card key={benefit} className="h-full text-left">
              <CardHeader className="pb-2">
                <CardTitle className={CARD_TITLE}>{benefit}</CardTitle>
              </CardHeader>
              <CardContent className="text-base leading-relaxed text-base-content/75">{humanizeMedicalCopy(description)}</CardContent>
            </Card>
          ))}
        </div>
        <NamedReviews serviceSlug={procedure.slug} heading={`${procedure.name} reviews`} embedded />
        {Boolean(procedure.testimonials?.length) && (
          <div className="mt-16 md:mt-20">
            <ProcedureTestimonials procedureName={procedure.name} items={procedure.testimonials} />
          </div>
        )}
        <div className={AFTER_HEADER}>
          <CtaButtons consultHref={ownerConsultationHref} align="start" />
        </div>
      </Section>

      {hasAilments && (
        <Section id="applications">
          <SectionHeader
            title={
              <>
                How can{" "}
                {[
                  "oh-shot",
                  "pe-shot",
                  "prp-face-lift",
                  "prp-facial",
                  "prp-breast-lift",
                ].includes(procedure.slug) && "the "}
                <span className="font-bold">{procedure.name}</span> help me?
              </>
            }
            intro={humanizeMedicalCopy(procedure.ailmentsHeadline)}
          />
          <div className={`${AFTER_HEADER} ${cardGridFor(publishedAilments.length)}`}>
            {publishedAilments
              ?.sort((a, b) => ailmentsSortOrder[a.tag] - ailmentsSortOrder[b.tag])
              .map(({ title, tag, description }) => {
                return (
                  <Card key={title} className="h-full text-left">
                    <CardHeader className="pb-2">
                      <CardTitle className={`flex items-start justify-between gap-3 ${CARD_TITLE}`}>
                        {title} <Badge variant="outline" className="mt-1 shrink-0">{ailmentsTagLabels[tag] ?? "Treatment Area"}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-base leading-relaxed text-base-content/75">{humanizeMedicalCopy(description)}</CardContent>
                  </Card>
                );
              })}
          </div>
          <div className={AFTER_HEADER}>
            <CtaButtons consultHref={ownerConsultationHref} align="start" />
          </div>
        </Section>
      )}

      <Section id="faqs">
        <SectionHeader
          title={<>Frequently Asked Questions about <span className="font-bold">{procedure.name}</span></>}
          intro={humanizeMedicalCopy(procedure.faqHeadline)}
        />
        <Accordion type="single" collapsible className={`${AFTER_HEADER} max-w-3xl border-t border-base-300 text-left`}>
          {procedure.faqs.map(({ question, answer }) => (
            <AccordionItem key={question} value={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {procedure.slug === "blomdahl-ear-piercing" ? (
          <p className="mt-8 max-w-[62ch] text-base leading-relaxed text-base-content/80">
            The cassette-versus-gun comparison is written out in the{" "}
            <Link href="/blog/medical-ear-piercing-vs-mall-piercing" className="link link-primary">
              medical ear piercing versus mall piercing guide
            </Link>
            .
          </p>
        ) : null}
        <div className={AFTER_HEADER}>
          <CtaButtons consultHref={ownerConsultationHref} align="start" />
        </div>
      </Section>

      {Boolean(articles.length) && (
        <Section id="posts" labelledBy="procedure-posts-heading">
          <SectionHeader
            id="procedure-posts-heading"
            title={<>More About <span className="font-semibold">{procedure.name}</span></>}
            intro={humanizeMedicalCopy(procedure.blogHeadline)}
          />
          <BlogPostCollection articles={articles} tone="editorial" className={AFTER_HEADER} />
          <div className={`${AFTER_HEADER} ${BUTTON_ROW}`}>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/blog">View all articles</Link>
            </Button>
          </div>
        </Section>
      )}
      {((featuredGuide && featuredGuideCta) || HOME_OWNER_LINK_PROCEDURES.has(procedure.slug)) && (
        <Section tight>
          {featuredGuide && featuredGuideCta && (
            <>
              <SectionHeader title={featuredGuideCta.heading} intro={featuredGuideCta.description} />
              <div className={`mt-8 ${BUTTON_ROW}`}>
                <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Link href={featuredGuide.href}>{featuredGuideCta.linkLabel}</Link>
                </Button>
              </div>
            </>
          )}
          {HOME_OWNER_LINK_PROCEDURES.has(procedure.slug) && <HomeOwnerLink className={featuredGuide && featuredGuideCta ? "mt-8" : ""} />}
        </Section>
      )}
      <CtaFooter consultHref={ownerConsultationHref} />
    </>
  );
}
