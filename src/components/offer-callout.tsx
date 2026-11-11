"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { OFFERS, OFFERS_PATH, isOfferActive, type ClinicOffer } from "config/offers";
import { cardPriceLabel } from "lib/price";

/** "2026-12-31" → "December 31, 2026" (the date is a calendar day, so format it in UTC). */
export const offerEndsLabel = (endsOn: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" }).format(
    new Date(`${endsOn}T00:00:00Z`)
  );

/** The /offers link for a callout, tagged so a booking can be traced back to the page that sent it. */
export const offerCalloutHref = (offer: Pick<ClinicOffer, "slug">, campaign: string) =>
  `${OFFERS_PATH}?utm_source=website&utm_medium=blog&utm_campaign=${campaign}#${offer.slug}`;

/**
 * One offer, inside an article, only while it runs. Static pages are built ahead of time, so `initialActive` comes from the
 * server render (build time) and the browser re-checks the clinic date on load, the same way OffersNavLink hides itself after an
 * offer ends. Prices and dates come from config/offers.ts; never type them in the article.
 */
export default function OfferCallout({
  slug,
  campaign,
  initialActive,
}: {
  slug: string;
  campaign: string;
  initialActive: boolean;
}) {
  const offer = OFFERS.find((item) => item.slug === slug);
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    setActive(offer ? isOfferActive(offer) : false);
  }, [offer]);

  if (!offer || !active) return null;

  return (
    <aside data-offer-callout={offer.slug} className="not-prose my-8 rounded-2xl border-2 border-primary/40 bg-primary/5 p-5">
      <p className="text-base leading-relaxed text-base-content/90">
        <strong>
          {offer.title}, through {offerEndsLabel(offer.endsOn)}.
        </strong>{" "}
        {offer.summary} By card it is {cardPriceLabel(offer.offerCashCents)}. Book by text or call to get the offer price;
        online checkout stays at the regular price.{" "}
        <Link href={offerCalloutHref(offer, campaign)} className="font-medium text-primary underline underline-offset-2">
          See the offer and its terms
        </Link>
        .
      </p>
    </aside>
  );
}
