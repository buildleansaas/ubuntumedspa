import type { Metadata } from "next";
import Link from "next/link";

import CtaButtons from "components/cta-buttons";
import StructuredData from "components/structured-data";
import { buildPageMetadata } from "lib/metadata";
import { CASH_CARD_NOTE } from "lib/price";
import {
  PRICES_DESCRIPTION,
  PRICES_FAQS,
  PRICES_H1,
  PRICES_PATH,
  PRICES_TITLE,
  buildPricesOfferCatalog,
  getPriceGroups,
} from "lib/prices-page";
import { BOOKING_PHONE_DISPLAY, bookingTelHref } from "lib/text-to-book";

// Every price here comes from COMMERCE_CATALOG via lib/prices-page. Never type a dollar amount in this file.
export const metadata: Metadata = buildPageMetadata({
  title: PRICES_TITLE,
  description: PRICES_DESCRIPTION,
  canonical: PRICES_PATH,
});

export default function PricesPage() {
  const groups = getPriceGroups();
  const offerCatalog = buildPricesOfferCatalog(groups);

  return (
    <div className="mx-auto max-w-4xl py-14 md:py-20">
      <StructuredData type="Breadcrumb" breadcrumbItems={[
        { name: "Home", item: "https://www.williamsburgmedspa.com" },
        { name: "Prices", item: "https://www.williamsburgmedspa.com/prices" },
      ]} />
      <StructuredData type="FAQ" faqs={PRICES_FAQS} />
      <script
        id="StructuredData-OfferCatalog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalog).replace(/</g, "\\u003c") }}
      />

      <h1 className="font-display mt-4 text-4xl font-medium leading-[1.1] tracking-tight text-base-content md:text-6xl">
        {PRICES_H1}
      </h1>
      <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-base-content/85 md:text-lg">
        Every service and product we sell, with the cash price first and the card/online price beside it.
      </p>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-base-content/75" data-cash-card-note>
        {CASH_CARD_NOTE}
      </p>

      <div className="mt-10 space-y-12">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`prices-${group.id}`}>
            <h2
              id={`prices-${group.id}`}
              className="font-display text-2xl font-medium leading-tight tracking-tight text-base-content md:text-3xl"
            >
              {group.name}
            </h2>
            <ul className="mt-4 divide-y divide-base-300 border-y border-base-300">
              {group.rows.map((row) => (
                <li
                  key={row.slug}
                  data-price-slug={row.slug}
                  className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:justify-between md:gap-6"
                >
                  <div className="min-w-0">
                    <Link href={row.href} className="link link-primary text-base font-medium md:text-lg">
                      {row.name}
                    </Link>
                    <p className="mt-1 text-sm text-base-content/70">{row.unitNote}</p>
                  </div>
                  <p className="text-base font-semibold text-base-content md:text-right">{row.displayPrice}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-16 border-t border-base-300 pt-12" aria-labelledby="prices-faq-heading">
        <h2
          id="prices-faq-heading"
          className="font-display text-3xl font-medium leading-tight tracking-tight text-base-content md:text-4xl"
        >
          Price questions
        </h2>
        <div className="mt-6 divide-y divide-base-300 border-y border-base-300">
          {PRICES_FAQS.map((faq) => (
            <article key={faq.question} className="py-6">
              <h3 className="font-display text-xl font-medium leading-tight text-base-content md:text-2xl">{faq.question}</h3>
              <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-base-content/85">{faq.answer}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-base text-base-content/85">
          Text or call Jenny at{" "}
          <a href={bookingTelHref} className="link link-primary">
            {BOOKING_PHONE_DISPLAY}
          </a>
          , or{" "}
          <Link href="/consult" className="link link-primary">
            request a consultation
          </Link>
          .
        </p>
        <div className="mt-6">
          <CtaButtons align="start" />
        </div>
      </section>
    </div>
  );
}
