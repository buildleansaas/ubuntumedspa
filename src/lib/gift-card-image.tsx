import { ImageResponse } from "next/og";

import GiftCardArt from "components/gift-card-art";
import type { GiftCardTheme } from "config/gift-card-themes";
import { formatUsdShort } from "lib/price";
import { logoDataUri, socialFonts } from "lib/social-fonts";
import { BOOKING_PHONE_DISPLAY } from "lib/text-to-book";

/** 1080 x 1350 gift card PNG (Facebook/Instagram portrait), the same card as the site, on the theme's background. */
export const GIFT_CARD_IMAGE_WIDTH = 1080;
export const GIFT_CARD_IMAGE_HEIGHT = 1350;


export const renderGiftCardImage = ({
  theme,
  faceValueCents,
  code,
  recipientName,
  message,
}: {
  theme: GiftCardTheme;
  faceValueCents: number;
  code: string;
  recipientName?: string;
  message?: string;
}) => {
  const { colors } = theme;
  const fonts = socialFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `radial-gradient(120% 80% at 50% 0%, ${colors.backgroundTop} 0%, ${colors.backgroundBottom} 100%)`,
          color: colors.text,
          fontFamily: "Hanken",
          padding: "90px 100px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: `2px solid ${colors.accent}8c`,
            borderRadius: 28,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", fontWeight: 700, letterSpacing: "0.32em", fontSize: 24, color: colors.accent }}>
          {theme.kicker}
        </div>
        <div style={{ display: "flex", fontFamily: "Newsreader", fontSize: 76, marginTop: 24, textAlign: "center" }}>
          {recipientName ? `For ${recipientName}` : "A gift for you"}
        </div>
        <div style={{ display: "flex", marginTop: 60, marginBottom: 56 }}>
          <GiftCardArt
            theme={theme}
            amountLabel={formatUsdShort(faceValueCents)}
            code={code}
            logoSrc={logoDataUri()}
            width={820}
            serifFont="Newsreader"
            sansFont="Hanken"
          />
        </div>
        {message ? (
          <div
            style={{
              display: "flex",
              fontFamily: "Newsreader",
              fontStyle: "italic",
              fontSize: 36,
              lineHeight: 1.3,
              textAlign: "center",
              color: colors.mutedText,
              maxWidth: 820,
            }}
          >
            {`“${message}”`}
          </div>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 70 }}>
          <div style={{ display: "flex", fontSize: 26, color: colors.mutedText }}>{`Text ${BOOKING_PHONE_DISPLAY} to book with Jenny`}</div>
          <div style={{ display: "flex", fontSize: 22, color: colors.mutedText, marginTop: 8, letterSpacing: "0.06em" }}>
            williamsburgmedspa.com · Never expires
          </div>
        </div>
      </div>
    ),
    { width: GIFT_CARD_IMAGE_WIDTH, height: GIFT_CARD_IMAGE_HEIGHT, fonts }
  );
};
