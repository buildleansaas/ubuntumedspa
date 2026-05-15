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
    <section className="mb-10 md:mb-14">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.95fr_1.05fr] md:gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-light mb-3">Directions from {area.name}</h2>
          <p className="text-base md:text-lg text-base-content/80 mb-4">
            Use {area.routeOrigin.label} as a practical starting point for planning the trip to {clinic.label}.{" "}
            {area.routeSummary}
          </p>
          <ul className="space-y-2 text-sm md:text-base text-base-content/75">
            {area.routeHighlights.map((highlight) => (
              <li key={highlight} className="rounded-xl border border-base-300 bg-base-100 px-4 py-3">
                {highlight}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a href={osmHref} target="_blank" rel="noopener noreferrer">
                Open OSM Directions
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href={googleHref} target="_blank" rel="noopener noreferrer">
                Open Google Directions
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={consultHref}>Request Visit</a>
            </Button>
          </div>
        </div>

        <OpenStreetMapEmbed
          title={`Map from ${area.name} to Williamsburg Med Spa`}
          latitude={clinic.latitude}
          longitude={clinic.longitude}
          originLatitude={area.routeOrigin.latitude}
          originLongitude={area.routeOrigin.longitude}
          className="h-72 md:h-full min-h-72"
          zoomPadding={0.035}
        />
      </div>
    </section>
  );
}
