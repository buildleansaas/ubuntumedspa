import { ImageResponse } from "next/server";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, ORIGIN } from "lib/seo";
import { SOURCE_SERIF_4_FAMILY, sourceSerifRegular } from "lib/socialImageFonts";

type SocialImageProperties = {
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
  if (title.length > 82) return 58;
  if (title.length > 60) return 68;
  return 78;
}

export async function createOpenGraphImage({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: SocialImageProperties) {
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
          padding: "56px 64px",
          fontFamily: SOURCE_SERIF_4_FAMILY,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ORIGIN}/logo.png`} width={56} height={56} alt="Williamsburg Med Spa logo" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, lineHeight: 1.15, color: "#2f3a3d" }}>Williamsburg Med Spa</div>
            <div style={{ fontSize: 15, lineHeight: 1.3, color: "#53636a", marginTop: 3 }}>
              Restorative Wellness & Natural Healing
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div
            style={{
              color: "#8d9aa0",
              fontSize: 15,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Medical Spa in Williamsburg, VA
          </div>
          <h1
            style={{
              margin: 0,
              maxWidth: 980,
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
              margin: "30px 0 0",
              maxWidth: 860,
              fontSize: 27,
              lineHeight: 1.34,
              color: "#53636a",
            }}
          >
            {displayDescription}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {['Botox', 'Fillers', 'PRP', 'O-Shot', 'Ear Piercing'].map((label) => (
              <div
                key={label}
                style={{
                  border: "1px solid #cbd3d7",
                  borderRadius: 999,
                  padding: "9px 15px",
                  color: "#2f3a3d",
                  fontSize: 15,
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
              padding: "13px 22px",
              fontSize: 17,
              lineHeight: 1,
            }}
          >
            williamsburgmedspa.com
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
      ],
    }
  );
}
