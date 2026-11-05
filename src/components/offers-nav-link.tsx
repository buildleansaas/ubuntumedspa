"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { OFFERS, OFFERS_PATH, getActiveOffers } from "config/offers";

/**
 * Highlighted "Offers" link with a count badge. The server renders the count from build time; the browser recounts on load so
 * an expired offer never shows in a cached header. Hidden when nothing is running.
 */
export default function OffersNavLink({ variant = "desktop" }: { variant?: "desktop" | "compact" }) {
  const [count, setCount] = useState(() => getActiveOffers().length);

  useEffect(() => {
    setCount(getActiveOffers().length);
  }, []);

  if (count === 0 || OFFERS.length === 0) return null;

  const label = `${count} current ${count === 1 ? "offer" : "offers"}`;
  return (
    <Link
      href={OFFERS_PATH}
      aria-label={`Offers: ${label}`}
      data-offers-nav
      className={
        variant === "desktop"
          ? "mx-2.5 inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm font-medium tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          : "inline-flex h-11 items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
      }
    >
      Offers
      <span
        aria-hidden="true"
        data-offers-count
        className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-content"
      >
        {count}
      </span>
    </Link>
  );
}
