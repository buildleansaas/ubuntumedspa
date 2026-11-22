import { ImageResponse } from "next/og";

import Sparkle from "components/sparkle";

import GiftCardArt from "components/gift-card-art";
import { GIFT_CARD_FACE_VALUES_CENTS, GIFT_CARD_MAX_ORDER_CASH_CENTS } from "config/commerce-catalog";
import type { GiftCardTheme } from "config/gift-card-themes";
import { formatUsdShort } from "lib/price";
import { logoDataUri, socialFonts } from "lib/social-fonts";

/**
 * /gift-cards share card (1200x630): the active theme's background and headline with the real gift card, tilted, the
 * same art as the page and the recipient PNG. Re-skins with the theme (config/gift-card-themes.ts).
 */
export const renderGiftCardSocialImage = (theme: GiftCardTheme) => {
  const { colors } = theme;
  const [lead1, lead2] = theme.headlineLead.split("\n");
  const range = `${formatUsdShort(GIFT_CARD_FACE_VALUES_CENTS[0])} to ${formatUsdShort(GIFT_CARD_MAX_ORDER_CASH_CENTS)}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundImage: `radial-gradient(120% 90% at 30% 0%, ${colors.backgroundTop} 0%, ${colors.backgroundBottom} 100%)`,
          color: colors.text,
          fontFamily: "Hanken",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            width: 1152,
            height: 582,
            border: `1.5px solid ${colors.accent}8c`,
            borderRadius: 26,
            display: "flex",
          }}
        />
        {[
          { top: 64, left: 70, size: 26 },
          { top: 80, left: 1100, size: 18 },
          { top: 520, left: 560, size: 16 },
          { top: 540, left: 1090, size: 26 },
        ].map(({ top, left, size }) => (
          <Sparkle key={`${top}-${left}`} size={size} color={colors.accent} style={{ position: "absolute", top, left, opacity: 0.8 }} />
        ))}

        <div style={{ display: "flex", flexDirection: "column", width: 560, paddingLeft: 84 }}>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 700, letterSpacing: "0.3em", color: colors.accent }}>
            {theme.kicker}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 22, fontFamily: "Newsreader", fontSize: 76, lineHeight: 1.02 }}>
            <div style={{ display: "flex" }}>{lead1}</div>
            <div style={{ display: "flex" }}>
              {lead2 ? `${lead2} ` : ""}
              <span style={{ fontStyle: "italic", color: colors.accent }}>{theme.headlineAccent}</span>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 25, lineHeight: 1.4, color: colors.mutedText }}>
            {`Gift cards ${range}, emailed right after checkout. Never expires.`}
          </div>
          <div style={{ display: "flex", marginTop: 30, fontSize: 21, color: colors.mutedText, letterSpacing: "0.04em" }}>
            williamsburgmedspa.com/gift-cards
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", width: 600, paddingRight: 30 }}>
          <div style={{ display: "flex", transform: "rotate(-4deg)" }}>
            <GiftCardArt theme={theme} logoSrc={logoDataUri()} width={540} serifFont="Newsreader" sansFont="Hanken" />
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: socialFonts() }
  );
};
