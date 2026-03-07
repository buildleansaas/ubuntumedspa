"use client";

import Link from "next/link";
import DirectionsButton from "components/directions-button";

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

export default function NAP({ name, addressLines, phone, hours = [], showMap = false, mapsQuery, latitude, longitude }: NAPProps) {
  const address = addressLines.join(", ");
  const directionsAddress = mapsQuery || address;
  const hasCoords = typeof latitude === "number" && typeof longitude === "number";

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <address className="not-italic text-base-content/80">
          {addressLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </address>
        <div className="mt-2">
          <Link className="link link-primary" href={`tel:${toTel(phone)}`}>
            {phone}
          </Link>
        </div>
        <div className="mt-3">
          <DirectionsButton address={directionsAddress} latitude={latitude} longitude={longitude} size="sm">
            Get Directions
          </DirectionsButton>
        </div>
      </div>
      <div>
        {hours.length > 0 && (
          <div>
            <h4 className="text-base font-medium mb-2">Hours</h4>
            <ul className="text-sm text-base-content/80 space-y-1">
              {hours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        {showMap && hasCoords && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-base-300">
            {/* Free OpenStreetMap embed (no API key). Adjust bbox padding for zoom */}
            <iframe
              title="Map"
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
                `${longitude - 0.005},${latitude - 0.005},${longitude + 0.005},${latitude + 0.005}`
              )}&layer=mapnik&marker=${latitude}%2C${longitude}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
