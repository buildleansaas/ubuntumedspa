"use client";

import { useState } from "react";

import { BEFORE_LABEL, CROWS_FEET_PAIRS, type ClinicPhoto } from "config/clinic-photos";

function Half({ photo, label }: { photo: ClinicPhoto; label: string }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden">
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white">
        {label}
      </span>
    </div>
  );
}

/** One large before/after at a time, with a patient switcher. Both halves share one frame so they read as a single comparison. */
export default function BeforeAfterShowcase() {
  const [active, setActive] = useState(0);
  const pair = CROWS_FEET_PAIRS[active];

  return (
    <div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-base-300 shadow-sm" data-active-pair={pair.id}>
        <Half photo={pair.before} label={BEFORE_LABEL} />
        <Half photo={pair.after} label={pair.afterLabel} />
      </div>
      {CROWS_FEET_PAIRS.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Choose a patient">
          {CROWS_FEET_PAIRS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                index === active
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300 bg-base-100 text-base-content/75 hover:border-primary hover:text-primary"
              }`}
            >
              Result {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
