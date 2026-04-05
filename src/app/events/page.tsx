import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import StructuredData from "components/structured-data";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";
import { getPublishedEvents } from "lib/events";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Events in Williamsburg, VA | Williamsburg Med Spa",
  description:
    "Explore hosted event options from Williamsburg Med Spa, starting with Botox Party planning for friend groups and private gatherings.",
  canonical: "/events",
});

export default function EventsPage() {
  const events = getPublishedEvents();

  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Events"]} />

      <section className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.18em] text-base-content/60">Events</p>
        <h1 className="text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light leading-tight">
          Group events that make planning easier and the offer clearer.
        </h1>
        <p className="mt-4 text-base md:text-lg text-base-content/70 max-w-3xl mx-auto">
          We&apos;re starting with one event type and building the category intentionally. Each event page explains the
          offer, the planning workflow, and what guests need to know before anything is confirmed.
        </p>
      </section>

      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <article key={event.slug} className="overflow-hidden rounded-[1.75rem] border border-base-300 bg-base-100 shadow-sm">
            <div className="relative aspect-[4/3] bg-base-200">
              <Image
                src={event.thumbnailImageSrc || event.heroImageSrc}
                alt={event.thumbnailImageAlt || event.heroImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>

            <div className="p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">{event.listing.eyebrow}</p>
              <h2 className="mt-3 text-2xl/snug font-light text-base-content">{event.listing.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-base-content/75">{event.listing.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {event.listing.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs text-base-content/65"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <Button asChild>
                  <Link href={event.canonicalPath}>{event.listing.ctaLabel}</Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
