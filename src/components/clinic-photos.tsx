import {
  AFTER_LABEL,
  BEFORE_LABEL,
  CROWS_FEET_HEADING,
  CROWS_FEET_INTRO,
  CROWS_FEET_PAIRS,
  EAR_PIERCING_PHOTOS,
  EAR_PIERCING_PHOTOS_HEADING,
  HYPERHIDROSIS_STEPS,
  HYPERHIDROSIS_STEPS_HEADING,
  HYPERHIDROSIS_STEPS_NOTE,
  JENNY_TREATING_UNDERARM,
  JENNY_TREATING_UNDERARM_CAPTION,
  RESULTS_CAPTION,
  RUNNELS_CAPTION,
  RUNNELS_PHOTO,
  type ClinicPhoto,
} from "config/clinic-photos";

function Photo({ photo, className = "" }: { photo: ClinicPhoto; className?: string }) {
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading="lazy"
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/** Before/after pairs for crow's feet. Side by side (the pairs are not framed identically, so no overlay slider). */
export function CrowsFeetResults({ pairs = 2 }: { pairs?: 1 | 2 }) {
  return (
    <section className="scroll-mt-28 border-t border-base-300 py-14 md:py-20" aria-labelledby="crows-feet-results" data-clinic-photos="crows-feet">
      <p className="eyebrow">Real patient photos</p>
      <h2 id="crows-feet-results" className="font-display mt-3 text-2xl font-medium tracking-tight text-base-content md:text-4xl">
        {CROWS_FEET_HEADING}
      </h2>
      <p className="mt-3 max-w-[65ch] text-base text-base-content/80">{CROWS_FEET_INTRO}</p>
      <div className={`mt-8 grid gap-8 ${pairs === 2 ? "lg:grid-cols-2" : "max-w-2xl"}`}>
        {CROWS_FEET_PAIRS.slice(0, pairs).map((pair) => (
          <figure key={pair.id} className="rounded-2xl border border-base-300 bg-base-100 p-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                [BEFORE_LABEL, pair.before],
                [AFTER_LABEL, pair.after],
              ].map(([label, image]) => (
                <div key={label as string} className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Photo photo={image as ClinicPhoto} />
                  <span className="absolute left-2 top-2 rounded-full bg-base-100/90 px-2.5 py-1 text-xs font-medium text-base-content">
                    {label as string}
                  </span>
                </div>
              ))}
            </div>
          </figure>
        ))}
      </div>
      <p className="mt-4 max-w-[65ch] text-sm text-base-content/70" data-results-caption>
        {RESULTS_CAPTION}
      </p>
    </section>
  );
}

/** The three-step underarm strip, plus the photo of Jenny treating. */
export function HyperhidrosisSteps() {
  return (
    <section className="scroll-mt-28 border-t border-base-300 py-14 md:py-20" aria-labelledby="hyperhidrosis-steps" data-clinic-photos="hyperhidrosis">
      <p className="eyebrow">Real clinic photos</p>
      <h2 id="hyperhidrosis-steps" className="font-display mt-3 text-2xl font-medium tracking-tight text-base-content md:text-4xl">
        {HYPERHIDROSIS_STEPS_HEADING}
      </h2>
      <ol className="mt-8 grid gap-6 sm:grid-cols-3">
        {HYPERHIDROSIS_STEPS.map((step, index) => (
          <li key={step.title}>
            <div className="aspect-[3/4] overflow-hidden rounded-xl border border-base-300">
              <Photo photo={step.photo} />
            </div>
            <p className="mt-3 text-sm font-semibold text-base-content">
              {index + 1}. {step.title}
            </p>
            <p className="mt-1 text-sm text-base-content/80">{step.caption}</p>
          </li>
        ))}
      </ol>
      <figure className="mt-8 max-w-sm">
        <div className="aspect-[3/4] overflow-hidden rounded-xl border border-base-300">
          <Photo photo={JENNY_TREATING_UNDERARM} />
        </div>
        <figcaption className="mt-2 text-sm text-base-content/80">{JENNY_TREATING_UNDERARM_CAPTION}</figcaption>
      </figure>
      <p className="mt-4 text-sm text-base-content/70">{HYPERHIDROSIS_STEPS_NOTE}</p>
    </section>
  );
}

export function EarPiercingPhotos() {
  return (
    <section className="scroll-mt-28 border-t border-base-300 py-14 md:py-20" aria-labelledby="ear-piercing-photos" data-clinic-photos="ear-piercing">
      <p className="eyebrow">Real photos</p>
      <h2 id="ear-piercing-photos" className="font-display mt-3 text-2xl font-medium tracking-tight text-base-content md:text-4xl">
        {EAR_PIERCING_PHOTOS_HEADING}
      </h2>
      <div className="mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
        {EAR_PIERCING_PHOTOS.map(({ photo, caption }) => (
          <figure key={photo.src}>
            <div className="aspect-[3/4] overflow-hidden rounded-xl border border-base-300">
              <Photo photo={photo} />
            </div>
            <figcaption className="mt-2 text-sm text-base-content/80">{caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function RunnelsTraining() {
  return (
    <figure className="mt-10 max-w-sm" data-clinic-photos="runnels">
      <div className="aspect-[3/4] overflow-hidden rounded-xl border border-base-300">
        <Photo photo={RUNNELS_PHOTO} />
      </div>
      <figcaption className="mt-2 text-sm text-base-content/80">{RUNNELS_CAPTION}</figcaption>
    </figure>
  );
}

/** Homepage strip: one crow's feet pair and the triplets photo, each linking to its service. */
export function HomeRealPhotos() {
  const pair = CROWS_FEET_PAIRS[0];
  const triplets = EAR_PIERCING_PHOTOS[0];
  return (
    <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-20" aria-labelledby="home-real-photos" data-clinic-photos="home">
      <p className="eyebrow">Real photos from our clinic</p>
      <h2 id="home-real-photos" className="font-display mt-3 text-3xl font-medium tracking-tight text-base-content md:text-4xl">
        Real patients, real results
      </h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <figure>
          <div className="grid grid-cols-2 gap-2">
            {[
              [BEFORE_LABEL, pair.before],
              [AFTER_LABEL, pair.after],
            ].map(([label, image]) => (
              <div key={label as string} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-base-300">
                <Photo photo={image as ClinicPhoto} />
                <span className="absolute left-2 top-2 rounded-full bg-base-100/90 px-2.5 py-1 text-xs font-medium text-base-content">
                  {label as string}
                </span>
              </div>
            ))}
          </div>
          <figcaption className="mt-2 text-sm text-base-content/80">
            Xeomin for crow&apos;s feet. {RESULTS_CAPTION}{" "}
            <a href="/procedures/xeomin" className="link link-primary">
              Xeomin details
            </a>
          </figcaption>
        </figure>
        <figure>
          <div className="aspect-[3/4] overflow-hidden rounded-xl border border-base-300">
            <Photo photo={triplets.photo} />
          </div>
          <figcaption className="mt-2 text-sm text-base-content/80">
            {triplets.caption}{" "}
            <a href="/procedures/blomdahl-ear-piercing" className="link link-primary">
              Ear piercing details
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
