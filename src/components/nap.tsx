"use client";

import DirectionsButton from "components/directions-button";
import { CARD_TITLE, ROW, ROWS, SPLIT, SPLIT_MEDIA, SPLIT_TEXT } from "components/layout";
import OpenStreetMapEmbed from "components/open-street-map-embed";
import TrackedPhoneLink from "components/tracked-phone-link";
import { cn } from "lib/utils";

type NAPProps = {
  name: string;
  addressLines: string[];
  phone: string; // E164 or formatted; we will normalize tel link
  hours?: string[];
  showMap?: boolean;
  mapsQuery?: string; // fallback to addressLines.join(', ')
  latitude?: number;
  longitude?: number;
};

function toTel(phone: string) {
  return phone.replace(/[^0-9+]/g, "");
}

// Clinic name, address, phone and hours beside the map, on the shared Split (text 5 / map 7 columns).
export default function NAP({ name, addressLines, phone, hours = [], showMap = false, mapsQuery, latitude, longitude }: NAPProps) {
  const address = addressLines.join(", ");
  const directionsAddress = mapsQuery || address;
  const hasCoords = typeof latitude === "number" && typeof longitude === "number";
  const map = showMap && hasCoords;

  const details = (
    <div>
      <h3 className={CARD_TITLE}>{name}</h3>
      <address className="mt-3 not-italic text-lg leading-relaxed text-base-content/80">
        {addressLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </address>
      <div className="mt-2">
        <TrackedPhoneLink className="link link-primary text-lg" href={`tel:${toTel(phone)}`} location="location_nap">
          {phone}
        </TrackedPhoneLink>
      </div>
      {hours.length > 0 && (
        <div className="mt-8">
          <h4 className="text-base font-medium text-base-content">Hours</h4>
          <ul className={cn("mt-3", ROWS)}>
            {hours.map((h) => (
              <li key={h} className={cn(ROW, "py-3 text-base text-base-content/80")}>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8">
        <DirectionsButton address={directionsAddress} latitude={latitude} longitude={longitude} variant="outline">
          Get Directions
        </DirectionsButton>
      </div>
    </div>
  );

  if (!map) return details;

  return (
    <div className={cn(SPLIT, "items-start")}>
      <div className={cn("min-w-0", SPLIT_TEXT.wide)}>{details}</div>
      <div className={cn("min-w-0", SPLIT_MEDIA.wide)}>
        <OpenStreetMapEmbed title={`${name} map`} latitude={latitude} longitude={longitude} className="h-72 md:h-96" />
      </div>
    </div>
  );
}
