import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import NamedReviews from "components/named-reviews";
import StructuredData from "components/structured-data";
import { HomeRealPhotos } from "components/clinic-photos";
import { CARPAL_TUNNEL_PHOTO, HOME_INJECTION_CAPTION } from "config/clinic-photos";
import { COMMERCE_CATALOG_BY_SLUG, EAR_PIERCING_PRICES } from "config/commerce-catalog";
import { buildPageMetadata } from "lib/metadata";
import { cardPriceLabel, formatUsdShort } from "lib/price";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "lib/seo";
import HomeChooser, { type ChooserTile } from "views/home-chooser";
import HomeHero, { HOME_BOOK_HREF } from "views/home-hero";
import HomeQuestions, { getHomeFaqs } from "views/home-questions";

export const metadata: Metadata = buildPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  canonical: "/",
});

const XEOMIN_CASH = formatUsdShort(COMMERCE_CATALOG_BY_SLUG.xeomin.cashAmountCents);
const XEOMIN_CARD = cardPriceLabel(COMMERCE_CATALOG_BY_SLUG.xeomin.cashAmountCents);

const cash = (slug: string) => formatUsdShort(COMMERCE_CATALOG_BY_SLUG[slug].cashAmountCents);
const card = (slug: string) => cardPriceLabel(COMMERCE_CATALOG_BY_SLUG[slug].cashAmountCents);

const CHOOSER_TILES: ChooserTile[] = [
  {
    question: "Lines when I frown, raise my brows or smile",
    treatment: "Xeomin",
    href: "/procedures/xeomin",
    price: `from ${XEOMIN_CASH} cash`,
  },
  {
    question: "Sweating that clothes and antiperspirant can't handle",
    treatment: "Hyperhidrosis treatment",
    href: "/procedures/hyperhidrosis-treatment",
    price: `${cash("hyperhidrosis-treatment")} cash`,
  },
  {
    question: "My child's first earrings",
    treatment: "Blomdahl ear piercing",
    href: "/procedures/blomdahl-ear-piercing",
    price: `${EAR_PIERCING_PRICES.oneEarCash} per ear, cash`,
  },
  {
    question: "Skin that looks tired or uneven",
    treatment: "PRP Facial",
    href: "/procedures/prp-facial",
    price: `${cash("prp-facial")} cash`,
  },
  {
    question: "Thinning hair",
    treatment: "PRP hair restoration",
    href: "/procedures/prp-hair-restoration",
    price: `${cash("prp-hair-restoration")} per treatment, cash`,
  },
  {
    question: "Intimate comfort or bladder leaks",
    treatment: "OH-Shot",
    href: "/procedures/oh-shot",
    price: `${cash("oh-shot")} cash`,
  },
];

// Cash first, card smaller. Every amount comes from the catalog.
const PRICE_ROWS = [
  { name: "Xeomin", href: "/procedures/xeomin", cash: `from ${XEOMIN_CASH}`, card: XEOMIN_CARD, note: "per credit block" },
  {
    name: "Blomdahl ear piercing",
    href: "/procedures/blomdahl-ear-piercing",
    cash: EAR_PIERCING_PRICES.oneEarCash,
    card: EAR_PIERCING_PRICES.oneEarCard,
    note: "per ear",
  },
  { name: "PRP Facial", href: "/procedures/prp-facial", cash: cash("prp-facial"), card: card("prp-facial"), note: "per treatment" },
  {
    name: "Hyperhidrosis treatment",
    href: "/procedures/hyperhidrosis-treatment",
    cash: cash("hyperhidrosis-treatment"),
    card: card("hyperhidrosis-treatment"),
    note: "per treatment",
  },
  { name: "OH-Shot", href: "/procedures/oh-shot", cash: cash("oh-shot"), card: card("oh-shot"), note: "per treatment" },
];

// TODO(Jenny sign-off): the three first-visit steps below are new copy and await Jenny's review before launch.
const FIRST_VISIT_STEPS = [
  { title: "Book, then text Jenny", body: "Book the visit, then text or call Jenny to pick a time." },
  {
    title: "A conversation first",
    body: "Jenny goes over your health history and what you'd like to change before anything is planned.",
  },
  {
    title: "Treatment and follow-up",
    body: "If it's a good fit, treatment follows, and Jenny explains aftercare before you leave.",
  },
];

const BOOKING_LINE = "Book the visit, then text or call Jenny to pick a time.";

const sectionHeading = "font-display text-3xl leading-tight tracking-tight text-base-content md:text-[2.6rem]";
const textLink =
  "rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary";

