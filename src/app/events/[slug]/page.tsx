import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import StructuredData from "components/structured-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";
import { getEventBySlug, getPublishedEvents } from "lib/events";
import { ORIGIN } from "lib/seo";

import EventForm from "../event-form";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getPublishedEvents().map((event) => ({ slug: event.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const event = getEventBySlug(params.slug);

  if (!event) {
    return buildPageMetadata({
      title: "Event Not Found | Williamsburg Med Spa",
      description: "The requested event page could not be found.",
      canonical: `/events/${params.slug}`,
    });
  }

  return buildPageMetadata({
    title: event.metadataTitle,
    description: event.metadataDescription,
    canonical: event.canonicalPath,
  });
}

const sectionEyebrowClass = "text-[11px] uppercase tracking-[0.24em] text-base-content/60";
const sectionHeadingClass = "mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content text-balance";
const sectionBodyClass = "mt-4 text-base md:text-lg leading-relaxed text-base-content/80";
const surfaceCardClass = "rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm";

export default function EventDetailPage({ params }: PageProps) {
  const event = getEventBySlug(params.slug);
  if (!event || !event.published) return notFound();

  const thumbnailImageSrc = event.thumbnailImageSrc || event.heroImageSrc;
  const thumbnailImageAlt = event.thumbnailImageAlt || event.heroImageAlt;

  return (
    <>
      <StructuredData
        type="Breadcrumb"
        breadcrumbItems={[
          { name: "Home", item: ORIGIN },
          { name: "Events", item: `${ORIGIN}/events` },
          { name: event.title, item: `${ORIGIN}${event.canonicalPath}` },
        ]}
      />
      <StructuredData type="FAQ" faqs={event.faq.items} />

      <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 z-10">
        <section className="px-6 py-16 md:px-0 md:py-24 lg:py-28" aria-labelledby={`${event.slug}-hero-heading`}>
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[2.4rem] bg-base-200/60 shadow-[0_28px_90px_-56px_rgba(0,0,0,0.45)]">
              <div className="relative aspect-[6/5] w-full sm:aspect-[8/5] lg:aspect-[16/7]">
                <Image
                  src={event.heroImageSrc}
                  alt={event.heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10" />
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-5xl text-center md:mt-12">
              <p className={sectionEyebrowClass}>{event.hero.eyebrow}</p>
              <h1
                id={`${event.slug}-hero-heading`}
                className="mt-4 text-4xl/snug font-light leading-tight text-base-content text-balance sm:text-5xl/snug md:text-6xl/snug"
              >
                {event.hero.heading}
              </h1>
              <p className="mx-auto mb-8 mt-6 max-w-4xl text-xl text-base-content lg:text-2xl">{event.hero.body}</p>

              <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
                {event.hero.highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-base-300 bg-base-100 px-3.5 py-1.5 text-sm text-base-content/70"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <a href="#event-form">{event.hero.primaryCtaLabel}</a>
                </Button>
                {event.hero.secondaryCtaLabel && event.hero.secondaryCtaHref ? (
                  <Button asChild variant="secondary">
                    <Link href={event.hero.secondaryCtaHref}>{event.hero.secondaryCtaLabel}</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-14 px-6 py-6 md:mb-20 md:px-0 md:py-8 lg:py-10">
          <div className="text-center">
            <p className={sectionEyebrowClass}>{event.rewards.eyebrow}</p>
            <h2 className="mx-auto mt-4 max-w-4xl pb-4 text-4xl/snug font-light leading-tight text-base-content text-balance sm:text-5xl/snug md:text-[3.75rem]/[1.06]">
              {event.rewards.heading}
            </h2>
            <p className="mx-auto mb-8 max-w-4xl text-lg text-base-content/80 lg:text-xl">{event.rewards.body}</p>
          </div>

          <div className="grid gap-8 lg:gap-10 mt-8 lg:my-12 xl:my-16 grid-cols-1 md:grid-cols-3">
            {event.rewards.cards.map((card) => (
              <article key={`${card.eyebrow || card.title}`} className={surfaceCardClass}>
                {card.eyebrow ? (
                  <p className="text-sm uppercase tracking-[0.18em] text-base-content/55">{card.eyebrow}</p>
                ) : null}
                <h3 className="mt-3 text-2xl font-light text-base-content">{card.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-base-content/75">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14 px-6 py-6 md:mb-20 md:px-0 md:py-8 lg:py-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className={sectionEyebrowClass}>{event.process.eyebrow}</p>
            <h2 className={sectionHeadingClass}>{event.process.heading}</h2>
            <p className={sectionBodyClass}>{event.process.body}</p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-4">
            {event.process.steps.map((step, index) => (
              <div key={step.title} className={surfaceCardClass}>
                <p className="text-sm uppercase tracking-[0.18em] text-base-content/55">Step {index + 1}</p>
                <h3 className="mt-3 text-xl font-light text-base-content">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-base-content/70">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 px-6 py-6 md:mb-20 md:px-0 md:py-8 lg:py-10">
          <div className="mx-auto max-w-5xl">
            <article className="group relative isolate flex flex-col gap-8 md:flex-row-reverse md:items-center md:justify-between lg:gap-12">
              <div className="max-w-2xl flex-1">
                <p className={sectionEyebrowClass}>{event.support.eyebrow}</p>
                <h2 className="mt-3 max-w-2xl text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content text-balance">
                  {event.support.heading}
                </h2>
                <p className={sectionBodyClass}>{event.support.body}</p>
                {event.support.supportingBody ? (
                  <p className="mt-4 text-sm md:text-base leading-relaxed text-base-content/70">
                    {event.support.supportingBody}
                  </p>
                ) : null}
              </div>

              <div className="relative aspect-square w-full max-w-[18rem] overflow-hidden rounded-2xl bg-base-200 sm:max-w-[20rem] md:w-[17rem] lg:w-[19rem] md:shrink-0">
                <Image
                  src={thumbnailImageSrc}
                  alt={thumbnailImageAlt}
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 272px, 304px"
                  className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
              </div>
            </article>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {event.support.notes.map((note) => (
                <div key={note.title} className={surfaceCardClass}>
                  <h3 className="text-lg font-medium text-base-content">{note.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-base-content/70">{note.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="event-form" className="mb-14 scroll-mt-24 px-6 py-6 md:mb-20 md:px-0 md:py-8 lg:py-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className={sectionEyebrowClass}>{event.form.eyebrow}</p>
            <h2 className={sectionHeadingClass}>{event.form.heading}</h2>
            <p className={sectionBodyClass}>{event.form.body}</p>
          </div>

          <div className="mt-10 md:mt-12">
            <EventForm event={event} />
          </div>

          {event.form.disclaimer ? (
            <p className="mt-6 text-sm text-base-content/60 text-center max-w-2xl mx-auto">{event.form.disclaimer}</p>
          ) : null}
        </section>

        <section className="px-6 py-14 md:px-0 md:py-16" id="faq">
          <div className="mx-auto max-w-5xl">
            <p className={`${sectionEyebrowClass} text-center`}>FAQ</p>
            <h2 className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content text-center">
              {event.faq.heading}
            </h2>

            <Accordion type="single" collapsible className="mt-10 text-left">
              {event.faq.items.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="px-6 pb-16 pt-4 md:px-0 md:pb-20 md:pt-8">
          <div className="text-center">
            <h2 className="text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto max-w-5xl leading-tight pb-4">
              {event.closing.heading}
            </h2>
            <h3 className="text-base-content text-xl lg:text-2xl max-w-2xl mb-8 mx-auto">{event.closing.subheading}</h3>
            <p className="mb-8 max-w-xl mx-auto">{event.closing.body}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <a href="#event-form">{event.closing.primaryCtaLabel}</a>
              </Button>
              {event.closing.secondaryCtaLabel && event.closing.secondaryCtaHref ? (
                <Button asChild variant="secondary">
                  <Link href={event.closing.secondaryCtaHref}>{event.closing.secondaryCtaLabel}</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
