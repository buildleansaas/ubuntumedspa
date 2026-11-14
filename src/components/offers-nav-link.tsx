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
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-base-content transition-colors hover:bg-base-200"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinejoin="round" d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" />
          <circle cx="8" cy="8" r="1.5" />
        </svg>
        <span
          aria-hidden="true"
          data-offers-count
          className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-content"
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
      className="mx-3 inline-flex items-center gap-1.5 rounded-sm py-1 text-[0.95rem] text-base-content/85 transition-colors hover:text-base-content"
    >
      Offers
      <span
        aria-hidden="true"
        data-offers-count
        className="align-super text-[0.7rem] text-accent"
      >
        {count}
      </span>
    </Link>
  );
}
