"use client";

import { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import type { ButtonProps } from "components/ui/button";

type DirectionsButtonProps = {
  address: string;
  latitude?: number;
  longitude?: number;
  className?: string;
  children?: React.ReactNode;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

export default function DirectionsButton({
  address,
  latitude,
  longitude,
  className,
  children = "Get Directions",
  variant = "default",
  size = "default",
}: DirectionsButtonProps) {
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
    <Button asChild className={className} variant={variant} size={size}>
      <a href={href || "#"} target={href ? "_blank" : undefined} rel={href ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    </Button>
  );
}
