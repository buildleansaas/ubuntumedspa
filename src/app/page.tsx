import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import CtaFooter from "components/cta-footer";
import { Button } from "components/ui/button";
import NamedReviews from "components/named-reviews";
import StructuredData from "components/structured-data";
import { HomeRealPhotos } from "components/clinic-photos";
import { CARPAL_TUNNEL_PHOTO, HOME_INJECTION_CAPTION } from "config/clinic-photos";
import { COMMERCE_CATALOG_BY_SLUG, EAR_PIERCING_PRICES } from "config/commerce-catalog";
import { buildPageMetadata } from "lib/metadata";
import { cardPriceLabel, formatUsdShort } from "lib/price";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "lib/seo";
import BlomdahlCallout from "views/blomdahl-callout";
import BotoxPartyCallout from "views/botox-party-callout";
import HomeChooser, { type ChooserTile } from "views/home-chooser";
import { homeFaqs } from "views/home-questions";
import HomeVisit from "views/home-visit";
import Jumbotron from "views/jumbotron";
import LatestPosts from "views/latest-posts";
import OhShotCallout from "views/oh-shot-callout";
import Procedures from "views/procedures";
import Products from "views/products";
import ProviderCallout from "views/provider-callout";
import SearchAnswers, { getSearchAnswers } from "views/search-answers";

export const metadata: Metadata = buildPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  canonical: "/",
});

const XEOMIN_CASH = formatUsdShort(COMMERCE_CATALOG_BY_SLUG.xeomin.cashAmountCents);
const XEOMIN_CARD = cardPriceLabel(COMMERCE_CATALOG_BY_SLUG.xeomin.cashAmountCents);

const cash = (slug: string) => formatUsdShort(COMMERCE_CATALOG_BY_SLUG[slug].cashAmountCents);
const card = (slug: string) => cardPriceLabel(COMMERCE_CATALOG_BY_SLUG[slug].cashAmountCents);

const localLinks = [
  { href: "/procedures/botox", label: "Botox alternative in Williamsburg" },
  { href: "/procedures/xeomin", label: "Xeomin in Williamsburg" },
  { href: "/locations/williamsburg-va", label: "Hours & directions" },
  { href: "/locations", label: "Areas we serve" },
  { href: "/locations/yorktown-va", label: "Yorktown med spa" },
  { href: "/procedures/blomdahl-ear-piercing", label: "Ear piercing in Williamsburg" },
  { href: "/prices", label: "Med spa prices" },
] as const;

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

const sectionHeading = "font-display text-3xl leading-tight tracking-tight text-base-content md:text-[2.6rem]";

// Tidewater homepage: main's sections and visual elements in the Tidewater palette and type (clear buttons per
// screen), plus the treatment chooser and price list. Every section ends with a clear booking button.
export default async function Page() {
  return (
    <div className="w-full">
      <StructuredData type="FAQ" faqs={[...getSearchAnswers(XEOMIN_CASH, XEOMIN_CARD), ...homeFaqs]} />
      <Jumbotron xeominCash={XEOMIN_CASH} xeominCard={XEOMIN_CARD} />
      <HomeRealPhotos />

      <HomeChooser tiles={CHOOSER_TILES} />

      <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-20" aria-labelledby="home-local-intro-heading">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:gap-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">
            Nurse Practitioner led medical spa in Williamsburg, VA
          </p>
          <h2
            id="home-local-intro-heading"
            className="font-display mt-4 text-3xl font-medium leading-[1.15] tracking-tight text-base-content md:text-4xl"
          >
            Local care with Jenny Brady, MSN, RN, CPNP, PMHS for Xeomin wrinkle relaxer, PRP, sweating treatment, and medical ear piercing.
          </h2>
          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-base-content/85 md:text-lg">
            Williamsburg Med Spa is a Nurse Practitioner led medical spa in Williamsburg, VA. Jenny Brady brings
            MSN, RN, CPNP, PMHS, Cellular Medicine Association-certified OH-Shot provider training, and
            certified Blomdahl provider training for medical ear piercing, so care starts with medical screening,
            calm education, and treatment planning shaped around realistic goals.
          </p>
          <nav className="mt-6" aria-label="Williamsburg services and nearby areas">
            <ul className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2">
              {localLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-sm text-base-content underline decoration-base-300 underline-offset-[5px] transition-colors hover:text-primary hover:decoration-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/consult">Book a visit</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/staff/jenny-brady">About Jenny</Link>
            </Button>
          </div>
        </div>
        <figure className="mx-auto w-full max-w-sm lg:max-w-none">
          <Image
            src={CARPAL_TUNNEL_PHOTO.src}
            alt={CARPAL_TUNNEL_PHOTO.alt}
            width={CARPAL_TUNNEL_PHOTO.width}
            height={CARPAL_TUNNEL_PHOTO.height}
            sizes="(max-width: 448px) 90vw, 384px"
            className="aspect-[4/5] w-full rounded-[1.75rem] object-cover object-[50%_35%]"
          />
          <figcaption className="mt-3 text-sm text-base-content/75">{HOME_INJECTION_CAPTION}</figcaption>
        </figure>
        </div>
      </section>
      <NamedReviews heading="Clinic reviews" />
      <Procedures
        variant="editorial"
        featured={
          <div className="grid gap-8">
            <OhShotCallout />
            <BlomdahlCallout />
          </div>
        }
      />
      {/* Austin 2026-11-13: these answers sit after the treatments, quieter, so they don't interrupt the page. */}
      <SearchAnswers xeominCash={XEOMIN_CASH} xeominCard={XEOMIN_CARD} />

      {/* Prices, written out */}
      <section className="w-full border-t border-base-300 py-16 md:py-24" aria-labelledby="home-prices-heading">
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
                    <span className="text-lg text-base-content">{row.cash} cash</span>{" "}
                    <span className="block text-sm text-base-content/60 sm:inline">
                      {row.note} · {row.card} by card or online
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/consult">Book a visit</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                <Link href="/prices">All prices</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ProviderCallout />
      <Products variant="editorial" />
      <LatestPosts />
      <BotoxPartyCallout />
      <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-24" aria-labelledby="home-faq-heading">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">Williamsburg med spa FAQ</p>
          <h2
            id="home-faq-heading"
            className="font-display mt-4 text-4xl font-medium leading-[1.12] tracking-tight text-base-content md:text-5xl"
          >
            Quick answers before you book
          </h2>
          <div className="mt-8 divide-y divide-base-300 border-y border-base-300">
            {homeFaqs.map((faq) => (
              <article key={faq.question} className="py-6 md:py-8">
                <h3 className="font-display text-2xl font-medium leading-tight text-base-content md:text-3xl">{faq.question}</h3>
                <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-base-content/85">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <HomeVisit />
      <CtaFooter variant="editorial" />
    </div>
  );
}
