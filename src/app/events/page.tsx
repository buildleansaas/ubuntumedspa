import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import StructuredData from "components/structured-data";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";
import { getPublishedEvents } from "lib/events";

export const metadata: Metadata = buildPageMetadata({
  title: "Botox Parties in Williamsburg, VA | Private Med Spa Events",
  description:
    "Host a Botox party in Williamsburg, VA with Williamsburg Med Spa. Plan a private injectable event for friends and introduce guests to Botox, PRP, skin, and wellness options.",
  canonical: "/events",
});

export default function EventsPage() {
  const events = getPublishedEvents();

  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Events"]} />

      <section className="mx-auto max-w-5xl text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.18em] text-base-content/60">Botox Parties in Williamsburg</p>
        <h1 className="text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light leading-tight">
          Host the Botox party your friends already keep asking about.
        </h1>
        <p className="mt-4 text-base md:text-lg text-base-content/70 max-w-3xl mx-auto">
          Williamsburg Med Spa helps hosts turn real friend-group interest into a private, organized Botox-led event.
          Guests can start with injectable questions, then learn what else may fit them, including PRP, skin, wellness,
          and medical-grade product options.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/events/botox-party">Plan a Botox Party</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/procedures/botox">Read About Botox</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3" aria-label="Why host a Botox party">
        {[
          ["Private group format", "Make the first step feel easier for friends who are curious but not ready to book alone."],
          ["Botox-led gateway", "Keep the event focused on Botox while giving guests a natural way to ask about PRP and other services."],
          ["Planning call first", "Share your guest count, timing, and location idea before anything is confirmed."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="text-lg font-medium text-base-content">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-base-content/70">{description}</p>
          </div>
        ))}
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