export default async function Page() {
  return (
    <div className="w-full">
      <StructuredData type="FAQ" faqs={getHomeFaqs(XEOMIN_CASH, XEOMIN_CARD)} />
      <StructuredData type="Person" />

      {/* 1. Hero */}
      <HomeHero xeominCash={XEOMIN_CASH} piercingCash={EAR_PIERCING_PRICES.oneEarCash} />

      {/* 2. What brings you in? */}
      <HomeChooser tiles={CHOOSER_TILES} />

      {/* 3. Meet Jenny (existing provider copy) */}
      <section className="w-full py-16 md:py-24" aria-labelledby="home-jenny-heading">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:gap-20">
          <figure className="mx-auto w-full max-w-[20rem] lg:mx-0 lg:max-w-none">
            <Image
              src={CARPAL_TUNNEL_PHOTO.src}
              alt={CARPAL_TUNNEL_PHOTO.alt}
              width={CARPAL_TUNNEL_PHOTO.width}
              height={CARPAL_TUNNEL_PHOTO.height}
              sizes="(max-width: 1024px) 320px, 352px"
              className="aspect-[4/5] w-full rounded-[1.75rem] object-cover object-[50%_35%]"
            />
            <figcaption className="mt-3 text-sm text-base-content/65">{HOME_INJECTION_CAPTION}</figcaption>
          </figure>
          <div className="max-w-2xl">
            <h2 id="home-jenny-heading" className={sectionHeading}>
              Meet Jenny Brady
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-base-content/80">
              With 26 years in medicine and six years dedicated to aesthetics, Jenny blends primary care and mental
              health expertise with a holistic, patient-first approach. She combines regenerative PRP therapies,
              advanced injection techniques, and practical wellness counseling to help you look and feel your best,
              naturally.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-base-content/80">
              Care starts with medical screening, calm education, and treatment planning shaped around realistic goals.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-base-content/65">
              MSN, RN, CPNP, PMHS · Cellular Medicine Association-certified OH-Shot provider · Certified Blomdahl provider
            </p>
            <p className="mt-7">
              <Link href="/staff/jenny-brady" className={textLink}>
                More about Jenny
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 4. Your first visit */}
      <section className="w-full py-16 md:py-24" aria-labelledby="home-first-visit-heading">
        <h2 id="home-first-visit-heading" className={sectionHeading}>
          Your first visit
        </h2>
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
          {FIRST_VISIT_STEPS.map((step, index) => (
            <li key={step.title} className="border-t border-base-300 pt-6">
              <span className="font-display text-2xl text-accent" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="font-display mt-3 text-xl leading-snug text-base-content md:text-[1.4rem]">{step.title}</h3>
              <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-base-content/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Real results (captions and disclosure unchanged) */}
      <HomeRealPhotos />

      {/* 6. Reviews: renders only when consented, named reviews exist */}
      <NamedReviews heading="Clinic reviews" />

      {/* 7. Prices, written out */}
      <section className="w-full py-16 md:py-24" aria-labelledby="home-prices-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-20">
          <div>
            <h2 id="home-prices-heading" className={sectionHeading}>
              Prices, written out
            </h2>
            <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-base-content/75">
              Cash price first. The card price applies online and to card payments in the office.
            </p>
          </div>
          <div>
            <ul className="border-t border-base-300" data-home-prices>
              {PRICE_ROWS.map((row) => (
                <li key={row.href} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-base-300 py-5">
                  <Link href={row.href} className="rounded-sm text-lg text-base-content hover:text-secondary">
                    {row.name}
                  </Link>
                  <span className="w-full sm:w-auto sm:text-right">
                    <span className="text-lg text-base-content">
                      {row.cash} cash
                    </span>{" "}
                    <span className="block text-sm text-base-content/60 sm:inline">
                      {row.note} · {row.card} by card or online
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-7">
              <Link href="/prices" className={textLink}>
                All prices
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 8. Questions: FAQPage schema above is built from the same list */}
      <HomeQuestions xeominCash={XEOMIN_CASH} xeominCard={XEOMIN_CARD} />

      {/* 9. Visit */}
      <section className="w-full py-16 md:py-24" aria-labelledby="home-visit-heading">
        <div className="rounded-[2rem] bg-base-200 px-6 py-12 text-center sm:px-10 md:py-16">
          <h2 id="home-visit-heading" className={sectionHeading}>
            Visit
          </h2>
          <p className="mt-5 text-lg text-base-content/80">3900 Powhatan Parkway, Williamsburg, VA 23188</p>
          <p className="mx-auto mt-2 max-w-[48ch] text-base text-base-content/70">{BOOKING_LINE}</p>
          <Link
            href={HOME_BOOK_HREF}
            className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-7 text-[0.95rem] font-medium text-primary-content transition-colors hover:bg-primary/90"
          >
            Book a visit
          </Link>
        </div>
      </section>
    </div>
  );
}
