"use client";

import { useEffect, useState } from "react";

type DirectionsButtonProps = {
  address: string;
  latitude?: number;
  longitude?: number;
  className?: string;
  children?: React.ReactNode;
};

export default function DirectionsButton({ address, latitude, longitude, className = "btn btn-secondary", children = "Get Directions" }: DirectionsButtonProps) {
  const [href, setHref] = useState<string>("");

  useEffect(() => {
    try {
      const ua = navigator.userAgent || "";
      const isIOS = /iP(hone|ad|od)/i.test(ua);
      const isSafari = /Safari\//.test(ua) && !/(Chrome|Chromium|CriOS|Edg|OPR)\//.test(ua);
      const useApple = isIOS || isSafari;

      const hasCoords = typeof latitude === "number" && typeof longitude === "number";
      if (useApple) {
        const dest = hasCoords ? `${latitude},${longitude}` : address;
        setHref(`https://maps.apple.com/?daddr=${encodeURIComponent(dest)}`);
      } else {
        const dest = hasCoords ? `${latitude},${longitude}` : encodeURIComponent(address);
        setHref(`https://www.google.com/maps/dir/?api=1&destination=${dest}`);
      }
    } catch {
      setHref(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`);
    }
  }, [address, latitude, longitude]);

  return (
    <a className={className} href={href || "#"} target={href ? "_blank" : undefined} rel={href ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  );
}

