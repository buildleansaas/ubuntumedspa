import { ImageResponse } from "next/server";
import { DEFAULT_TITLE, ORIGIN } from "lib/seo";

type TwitterImageProperties = {
  title?: string;
  description?: string;
};

function getDisplayTitle(title: string) {
  return title === DEFAULT_TITLE ? "Medical Spa in\nWilliamsburg, VA" : title;
}

export async function createTwitterImage({ title = DEFAULT_TITLE }: TwitterImageProperties) {
  const displayTitle = getDisplayTitle(title);

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
          color: "#273235",
          padding: "86px 96px 56px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ORIGIN}/logo.png`} width={58} height={58} alt="Williamsburg Med Spa logo" />
          <div style={{ fontSize: 32, lineHeight: 1, color: "#273235" }}>Williamsburg Med Spa</div>
        </div>

        <h1
          style={{
            margin: "0 0 72px",
            whiteSpace: "pre-line",
            maxWidth: 1280,
            fontSize: 104,
            lineHeight: 1.12,
            letterSpacing: "-0.055em",
            fontWeight: 400,
            color: "#273235",
          }}
        >
          {displayTitle}
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div style={{ height: 1, width: "100%", background: "#d4dbde" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 29, lineHeight: 1.2, color: "#6b7a80" }}>
              Botox · Fillers · PRP · O-Shot · Medical Ear Piercing
            </div>
            <div style={{ fontSize: 29, lineHeight: 1.2, color: "#6b7a80" }}>williamsburgmedspa.com</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1600,
      height: 900,
    }
  );
}
