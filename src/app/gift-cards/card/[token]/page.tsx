import type { Metadata } from "next";
import { notFound } from "next/navigation";

import GiftCardArt from "components/gift-card-art";
import { giftCardThemeBySlug } from "config/gift-card-themes";
import { GIFT_CARD_TERMS, getGiftCardByViewToken } from "lib/gift-cards";
import { formatUsdShort } from "lib/price";
import { BOOKING_PHONE_DISPLAY, bookingSmsHref } from "lib/text-to-book";

// The recipient's card. Private: the page shows the code, so it is noindex, robots-disallowed and never cached.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your Williamsburg Med Spa gift card",
  robots: { index: false, follow: false },
  // The URL is as good as the code: don't pass it on as a referrer.
  referrer: "no-referrer",
};

export default async function GiftCardViewPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;
  const card = await getGiftCardByViewToken(token);
  if (!card) return notFound();

  const theme = giftCardThemeBySlug(card.themeSlug);
  const { colors } = theme;
  const amount = formatUsdShort(card.faceValueCents);

  if (card.status !== "active") {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <h1 className="font-display text-4xl font-medium text-base-content">This gift card is no longer active</h1>
        <p className="mt-4 text-base-content/80">Questions? Text Jenny at {BOOKING_PHONE_DISPLAY}.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 md:py-12">
      <section
        className="relative overflow-hidden rounded-[28px] px-5 py-14 text-center sm:px-10 md:py-20"
        style={{
          backgroundImage: `radial-gradient(120% 80% at 50% 0%, ${colors.backgroundTop} 0%, ${colors.backgroundBottom} 100%)`,
          color: colors.text,
        }}
      >
        <p className="text-sm font-semibold tracking-[0.3em]" style={{ color: colors.accent }}>
          {theme.kicker}
        </p>
        <h1 className="font-display mt-4 text-4xl font-normal tracking-tight sm:text-6xl">
          {card.recipientName ? `For ${card.recipientName}` : "A gift for you"}
        </h1>
        <div className="mt-10 flex justify-center">
          <div className="hidden sm:block">
            <GiftCardArt theme={theme} amountLabel={amount} code={card.code} logoSrc="/logo.png" width={560} />
          </div>
          <div className="sm:hidden">
            <GiftCardArt theme={theme} amountLabel={amount} code={card.code} logoSrc="/logo.png" width={280} />
          </div>
        </div>
        {card.message ? (
          <p className="font-display mx-auto mt-10 max-w-[40ch] text-2xl italic" style={{ color: colors.mutedText }}>
            &ldquo;{card.message}&rdquo;
          </p>
        ) : null}
        <p className="mt-8 text-lg" style={{ color: colors.mutedText }}>
          Code <span className="font-semibold tracking-wider" style={{ color: colors.text }}>{card.code}</span>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <a
            href={bookingSmsHref(`Hi Jenny, I have a ${amount} gift card (${card.code}) and I'd like to book. Days and times that work for me:`)}
            className="inline-flex h-12 items-center rounded-full px-6 font-semibold"
            style={{ backgroundColor: colors.accent, color: colors.accentText }}
          >
            Text Jenny to book
          </a>
          <a
            href={`/gift-cards/card/${card.viewToken}/image`}
            download={`williamsburg-med-spa-gift-card-${card.faceValueCents / 100}.png`}
            className="inline-flex h-12 items-center rounded-full border px-6 font-semibold"
            style={{ borderColor: colors.accent, color: colors.text }}
          >
            Download image
          </a>
        </div>
      </section>
      <div className="mx-auto max-w-3xl py-10">
        <h2 className="text-lg font-semibold text-base-content">How to use it</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base-content/85">
          <li>Text or call Jenny at {BOOKING_PHONE_DISPLAY} to book, and mention the code.</li>
          {GIFT_CARD_TERMS.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
