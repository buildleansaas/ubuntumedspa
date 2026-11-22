import type { Metadata } from "next";
import Link from "next/link";

import GiftCardAmountPicker from "components/gift-card-amount-picker";
import GiftCardArt from "components/gift-card-art";
import StructuredData from "components/structured-data";
import TextToBook from "components/text-to-book";
import {
  GIFT_CARD_FACE_VALUES_CENTS,
  GIFT_CARD_MAX_ORDER_CASH_CENTS,
  GIFT_CARD_TEXT_ONLY_CENTS,
  giftCardSlug,
} from "config/commerce-catalog";
import { activeGiftCardTheme } from "config/gift-card-themes";
import { GIFT_CARD_TERMS } from "lib/gift-card-rules";
import { buildPageMetadata } from "lib/metadata";
import { cardPriceLabel, formatUsdShort } from "lib/price";

// One evergreen URL; the look changes with the active theme (config/gift-card-themes.ts). Never type a price here.
const GIFT_CARDS_PATH = "/gift-cards";
const minCash = formatUsdShort(GIFT_CARD_FACE_VALUES_CENTS[0]);
const maxCash = formatUsdShort(GIFT_CARD_MAX_ORDER_CASH_CENTS);
const textOnly = GIFT_CARD_TEXT_ONLY_CENTS.map(formatUsdShort).join(", ");

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Med Spa Gift Cards in Williamsburg, VA | Williamsburg Med Spa",
    description: `Williamsburg Med Spa gift cards from ${minCash} to ${maxCash}, emailed right after checkout. Use toward Botox®, Xeomin®, PRP, B-12 and more with Jenny Brady, NP. Never expires.`,
    canonical: GIFT_CARDS_PATH,
  });
}

// Rendered per request so the theme switches on its first day (clinic time).
export const dynamic = "force-dynamic";

const FAQS = [
  {
    question: "How is the gift card delivered?",
    answer:
      "Right after checkout we email you a link to the gift card. Open it to print the card or forward it to the person it's for. Each card has its own code.",
  },
  {
    question: "What can the gift card be used for?",
    answer:
      "Any treatment or product at Williamsburg Med Spa, including Botox®, Xeomin®, PRP treatments, B-12 injections, ear piercing and skincare. It can be used over more than one visit.",
  },
  {
    question: "Does the gift card expire?",
    answer: "No. It never expires and has no fees.",
  },
  {
    question: "What if a treatment isn't right for the person?",
    answer:
      "Treatments still need Jenny's assessment. The card can go toward a different treatment or a product, and if nothing suits them, the buyer can get a refund.",
  },
  {
    question: `Can I buy more than ${maxCash}?`,
    answer: `Online gift cards go up to ${maxCash} per order. For ${textOnly} or another amount, text Jenny and she'll set it up with you.`,
  },
];

