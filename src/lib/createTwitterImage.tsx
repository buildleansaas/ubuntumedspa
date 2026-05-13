import { ImageResponse } from "next/server";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, ORIGIN } from "lib/seo";
import { SOURCE_SERIF_4_FAMILY, sourceSerifRegular } from "lib/socialImageFonts";

type TwitterImageProperties = {
  title?: string;
  description?: string;
};

function getDisplayTitle(title: string) {
  return title === DEFAULT_TITLE ? "Medical Spa in Williamsburg, VA" : title;
}

function getDisplayDescription(description: string) {
  return description === DEFAULT_DESCRIPTION
    ? "Botox, Xeomin, dermal fillers, PRP treatments, O-Shot services, and Blomdahl medical ear piercing."
    : description;
}

function getTitleSize(title: string) {
  if (title.length > 82) return 70;
  if (title.length > 60) return 82;
  return 96;
}

export async function createTwitterImage({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: TwitterImageProperties) {
  const displayTitle = getDisplayTitle(title);
  const displayDescription = getDisplayDescription(description);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3f5f6",
          color: "#2f3a3d",
          padding: "72px 86px",
          fontFamily: SOURCE_SERIF_4_FAMILY,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ORIGIN}/logo.png`} width={68} height={68} alt="Williamsburg Med Spa logo" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, lineHeight: 1.12, color: "#2f3a3d" }}>Williamsburg Med Spa</div>
            <div style={{ fontSize: 19, lineHeight: 1.3, color: "#53636a", marginTop: 4 }}>
              Restorative Wellness & Natural Healing
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div
            style={{
              color: "#8d9aa0",
              fontSize: 18,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 34,
            }}
          >
            Medical Spa in Williamsburg, VA
          </div>
          <h1
            style={{
              margin: 0,
              maxWidth: 1240,
              fontSize: getTitleSize(displayTitle),
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              fontWeight: 400,
              color: "#2f3a3d",
            }}
          >
            {displayTitle}
          </h1>
          <p
            style={{
              margin: "36px 0 0",
              maxWidth: 1100,
              fontSize: 34,
              lineHeight: 1.32,
              color: "#53636a",
            }}
          >
            {displayDescription}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {['Botox', 'Fillers', 'PRP', 'O-Shot', 'Ear Piercing'].map((label) => (
              <div
                key={label}
                style={{
                  border: "1px solid #cbd3d7",
                  borderRadius: 999,
                  padding: "11px 18px",
                  color: "#2f3a3d",
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <div
            style={{
              background: "#6f89a1",
              color: "white",
              borderRadius: 999,
              padding: "16px 27px",
              fontSize: 21,
              lineHeight: 1,
            }}
          >
            williamsburgmedspa.com
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
      ],
    }
  );
}
