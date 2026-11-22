import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import GiftCardArt from "components/gift-card-art";
import type { GiftCardTheme } from "config/gift-card-themes";
import { formatUsdShort } from "lib/price";

/** 1080 x 1350 gift card PNG (Facebook/Instagram portrait), the same card as the site, on the theme's background. */
export const GIFT_CARD_IMAGE_WIDTH = 1080;
export const GIFT_CARD_IMAGE_HEIGHT = 1350;

const asset = (...parts: string[]) => readFileSync(join(process.cwd(), ...parts));
const logoDataUri = () => `data:image/png;base64,${asset("public", "logo.png").toString("base64")}`;

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
  const fonts = [
    { name: "Newsreader", data: asset("src", "assets", "fonts", "Newsreader-Regular.ttf"), weight: 400 as const, style: "normal" as const },
    { name: "Newsreader", data: asset("src", "assets", "fonts", "Newsreader-Italic.ttf"), weight: 400 as const, style: "italic" as const },
    { name: "Hanken", data: asset("src", "assets", "fonts", "HankenGrotesk-Regular.ttf"), weight: 400 as const, style: "normal" as const },
    { name: "Hanken", data: asset("src", "assets", "fonts", "HankenGrotesk-Bold.ttf"), weight: 700 as const, style: "normal" as const },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `radial-gradient(120% 80% at 50% 0%, ${colors.backgroundTop} 0%, ${colors.backgroundBottom} 100%)`,
          color: colors.text,
          fontFamily: "Hanken",
          padding: "110px 100px 90px",
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "auto" }}>
          <div style={{ display: "flex", fontSize: 26, color: colors.mutedText }}>Text (804) 738-9483 to book with Jenny</div>
          <div style={{ display: "flex", fontSize: 22, color: colors.mutedText, marginTop: 8, letterSpacing: "0.06em" }}>
            williamsburgmedspa.com · Never expires
          </div>
        </div>
      </div>
    ),
    { width: GIFT_CARD_IMAGE_WIDTH, height: GIFT_CARD_IMAGE_HEIGHT, fonts }
  );
};
