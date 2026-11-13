import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import CtaFooter from "components/cta-footer";
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
import HomeQuestions, { homeFaqs } from "views/home-questions";
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

const sectionHeading = "font-display text-3xl leading-tight tracking-tight text-base-content md:text-[2.6rem]";
const textLink =
  "rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary";

// Tidewater homepage: every section, word and link from the previous homepage, in a calmer presentation
// (spacing, type, color, one filled button per screen), plus the treatment chooser, first-visit steps and price list.
export default async function Page() {
  return (
    <div className="w-full">
      <StructuredData type="FAQ" faqs={[...getSearchAnswers(XEOMIN_CASH, XEOMIN_CARD), ...homeFaqs]} />
      <Jumbotron xeominCash={XEOMIN_CASH} xeominCard={XEOMIN_CARD} />
      <HomeRealPhotos />

      <HomeChooser tiles={CHOOSER_TILES} />

      {/* Local care with Jenny, merged with the provider bio */}
      <section className="w-full scroll-mt-28 py-16 md:py-24" aria-labelledby="home-local-intro-heading">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:gap-20">
          <div>
            <p className="text-sm text-base-content/65">Nurse Practitioner led medical spa in Williamsburg, VA</p>
            <h2 id="home-local-intro-heading" className={`${sectionHeading} mt-3`}>
              Local care with Jenny Brady, MSN, RN, CPNP, PMHS for Xeomin wrinkle relaxer, PRP, sweating treatment, and medical ear piercing.
            </h2>
            <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-base-content/75 md:text-lg">
              Williamsburg Med Spa is a Nurse Practitioner led medical spa in Williamsburg, VA. Jenny Brady brings
              MSN, RN, CPNP, PMHS, Cellular Medicine Association-certified OH-Shot provider training, and
              certified Blomdahl provider training for medical ear piercing, so care starts with medical screening,
              calm education, and treatment planning shaped around realistic goals.
            </p>
            <nav className="mt-6" aria-label="Williamsburg services and nearby areas">
              <ul className="flex max-w-3xl flex-wrap gap-x-2 gap-y-1.5 text-sm">
                {localLinks.map((item) => (
                  <li key={item.href} className="after:ml-2 after:text-base-content/30 after:content-['·'] last:after:content-none">
                    <Link className="text-secondary transition-colors hover:text-base-content" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <ProviderCallout merged />
            <p className="mt-6">
              <Link href="/staff/jenny-brady" className={textLink}>
                More about Jenny
              </Link>
            </p>
          </div>
          <figure className="mx-auto w-full max-w-[20rem] lg:sticky lg:top-28 lg:mx-0 lg:max-w-none">
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
        </div>
      </section>

      {/* Your first visit */}
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

      <SearchAnswers xeominCash={XEOMIN_CASH} xeominCard={XEOMIN_CARD} />
      <NamedReviews heading="Clinic reviews" />
      <Procedures
        variant="editorial"
        featured={
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-14">
            <OhShotCallout />
            <BlomdahlCallout />
          </div>
        }
      />

      {/* Prices, written out */}
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
                    <span className="text-lg text-base-content">{row.cash} cash</span>{" "}
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

      <Products variant="editorial" />
      <LatestPosts />
      <BotoxPartyCallout />
      <HomeQuestions />
      <HomeVisit />
      <CtaFooter variant="editorial" />
    </div>
  );
}
