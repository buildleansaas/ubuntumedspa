"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
  const query = encodeURIComponent(mapsQuery || address);
  const hasCoords = typeof latitude === "number" && typeof longitude === "number";

  const [directionsHref, setDirectionsHref] = useState<string>("");

  useEffect(() => {
    try {
      const ua = navigator.userAgent || "";
      const isIOS = /iP(hone|ad|od)/i.test(ua);
      const isSafari = /Safari\//.test(ua) && !/(Chrome|Chromium|CriOS|Edg|OPR)\//.test(ua);

      const useApple = isIOS || isSafari;

      if (useApple) {
        const dest = hasCoords ? `${latitude},${longitude}` : address;
        setDirectionsHref(`https://maps.apple.com/?daddr=${encodeURIComponent(dest)}`);
      } else {
        const dest = hasCoords ? `${latitude},${longitude}` : query;
        setDirectionsHref(`https://www.google.com/maps/dir/?api=1&destination=${dest}`);
      }
    } catch {
      // Fallback to Google with address
      setDirectionsHref(`https://www.google.com/maps/dir/?api=1&destination=${query}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, query, hasCoords, latitude, longitude]);

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
          <a className="btn btn-sm btn-primary" href={directionsHref} target="_blank" rel="noopener noreferrer">
            Get Directions
          </a>
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
