import { ImageResponse } from "next/og";

import Sparkle from "components/sparkle";

import { DEFAULT_TITLE } from "lib/seo";
import { logoDataUri, socialFonts } from "lib/social-fonts";
import { BOOKING_PHONE_DISPLAY } from "lib/text-to-book";

/**
 * Site share card (1200x630, Open Graph and Twitter): Tidewater linen with a river-slate panel holding the disco
 * pineapple, Newsreader headline, Hanken text, the same palette as the site and the gift cards.
 */
type SocialImageProperties = {
  title?: string;
  description?: string;
};

const LINEN = "#f4f3ef";
const INK = "#24313a";
const RIVER = "#436379";
const MUTED = "#5b6a73";
const GOLD = "#d4ae55";
const SLATE_TOP = "#2e3e49";
const SLATE_BOTTOM = "#1c262d";

/** The headline part of an SEO title ("Botox in Williamsburg, VA | Botox & Xeomin from $250" -> "Botox in Williamsburg, VA"). */
export const socialHeadline = (title: string) => {
  if (title === DEFAULT_TITLE) return "Medical spa in Williamsburg, VA";
  return title.split(/\s+[|·–—]\s+/)[0].trim();
};

const headlineSize = (text: string) => (text.length <= 34 ? 78 : text.length <= 56 ? 64 : text.length <= 80 ? 52 : 44);

export async function createOpenGraphImage({ title = DEFAULT_TITLE }: SocialImageProperties) {
  const headline = socialHeadline(title);
  const isHome = title === DEFAULT_TITLE;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: LINEN,
          color: INK,
          fontFamily: "Hanken",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 760,
            padding: "70px 64px 60px 76px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 20, fontWeight: 700, letterSpacing: "0.3em", color: RIVER }}>
              WILLIAMSBURG MED SPA
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 30,
                fontFamily: "Newsreader",
                fontSize: headlineSize(headline),
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
                color: INK,
              }}
            >
              <div style={{ display: "flex" }}>{isHome ? "Medical spa in" : headline}</div>
              {isHome ? (
                <div style={{ display: "flex" }}>
                  <span style={{ fontStyle: "italic", color: RIVER }}>Williamsburg</span>
                  <span>, VA</span>
                </div>
              ) : null}
            </div>
            <div style={{ display: "flex", marginTop: 28, fontSize: 26, lineHeight: 1.4, color: MUTED, maxWidth: 600 }}>
              Nurse practitioner-led care with Jenny Brady, NP. Every price posted.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                backgroundColor: INK,
                color: LINEN,
                borderRadius: 999,
                padding: "16px 28px",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {`Text ${BOOKING_PHONE_DISPLAY}`}
            </div>
            <div style={{ display: "flex", marginLeft: 22, fontSize: 22, color: MUTED }}>williamsburgmedspa.com</div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 400,
            margin: "28px 28px 28px 0",
            borderRadius: 28,
            backgroundImage: `radial-gradient(120% 90% at 50% 0%, ${SLATE_TOP} 0%, ${SLATE_BOTTOM} 100%)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              width: 372,
              height: 546,
              border: `1.5px solid ${GOLD}80`,
              borderRadius: 20,
              display: "flex",
            }}
          />
          {[
            { top: 70, left: 58, size: 26 },
            { top: 120, left: 318, size: 18 },
            { top: 470, left: 70, size: 16 },
            { top: 500, left: 318, size: 26 },
          ].map(({ top, left, size }) => (
            <Sparkle key={`${top}-${left}`} size={size} color={GOLD} style={{ position: "absolute", top, left, opacity: 0.8 }} />
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUri()} alt="" width={250} height={341} style={{ width: 250, height: 341 }} />
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: socialFonts() }
  );
}
