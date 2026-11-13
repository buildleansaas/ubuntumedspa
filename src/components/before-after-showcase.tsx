"use client";

import { useState } from "react";

import { BEFORE_LABEL, CROWS_FEET_PAIRS, type ClinicPhoto } from "config/clinic-photos";

function Half({ photo, label }: { photo: ClinicPhoto; label: string }) {
  return (
    <figure>
    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-base-200">
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      </div>
      <figcaption className="mt-3 text-sm text-base-content/65">{label}</figcaption>
    </figure>
  );
}

/** One large before/after at a time, with a patient switcher. Both halves share one frame so they read as a single comparison. */
export default function BeforeAfterShowcase() {
  const [active, setActive] = useState(0);
  const pair = CROWS_FEET_PAIRS[active];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:gap-6" data-active-pair={pair.id}>
        <Half photo={pair.before} label={BEFORE_LABEL} />
        <Half photo={pair.after} label={pair.afterLabel} />
      </div>
      {CROWS_FEET_PAIRS.length > 1 && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2" role="tablist" aria-label="Choose a patient">
          {CROWS_FEET_PAIRS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={`rounded-sm text-sm underline-offset-[6px] transition-colors ${
                index === active
                  ? "text-base-content underline decoration-base-content/40"
                  : "text-secondary hover:text-base-content"
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
