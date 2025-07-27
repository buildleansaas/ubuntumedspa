import { ImageResponse } from "next/server";
import { classNames } from "lib/tailwind";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, ORIGIN } from "lib/seo";
import Image from "next/image";

// Download fonts from CDN on the Edge
const InterRegular = fetch("https://fonts.cdnfonts.com/s/19795/Inter-Regular.woff").then((response) =>
  response.arrayBuffer()
);

const InterBold = fetch("https://fonts.cdnfonts.com/s/19795/Inter-Bold.woff").then((response) =>
  response.arrayBuffer()
);

type OpenGraphImageProperties = {
  title?: string;
  description?: string;
  color?: any;
};

export async function createTwitterImage({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  color = classNames.filter(({ id }) => id === "blue")[0].color,
}: OpenGraphImageProperties) {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, ${color[200]}, white)`,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundImage: "linear-gradient(to top right, #ffffffff, #ffffff00 50%)",
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div
          style={{
            backgroundImage: "linear-gradient(to top left, #ffffffff, #ffffff00 50%)",
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div
          style={{
            color: color[700],
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            marginLeft: -16,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ORIGIN}/logo.png`} width={48} height={48} alt="zen circle drawing" />
          williamsburgmedspa.com
        </div>
        <h1
          style={{
            fontSize: 500 / title.length + 50,
            letterSpacing: "-0.025em",
            color: color[800],
            fontWeight: "bold",
            margin: 64,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            marginTop: -32,
            fontSize: 32,
            lineHeight: 1.5,
            maxWidth: 1000,
          }}
        >
          {description}
        </p>
      </div>
    ),
    {
      width: 1600,
      height: 900,
      fonts: [
        {
          name: "Inter",
          data: await InterRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: await InterBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
