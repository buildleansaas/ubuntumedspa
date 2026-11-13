"use client";

import Carousel from "components/carousel";
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

/** Every crow's feet before/after pair as a slideshow: one pair per slide, side by side, captions under each photo. */
export default function BeforeAfterShowcase() {
  return (
    <Carousel label="Crow's feet before and after Xeomin" slideLabel="Result">
      {CROWS_FEET_PAIRS.map((pair) => (
        <div key={pair.id} className="grid grid-cols-2 gap-4 md:gap-6" data-pair={pair.id}>
          <Half photo={pair.before} label={BEFORE_LABEL} />
          <Half photo={pair.after} label={pair.afterLabel} />
        </div>
      ))}
    </Carousel>
  );
}
