"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { OFFERS_PATH, getActiveOffers } from "config/offers";

/**
 * Highlighted "Offers" link with a count badge. `initialCount` comes from the server render (build time on static pages), so the
 * first client render matches the HTML; the browser then recounts, so a page built before an offer ended hides the link on load.
 * Hidden when nothing is running.
 */
export default function OffersNavLink({
  initialCount,
  variant = "desktop",
}: {
  initialCount: number;
  variant?: "desktop" | "compact";
}) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(getActiveOffers().length);
  }, []);

  if (count === 0) return null;

  const label = `${count} current ${count === 1 ? "offer" : "offers"}`;
  if (variant === "compact") {
    // Phones: a small tag icon with the count, so the brand name keeps its room.
    return (
      <Link
        href={OFFERS_PATH}
        aria-label={`Offers: ${label}`}
        data-offers-nav
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinejoin="round" d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" />
          <circle cx="8" cy="8" r="1.5" />
        </svg>
        <span
          aria-hidden="true"
          data-offers-count
          className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-content"
        >
          {count}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={OFFERS_PATH}
      aria-label={`Offers: ${label}`}
      data-offers-nav
      className="mx-2.5 inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm font-medium tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
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
