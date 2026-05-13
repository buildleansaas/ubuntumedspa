import { ImageResponse } from "next/server";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, ORIGIN } from "lib/seo";
import { SOURCE_SERIF_4_FAMILY, sourceSerifBold, sourceSerifRegular } from "lib/socialImageFonts";

type TwitterImageProperties = {
  title?: string;
  description?: string;
};

function clampTitleSize(title: string) {
  if (title.length > 76) return 68;
  if (title.length > 58) return 76;
  return 88;
}

export async function createTwitterImage({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: TwitterImageProperties) {
  const titleSize = clampTitleSize(title);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#fbfaf7",
          color: "#192c2a",
          fontFamily: SOURCE_SERIF_4_FAMILY,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,244,236,0.96) 52%, rgba(214,232,225,0.9) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -130,
            top: -150,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "rgba(167, 203, 190, 0.32)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 78,
            top: 62,
            right: 78,
            bottom: 62,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(25,44,42,0.12)",
            borderRadius: 42,
            padding: "54px 68px",
            background: "rgba(255,255,255,0.58)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ORIGIN}/logo.png`} width={82} height={82} alt="Williamsburg Med Spa logo" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 35, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
                  Williamsburg Med Spa
                </div>
                <div style={{ fontSize: 23, color: "#526965", marginTop: 4 }}>Restorative wellness in Historic Williamsburg</div>
              </div>
            </div>
            <div
              style={{
                fontSize: 22,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#526965",
                border: "1px solid rgba(25,44,42,0.16)",
                borderRadius: 999,
                padding: "13px 20px",
              }}
            >
              PRP • Aesthetics • Wellness
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 1200 }}>
            <div style={{ width: 96, height: 4, background: "#b49773", marginBottom: 32 }} />
            <h1
              style={{
                margin: 0,
                fontSize: titleSize,
                lineHeight: 0.98,
                letterSpacing: "-0.045em",
                fontWeight: 700,
                color: "#172724",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: "32px 0 0",
                fontSize: 32,
                lineHeight: 1.35,
                color: "#415652",
                maxWidth: 1160,
              }}
            >
              {description}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#526965", fontSize: 26 }}>
            <div>williamsburgmedspa.com</div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 9, height: 9, borderRadius: 999, background: "#b49773" }} />
              <div>Clean, natural, medically guided care</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1600,
      height: 900,
      fonts: [
        {
          name: SOURCE_SERIF_4_FAMILY,
          data: await sourceSerifRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: SOURCE_SERIF_4_FAMILY,
          data: await sourceSerifBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
