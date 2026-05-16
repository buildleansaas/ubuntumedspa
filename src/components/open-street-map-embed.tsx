"use client";

type OpenStreetMapEmbedProps = {
  title: string;
  latitude: number;
  longitude: number;
  originLatitude?: number;
  originLongitude?: number;
  className?: string;
  zoomPadding?: number;
};

function getBbox({
  latitude,
  longitude,
  originLatitude,
  originLongitude,
  zoomPadding = 0.005,
}: Pick<
  OpenStreetMapEmbedProps,
  "latitude" | "longitude" | "originLatitude" | "originLongitude" | "zoomPadding"
>) {
  const latitudes = [latitude, originLatitude].filter((value): value is number => typeof value === "number");
  const longitudes = [longitude, originLongitude].filter((value): value is number => typeof value === "number");

  return [
    Math.min(...longitudes) - zoomPadding,
    Math.min(...latitudes) - zoomPadding,
    Math.max(...longitudes) + zoomPadding,
    Math.max(...latitudes) + zoomPadding,
  ].join(",");
}

export default function OpenStreetMapEmbed({
  title,
  latitude,
  longitude,
  originLatitude,
  originLongitude,
  className = "h-64",
  zoomPadding,
}: OpenStreetMapEmbedProps) {
  const bbox = getBbox({ latitude, longitude, originLatitude, originLongitude, zoomPadding });
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className="space-y-2">
      <div className={`relative w-full overflow-hidden rounded-xl border border-base-300 bg-base-200 ${className}`}>
        <iframe
          title={title}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
        />
      </div>
      <p className="text-xs text-base-content/60">
        Map data ©{" "}
        <a
          className="underline underline-offset-2 hover:text-primary"
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenStreetMap contributors
        </a>
        .
      </p>
    </div>
  );
}
