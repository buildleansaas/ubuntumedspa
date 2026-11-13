import Link from "next/link";

import CatalogPurchasePanel from "components/catalog-purchase-panel";
import StructuredData from "components/structured-data";
import TextToBook from "components/text-to-book";
import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { cardPriceSchemaValue } from "lib/price";
import {
  XEOMIN_COMPARISON_PATH,
  XEOMIN_HUB_ANCHOR,
  XEOMIN_HUB_PATH,
  XEOMIN_PRICES,
  XEOMIN_PRODUCT_ANCHOR,
  XEOMIN_PRODUCT_PATH,
  XEOMIN_SEEK_HELP,
  XEOMIN_SIDE_EFFECTS,
  XEOMIN_TRADEMARK_NOTE,
  xeominClusterPages,
  type XeominClusterPage,
} from "lib/xeomin-concerns";
import { CrowsFeetResults } from "components/clinic-photos";

const ORIGIN = "https://www.williamsburgmedspa.com";

/** Shared layout for /procedures/xeomin/for/<concern> and /procedures/xeomin/cost. */
export default function XeominClusterPageView({ page }: { page: XeominClusterPage }) {
  const catalogItem = getCatalogConfigBySlug("xeomin");
  const canonicalUrl = `${ORIGIN}${page.path}`;
  const consultHref = `/consult?procedure=xeomin&intent=${page.slug}&utm_source=website&utm_medium=xeomin_cluster&utm_campaign=xeomin_${page.slug.replace(/-/g, "_")}`;
  const siblings = xeominClusterPages.filter((sibling) => sibling.slug !== page.slug);

  return (
    <main className="mx-auto max-w-xl py-12 md:max-w-5xl md:px-8 md:py-16">
      <StructuredData
        type="Breadcrumb"
        breadcrumbItems={[
          { name: "Home", item: ORIGIN },
          { name: "Procedures", item: `${ORIGIN}/procedures` },
          { name: "Xeomin", item: `${ORIGIN}${XEOMIN_PRODUCT_PATH}` },
          { name: page.h1, item: canonicalUrl },
        ]}
      />
      <StructuredData
        type="Service"
        service={{
          name: page.h1,
          description: page.metaDescription,
          areaServed: "Williamsburg, VA",
          // Offer price is the card / online price, which is what checkout charges (same as the hub).
          price: catalogItem ? cardPriceSchemaValue(catalogItem.cashAmountCents) : undefined,
          priceCurrency: catalogItem ? "USD" : undefined,
        }}
      />
      {/* FAQ schema mirrors the visible FAQ list below, one entry per question. */}
      <StructuredData type="FAQ" faqs={page.faqs} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-base-content/70">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/procedures" className="hover:underline">
              Procedures
            </Link>
          </li>
          <li aria-hidden="true" className="text-base-content/40">
            &gt;
          </li>
          <li>
            <Link href={XEOMIN_PRODUCT_PATH} className="hover:underline">
              Xeomin
            </Link>
          </li>
          <li aria-hidden="true" className="text-base-content/40">
            &gt;
          </li>
          <li className="text-base-content">{page.label}</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl text-left md:mb-14">
        <p className="mb-3 text-sm uppercase tracking-wide text-base-content/60">
          Xeomin® wrinkle relaxer · Williamsburg, VA{page.areaTag === "uncommon" ? " · Less common area" : ""}
        </p>
        <h1 className="text-3xl font-light leading-tight md:text-5xl">{page.h1}</h1>
        <p className="mt-4 text-lg font-medium text-base-content md:text-xl" data-search-term-line>
          {page.botoxLine}
        </p>
        <p className="mt-3 text-base text-base-content/75 md:text-lg">{page.intro}</p>
        {page.slug !== "cost" && (
          <p className="mt-4 text-base text-base-content/80 md:text-lg">
            <strong>{XEOMIN_PRICES.blockCash} cash per credit block</strong> ({XEOMIN_PRICES.blockCard} online or by card).
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <a href="#book">Text or call Jenny</a>
          </Button>
          <Button asChild variant="secondary">
            <a href="#pricing">Prepay Xeomin credit</a>
          </Button>
          <Button asChild variant="outline">
            <Link href={XEOMIN_HUB_PATH}>{XEOMIN_HUB_ANCHOR}</Link>
          </Button>
        </div>
      </header>

      {page.slug === "crows-feet" && <CrowsFeetResults />}

      {page.sections.map((section) => (
        <section key={section.heading} className="mb-10 max-w-3xl md:mb-14">
          <h2 className="mb-3 text-2xl font-light md:text-3xl">{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="mb-3 text-base text-base-content/80 md:text-lg">
              {paragraph}
            </p>
          ))}
          {section.bullets && (
            <ul className="list-disc space-y-2 pl-5 text-base text-base-content/80 md:text-lg">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="mb-10 md:mb-14" aria-labelledby="what-to-expect">
        <h2 id="what-to-expect" className="mb-4 text-2xl font-light md:text-3xl">
          What to expect
        </h2>
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {page.expectations.map((step, index) => (
            <li key={step.title} className="border border-base-300 p-4">
              <h3 className="font-semibold text-base-content">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-1 text-base-content/75">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10 max-w-3xl md:mb-14" aria-labelledby="side-effects">
        <h2 id="side-effects" className="mb-3 text-2xl font-light md:text-3xl">
          Side effects and candidacy
        </h2>
        <p className="mb-3 text-base text-base-content/80 md:text-lg">{XEOMIN_SIDE_EFFECTS}</p>
        <p className="mb-3 text-base font-medium text-base-content md:text-lg">{XEOMIN_SEEK_HELP}</p>
        <p className="text-base text-base-content/80 md:text-lg">
          Results are temporary and vary by person, area, and dose. Candidacy depends on your health history, medications, pregnancy or
          nursing status, prior injectable history, and the look you want to preserve.
        </p>
      </section>

      <section
        className="mb-10 grid scroll-mt-28 items-start gap-8 border-t border-base-300 pt-10 md:mb-14 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:gap-12"
        id="pricing"
        aria-labelledby="xeomin-pricing"
      >
        <div>
        <h2 id="xeomin-pricing" className="mb-4 text-2xl font-light md:text-3xl">
          Xeomin pricing
        </h2>
        <p className="font-display text-5xl font-light leading-none tracking-tight text-base-content">{XEOMIN_PRICES.blockCash} cash</p>
        <p className="mt-2 text-sm text-base-content/70">per credit block · {XEOMIN_PRICES.blockCard} card/online</p>
        <p className="mt-4 text-base text-base-content/80 md:text-lg">
          Each block adds {XEOMIN_PRICES.blockCash} of treatment credit. Your total depends on the areas treated, muscle strength, and your
          dosing plan, and any unused value remains as account credit.{" "}
          {page.slug !== "cost" && (
            <Link href="/procedures/xeomin/cost" className="link link-primary">
              How Xeomin pricing works
            </Link>
          )}
        </p>
        </div>
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
            purchaseLabel={catalogItem.purchaseLabel}
            customerNote={catalogItem.customerNote}
            hidePrice
          />
        )}
      </section>

      <section className="mb-10 max-w-3xl md:mb-14" id="faqs" aria-labelledby="xeomin-faqs">
        <h2 id="xeomin-faqs" className="mb-4 text-2xl font-light md:text-3xl">
          Questions
        </h2>
        <dl className="space-y-5">
          {page.faqs.map(({ question, answer }) => (
            <div key={question} data-faq-question>
              <dt className="font-semibold text-base-content">{question}</dt>
              <dd className="mt-1 text-base text-base-content/80">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-10 border border-base-300 p-5 md:mb-14 md:p-6" aria-labelledby="xeomin-cluster-links">
        <h2 id="xeomin-cluster-links" className="mb-2 text-2xl font-light md:text-3xl">
          Xeomin by concern
        </h2>
        <p className="mb-4 text-base text-base-content/80">
          Start with the main{" "}
          <Link href={XEOMIN_HUB_PATH} className="link link-primary">
            {XEOMIN_HUB_ANCHOR}
          </Link>{" "}
          page, read about{" "}
          <Link href={XEOMIN_PRODUCT_PATH} className="link link-primary">
            {XEOMIN_PRODUCT_ANCHOR}
          </Link>
          , or compare products in the{" "}
          <Link href={XEOMIN_COMPARISON_PATH} className="link link-primary">
            Xeomin vs Botox guide
          </Link>
          .
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {siblings.map((sibling) => (
            <Link
              key={sibling.path}
              href={sibling.path}
              className="border border-base-300 px-4 py-3 transition hover:border-primary"
            >
              <span className="block font-semibold text-base-content">{sibling.h1.replace(/ in Williamsburg, VA$/, "")}</span>
              <span className="mt-1 block text-sm text-base-content/65">{sibling.summary}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="book" className="mb-10 scroll-mt-24 md:mb-14">
        <TextToBook
          heading="Text or call Jenny to book"
          intro="Jenny Brady, MSN, RN, CPNP, PMHS sees Xeomin patients by appointment at 3900 Powhatan Parkway, Williamsburg. Text her with the area you want to discuss, or call."
          message={page.textMessage}
          location="service_page"
        />
        <p className="mt-4 text-sm text-base-content/70">
          Prefer a form?{" "}
          <Link href={consultHref} className="link link-primary">
            Send a consultation request
          </Link>
          .
        </p>
      </section>

      <p className="text-xs leading-relaxed text-base-content/60">{XEOMIN_TRADEMARK_NOTE}</p>
    </main>
  );
}
