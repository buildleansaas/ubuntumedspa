import { ImageResponse } from "next/server";
import { DEFAULT_TITLE } from "lib/seo";

type TwitterImageProperties = {
  title?: string;
  description?: string;
};

const PHONE_NUMBER = "+1 (804) 738-9483";
const LOGO_URL = "https://www.williamsburgmedspa.com/logo.png";

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
          padding: "106px 112px 88px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <img
          src={LOGO_URL}
          alt=""
          width="154"
          height="154"
          style={{
            position: "absolute",
            top: 78,
            right: 96,
            width: 154,
            height: 154,
            objectFit: "contain",
            opacity: 0.82,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <div
            style={{
              width: 116,
              height: 3,
              background: "#6f89a1",
            }}
          />
          <h1
            style={{
              margin: 0,
              whiteSpace: "pre-line",
              maxWidth: 1280,
              fontSize: 116,
              lineHeight: 1.04,
              letterSpacing: "-0.065em",
              fontWeight: 400,
              color: "#273235",
            }}
          >
            {displayTitle}
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <p
            style={{
              margin: 0,
              maxWidth: 860,
              fontSize: 38,
              lineHeight: 1.26,
              color: "#627178",
              letterSpacing: "-0.018em",
            }}
          >
            Natural-looking aesthetic care, regenerative wellness, and medical ear piercing.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#6f89a1",
              color: "#ffffff",
              borderRadius: 999,
              padding: "23px 40px",
              fontSize: 32,
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            {PHONE_NUMBER}
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