export default function GiftCardsPage() {
  const theme = activeGiftCardTheme();
  const { colors } = theme;
  const [leadLine1, leadLine2] = theme.headlineLead.split("\n");
  const slugs = Object.fromEntries(GIFT_CARD_FACE_VALUES_CENTS.map((cents) => [cents, giftCardSlug(cents)]));

  return (
    <div className="w-full py-8 md:py-12" data-gift-card-theme={theme.slug}>
      <StructuredData
        type="Breadcrumb"
        breadcrumbItems={[
          { name: "Home", item: "https://www.williamsburgmedspa.com" },
          { name: "Gift cards", item: "https://www.williamsburgmedspa.com/gift-cards" },
        ]}
      />
      <StructuredData type="FAQ" faqs={FAQS} />

      <section
        className="relative overflow-hidden rounded-[28px] px-5 pb-12 pt-14 sm:px-10 md:px-16 md:pb-16 md:pt-20"
        style={{
          backgroundImage: `radial-gradient(120% 80% at 50% 0%, ${colors.backgroundTop} 0%, ${colors.backgroundBottom} 100%)`,
          color: colors.text,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-3 rounded-[22px] border md:inset-5"
          style={{ borderColor: `${colors.accent}80` }}
        />
        {[
          "left-[8%] top-[7%] text-2xl",
          "right-[10%] top-[12%] text-lg",
          "left-[6%] bottom-[18%] text-base",
          "right-[8%] bottom-[8%] text-2xl",
        ].map((position) => (
          <span key={position} aria-hidden className={`pointer-events-none absolute ${position}`} style={{ color: colors.accent, opacity: 0.7 }}>
            ✦
          </span>
        ))}

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold tracking-[0.3em]" style={{ color: colors.accent }}>
              {theme.kicker}
            </p>
            <h1 className="font-display mt-5 text-5xl font-normal leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
              {leadLine1}
              {leadLine2 ? (
                <>
                  <br />
                  {leadLine2}{" "}
                </>
              ) : " "}
              <em className="italic" style={{ color: colors.accent }}>
                {theme.headlineAccent}
              </em>
              {theme.headlineTail ? ` ${theme.headlineTail}` : null}
            </h1>
            <p className="mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed lg:mx-0" style={{ color: colors.mutedText }}>
              {theme.intro}
            </p>
            <div className="mx-auto mt-9 max-w-md lg:mx-0">
              <GiftCardAmountPicker
                theme={theme}
                faceValuesCents={GIFT_CARD_FACE_VALUES_CENTS}
                slugs={slugs}
                defaultCents={10000}
              />
              <p className="mt-4 text-center text-sm" style={{ color: colors.mutedText }}>
                Emailed right after checkout. Larger amounts ({textOnly}): text Jenny.
              </p>
            </div>
          </div>

          <div className="flex justify-center px-2 py-4">
            <div className="w-full max-w-[520px]">
              <div className="hidden sm:block">
                <GiftCardArt theme={theme} logoSrc="/logo.png" width={520} tilt />
              </div>
              <div className="flex justify-center sm:hidden">
                <GiftCardArt theme={theme} logoSrc="/logo.png" width={270} tilt />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-1 py-14 md:py-20">
        <h2 className="font-display text-3xl font-medium tracking-tight text-base-content md:text-4xl">How it works</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["Pick an amount", `${minCash} to ${maxCash}. Add the person's name and a short message at checkout.`],
            ["Get it by email", "The gift card arrives right after you pay, ready to print or forward."],
            ["They book with Jenny", "They text Jenny to book and bring the code. It never expires."],
          ].map(([title, body], index) => (
            <li key={title} className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <p className="font-display text-3xl text-secondary">{index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-base-content">{title}</h3>
              <p className="mt-2 text-base leading-relaxed text-base-content/80">{body}</p>
            </li>
          ))}
        </ol>

        <h2 className="font-display mt-16 text-3xl font-medium tracking-tight text-base-content md:text-4xl">Prices</h2>
        <ul className="mt-6 divide-y divide-base-300 rounded-2xl border border-base-300 bg-base-100" data-gift-card-prices>
          {GIFT_CARD_FACE_VALUES_CENTS.map((cents) => (
            <li key={cents} className="flex items-center justify-between px-5 py-3 text-base">
              <span className="font-medium text-base-content">{formatUsdShort(cents)} gift card</span>
              <span className="text-base-content/80">{cardPriceLabel(cents)} online by card</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-base-content/70">
          Online prices include card processing, the same as every online purchase on this site.
        </p>

        <h2 className="font-display mt-16 text-3xl font-medium tracking-tight text-base-content md:text-4xl">Terms</h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-relaxed text-base-content/85" data-gift-card-terms>
          {GIFT_CARD_TERMS.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>

        <h2 className="font-display mt-16 text-3xl font-medium tracking-tight text-base-content md:text-4xl">Questions</h2>
        <div className="mt-6 space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-lg font-semibold text-base-content">{faq.question}</h3>
              <p className="mt-2 text-base leading-relaxed text-base-content/80">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <TextToBook
            heading="Want a larger gift card?"
            intro={`Text Jenny for ${textOnly} or another amount, or with any gift card question.`}
            message="Hi Jenny, I'd like to buy a gift card for $"
            location="service_page"
          />
        </div>

        <p className="mt-10 text-sm text-base-content/70">
          See every treatment price on the{" "}
          <Link href="/prices" className="link link-primary">
            prices page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
