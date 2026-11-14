import type { Metadata } from "next";
import Link from "next/link";

import CtaButtons from "components/cta-buttons";
import {
  AFTER_HEADER,
  H2,
  INTRO,
  ROW,
  ROWS,
  SPLIT,
  SPLIT_MEDIA,
  SPLIT_TEXT,
  Section,
  SectionHeader,
} from "components/layout";
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
    <>
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

      <Section tight labelledBy="prices-heading">
        <div className="max-w-3xl">
          <h1
            id="prices-heading"
            className="font-display text-4xl font-light leading-tight tracking-tight text-base-content sm:text-5xl lg:text-6xl"
          >
            {PRICES_H1}
          </h1>
          <p className={`mt-6 ${INTRO}`}>
            Every service and product we sell, with the cash price first and the card/online price beside it.
          </p>
          <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-base-content/75" data-cash-card-note>
            {CASH_CARD_NOTE}
          </p>
        </div>
      </Section>

      <Section label="Price list">
        <div className="space-y-16 md:space-y-20">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`prices-${group.id}`} className={`${SPLIT} items-start`}>
              <h2 id={`prices-${group.id}`} className={`${H2} ${SPLIT_TEXT.wide}`}>
                {group.name}
              </h2>
              <ul className={`${ROWS} ${SPLIT_MEDIA.wide}`}>
                {group.rows.map((row) => (
                  <li key={row.slug} data-price-slug={row.slug} className={ROW}>
                    <div className="min-w-0">
                      <Link href={row.href} className="link link-primary text-lg font-medium">
                        {row.name}
                      </Link>
                      <p className="mt-1 text-sm text-base-content/70">{row.unitNote}</p>
                    </div>
                    <p className="text-base font-semibold text-base-content sm:text-right">{row.displayPrice}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <Section labelledBy="prices-faq-heading">
        <SectionHeader id="prices-faq-heading" title="Price questions" />
        <div className={`${AFTER_HEADER} ${ROWS}`}>
          {PRICES_FAQS.map((faq) => (
            <article key={faq.question} className={`${SPLIT} gap-y-3 border-b border-base-300 py-8`}>
              <h3 className={`font-display text-2xl leading-snug text-base-content ${SPLIT_TEXT.wide}`}>{faq.question}</h3>
              <p className={`max-w-[62ch] text-base leading-relaxed text-base-content/85 ${SPLIT_MEDIA.wide}`}>{faq.answer}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-base text-base-content/85">
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
        <div className="mt-8">
          <CtaButtons align="start" />
        </div>
      </Section>
    </>
  );
}
