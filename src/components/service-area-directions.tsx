import OpenStreetMapEmbed from "components/open-street-map-embed";
import { Button } from "components/ui/button";
import { buildOpenStreetMapDirectionsUrl } from "lib/open-street-map";
import type { LocalServiceArea } from "lib/local-service-areas";

const clinic = {
  label: "Williamsburg Med Spa",
  address: "3900 Powhatan Parkway, Williamsburg, VA 23188",
  latitude: 37.2707,
  longitude: -76.7075,
};

type ServiceAreaDirectionsProps = {
  area: LocalServiceArea;
  consultHref: string;
};

export default function ServiceAreaDirections({ area, consultHref }: ServiceAreaDirectionsProps) {
  if (!area.routeOrigin) return null;

  const osmHref = buildOpenStreetMapDirectionsUrl({
    originLatitude: area.routeOrigin.latitude,
    originLongitude: area.routeOrigin.longitude,
    destinationLatitude: clinic.latitude,
    destinationLongitude: clinic.longitude,
  });
  const googleHref = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    `${area.routeOrigin.latitude},${area.routeOrigin.longitude}`
  )}&destination=${encodeURIComponent(clinic.address)}`;

  return (
    <section className="mb-8 md:mb-10">
      <div className="grid grid-cols-1 gap-5 rounded-3xl border border-base-300/80 bg-base-100 p-5 shadow-sm md:grid-cols-[0.9fr_1.1fr] md:gap-7 md:p-7">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Directions</p>
          <h2 className="mt-2 text-2xl font-light md:text-3xl">Directions from {area.name}</h2>
          <p className="mt-3 text-base leading-relaxed text-base-content/80 md:text-lg">
            Use {area.routeOrigin.label} as a practical starting point for planning the trip to {clinic.label}. {area.routeSummary}
          </p>
          <ol className="mt-4 space-y-2 text-sm text-base-content/75 md:text-base">
            {area.routeHighlights.map((highlight, index) => (
              <li key={highlight} className="flex gap-3 rounded-2xl border border-base-300/80 bg-base-200/40 px-4 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-base-100 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a href={consultHref}>Request Ear Piercing Visit</a>
            </Button>
            <Button asChild variant="secondary">
              <a href={googleHref} target="_blank" rel="noopener noreferrer">
                Google Directions
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={osmHref} target="_blank" rel="noopener noreferrer">
                OSM Directions
              </a>
            </Button>
          </div>
        </div>

        <OpenStreetMapEmbed
          title={`Map from ${area.name} to Williamsburg Med Spa`}
          latitude={clinic.latitude}
          longitude={clinic.longitude}
          originLatitude={area.routeOrigin.latitude}
          originLongitude={area.routeOrigin.longitude}
          className="h-72 min-h-72 overflow-hidden rounded-2xl border border-base-300/80 md:h-full"
          zoomPadding={0.035}
        />
      </div>
    </section>
  );
}
