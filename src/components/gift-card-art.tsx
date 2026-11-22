import type { CSSProperties } from "react";

import type { GiftCardTheme } from "config/gift-card-themes";

/**
 * The gift card itself: cream card, holiday ribbon, disco pineapple, amount, clinic name.
 * Inline styles and flex only, so the same markup renders on the site and in next/og (the PNG route).
 * `width` scales everything; the card is 820 x 500 at width 820.
 */
export type GiftCardArtProps = {
  theme: GiftCardTheme;
  /** Face value, preformatted ("$100"). Omit for the sample card on the sales page. */
  amountLabel?: string;
  recipientName?: string;
  code?: string;
  logoSrc: string;
  width?: number;
  serifFont?: string;
  sansFont?: string;
  tilt?: boolean;
};

export default function GiftCardArt({
  theme,
  amountLabel,
  recipientName,
  code,
  logoSrc,
  width = 820,
  serifFont = "var(--font-editorial-serif), Georgia, serif",
  sansFont = "var(--font-editorial-sans), system-ui, sans-serif",
  tilt = false,
}: GiftCardArtProps) {
  const u = width / 820;
  const { colors } = theme;
  const px = (value: number) => `${Math.round(value * u * 10) / 10}px`;

  const card: CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: px(820),
    height: px(500),
    borderRadius: px(30),
    overflow: "hidden",
    backgroundImage: `linear-gradient(135deg, ${colors.cardFrom} 0%, ${colors.cardTo} 100%)`,
    color: colors.cardInk,
    boxShadow: `0 ${px(36)} ${px(70)} rgba(0,0,0,0.42)`,
    ...(tilt ? { transform: "rotate(-3deg)" } : {}),
    fontFamily: sansFont,
  };

  return (
    <div
      style={card}
      role="img"
      aria-label={`Williamsburg Med Spa ${amountLabel ? `${amountLabel} ` : ""}gift card`}
    >
      {colors.ribbon ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: px(600),
              width: px(34),
              height: px(500),
              backgroundColor: colors.ribbon,
              opacity: 0.92,
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: px(300),
              width: px(820),
              height: px(34),
              backgroundColor: colors.ribbon,
              opacity: 0.92,
              display: "flex",
            }}
          />
        </>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt=""
        width={Math.round(190 * u)}
        height={Math.round(259 * u)}
        style={{
          position: "absolute",
          right: px(40),
          top: px(42),
          width: px(190),
          height: px(259),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: px(54),
          top: px(46),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            fontWeight: 700,
            letterSpacing: "0.3em",
            fontSize: px(19),
            color: colors.cardAccent,
          }}
        >
          {theme.cardKicker}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: serifFont,
            fontWeight: 400,
            fontSize: px(amountLabel ? 104 : 66),
            lineHeight: 1,
            marginTop: px(22),
            color: colors.cardInk,
          }}
        >
          {amountLabel ?? "Gift card"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: px(24),
            marginTop: px(16),
            color: "#4b5b66",
          }}
        >
          {recipientName
            ? `For ${recipientName}`
            : "Toward any treatment or product"}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: px(54),
          bottom: px(40),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{ display: "flex", fontFamily: serifFont, fontSize: px(28) }}
        >
          Williamsburg Med Spa
        </div>
        <div
          style={{
            display: "flex",
            fontSize: px(16),
            letterSpacing: "0.12em",
            color: "#6b7a84",
            marginTop: px(4),
          }}
        >
          {code ? code : "JENNY BRADY, NP"}
        </div>
      </div>
    </div>
  );
}
