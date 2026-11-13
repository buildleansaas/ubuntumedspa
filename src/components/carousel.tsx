"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * A small accessible carousel (no library). Every slide stays in the server HTML; the track is a native
 * scroll-snap row, so swipe works on phones. Arrows, dots and the Left/Right keys move one slide.
 * No autoplay. Smooth scrolling is off under prefers-reduced-motion. Slides that are not showing are `inert`,
 * so keyboard focus never lands on a hidden link.
 */
export default function Carousel({
  label,
  children,
  className = "",
  slideLabel = "Slide",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  /** Word used in the dot and slide labels, e.g. "Result" gives "Result 2 of 3". */
  slideLabel?: string;
}) {
  const slides = React.Children.toArray(children);
  const count = slides.length;
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const go = useCallback(
    (index: number) => {
      const el = track.current;
      if (!el || !count) return;
      const next = (index + count) % count;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
      setActive(next);
    },
    [count]
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const arrow =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content/75 transition-colors hover:border-base-content/30 hover:text-base-content";

  return (
    <section
      className={`w-full min-w-0 max-w-full [contain:inline-size] ${className}`}
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(active + 1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(active - 1);
        }
      }}
    >
      <div
        ref={track}
        className="flex w-full snap-x snap-mandatory items-stretch overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-live="polite"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideLabel} ${index + 1} of ${count}`}
            className="w-full shrink-0 snap-start snap-always"
            {...(index === active ? {} : { inert: true, "aria-hidden": true })}
          >
            {slide}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="group" aria-label={`Choose a ${slideLabel.toLowerCase()}`}>
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => go(index)}
                aria-label={`${slideLabel} ${index + 1} of ${count}`}
                aria-current={index === active ? "true" : undefined}
                className="group inline-flex h-6 w-6 items-center justify-center rounded-full"
              >
                <span
                  className={`block h-2 rounded-full transition-all ${
                    index === active ? "w-5 bg-base-content/70" : "w-2 bg-base-content/25 group-hover:bg-base-content/45"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className={arrow} onClick={() => go(active - 1)} aria-label={`Previous ${slideLabel.toLowerCase()}`}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" className={arrow} onClick={() => go(active + 1)} aria-label={`Next ${slideLabel.toLowerCase()}`}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
