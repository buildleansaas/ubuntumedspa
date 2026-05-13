import { ImageResponse } from "next/server";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, ORIGIN } from "lib/seo";
import { SOURCE_SERIF_4_FAMILY, sourceSerifBold, sourceSerifRegular } from "lib/socialImageFonts";

type OpenGraphImageProperties = {
  title?: string;
  description?: string;
};

function clampTitleSize(title: string) {
  if (title.length > 76) return 58;
  if (title.length > 58) return 66;
  return 76;
}

export async function createOpenGraphImage({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: OpenGraphImageProperties) {
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
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(246,241,232,0.96) 48%, rgba(214,232,225,0.9) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -110,
            top: -150,
            width: 540,
            height: 540,
            borderRadius: "50%",
            background: "rgba(167, 203, 190, 0.32)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 96,
            bottom: 82,
            width: 230,
            height: 230,
            borderRadius: "50%",
            border: "1px solid rgba(25,44,42,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 48,
            right: 64,
            bottom: 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(25,44,42,0.12)",
            borderRadius: 34,
            padding: "44px 56px",
            background: "rgba(255,255,255,0.58)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ORIGIN}/logo.png`} width={70} height={70} alt="Williamsburg Med Spa logo" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 29, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
                  Williamsburg Med Spa
                </div>
                <div style={{ fontSize: 20, color: "#526965", marginTop: 4 }}>Restorative wellness in Historic Williamsburg</div>
              </div>
            </div>
            <div
              style={{
                fontSize: 20,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#526965",
                border: "1px solid rgba(25,44,42,0.16)",
                borderRadius: 999,
                padding: "12px 18px",
              }}
            >
              PRP • Aesthetics • Wellness
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 930 }}>
            <div style={{ width: 84, height: 3, background: "#b49773", marginBottom: 28 }} />
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
                margin: "28px 0 0",
                fontSize: 27,
                lineHeight: 1.36,
                color: "#415652",
                maxWidth: 900,
              }}
            >
              {description}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#526965", fontSize: 23 }}>
            <div>williamsburgmedspa.com</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: "#b49773" }} />
              <div>Clean, natural, medically guided care</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
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
