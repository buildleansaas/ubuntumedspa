import Link from "next/link";

import { CARD_FLUSH, CARD_LINK, CARD_TITLE } from "components/layout";
import PeninsulaRouteMap from "components/peninsula-route-map";
import DirectionsLinks from "components/directions-links";
import type { SatelliteRoute } from "lib/service-satellites";
import { cn } from "lib/utils";

const sentenceCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * A hub-page card for a Peninsula area page: the route map, the card's own title and description, the drive time and
 * route steps (from lib/service-satellites.ts), and a Google Maps button. The title is the card's link (stretched over
 * the whole card); the directions button is a separate link above it, so no link sits inside another.
 */
export default function RouteCard({
  href,
  label,
  description,
  route,
}: {
  href: string;
  label: string;
  description: string;
  route: SatelliteRoute;
}) {
  return (
    <article className={cn("group relative", CARD_FLUSH, CARD_LINK)}>
      <div className="border-b border-base-300">
        <PeninsulaRouteMap route={route.map} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Link
          href={href}
          className="rounded-sm after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary/40"
        >
          <span className={`block ${CARD_TITLE} group-hover:text-primary`}>{label}</span>
        </Link>
        <span className="mt-2 block text-sm leading-relaxed text-base-content/80">{description}</span>

        <p className="mt-5 text-sm text-base-content/80">
          <span className="font-semibold text-base-content">Drive time:</span> {sentenceCase(route.driveTime)}
        </p>
        <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-base-content/80">
          {route.steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[0.7rem] font-bold text-accent-content"
              >
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-auto pt-6">
          <p className="mb-2 text-xs font-medium text-base-content/70">Directions</p>
          <DirectionsLinks googleHref={route.directionsHref} appleHref={route.appleDirectionsHref} />
        </div>
      </div>
    </article>
  );
}
