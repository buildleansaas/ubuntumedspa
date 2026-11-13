import type { Metadata } from "next";
import Link from "next/link";

import StructuredData from "components/structured-data";
import TextToBook from "components/text-to-book";
import { OFFERS_DESCRIPTION, OFFERS_H1, OFFERS_PATH, OFFERS_TITLE, getActiveOffers } from "config/offers";
import { buildPageMetadata } from "lib/metadata";
import { CASH_CARD_NOTE, cardPriceLabel, formatUsdShort } from "lib/price";

// Offers come from config/offers.ts; prices are computed there. Never type a dollar amount in this file.
export function generateMetadata(): Metadata {
  const metadata = buildPageMetadata({ title: OFFERS_TITLE, description: OFFERS_DESCRIPTION, canonical: OFFERS_PATH });
  // With nothing running the page is a thin placeholder: keep it out of search until the next offer.
  return getActiveOffers().length ? metadata : { ...metadata, robots: { index: false, follow: true } };
}

// Rendered per request so an offer drops off the moment its end date passes (clinic time).
export const dynamic = "force-dynamic";

export default function OffersPage() {
  const offers = getActiveOffers();

  return (
    <div className="w-full max-w-4xl py-14 md:py-20">
      <StructuredData
        type="Breadcrumb"
        breadcrumbItems={[
          { name: "Home", item: "https://www.williamsburgmedspa.com" },
          { name: "Offers", item: "https://www.williamsburgmedspa.com/offers" },
        ]}
      />

      <h1 className="font-display mt-4 text-4xl font-medium leading-[1.1] tracking-tight text-base-content md:text-6xl">
        {OFFERS_H1}
      </h1>
      <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-base-content/85 md:text-lg">
        Book by text or call to get an offer price. Online purchases are at the regular price.
      </p>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-base-content/75">{CASH_CARD_NOTE}</p>

      {offers.length === 0 ? (
        <p className="mt-10 text-base text-base-content/80" data-no-offers>
          No offers are running right now. See every regular price on the{" "}
          <Link href="/prices" className="link link-primary">
            prices page
          </Link>
          .
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {offers.map((offer) => (
            <section
              key={offer.slug}
              id={offer.slug}
              data-offer-slug={offer.slug}
              className="scroll-mt-28 rounded-2xl border-2 border-primary/40 bg-base-100 p-6 md:p-8"
            >
              <h2 className="font-display mt-2 text-2xl font-medium leading-tight tracking-tight text-base-content md:text-3xl">
                {offer.title}
              </h2>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-base-content" data-offer-price>
                {formatUsdShort(offer.offerCashCents)} cash · {cardPriceLabel(offer.offerCashCents)} card
                <span className="ml-3 text-base font-normal text-base-content/60">
                  <span className="sr-only">Regular cash price </span>
                  <s>{formatUsdShort(offer.regularCashCents)}</s>
                </span>
              </p>
              <p className="mt-4 text-base leading-relaxed text-base-content/85 md:text-lg">{offer.summary}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-base text-base-content/80">
                {offer.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-base-content/70" data-offer-terms>
                <span className="font-medium">Terms:</span> {offer.terms}
              </p>
              <div className="mt-6">
                <TextToBook
                  heading="Text or call Jenny to book"
                  intro="Text Jenny with the days and times that work for you, or call, and mention the offer."
                  message={offer.textMessage}
                  location="service_page"
                />
              </div>
              <p className="mt-4 text-sm">
                <Link href={offer.learnMoreHref} className="link link-primary">
                  {offer.learnMoreLabel}
                </Link>
              </p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
