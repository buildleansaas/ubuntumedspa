import Link from "next/link";

import BeforeAfterShowcase from "components/before-after-showcase";
import {
  CARPAL_TUNNEL_CAPTION,
  CARPAL_TUNNEL_PHOTO,
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
  PICCIRILLO_CAPTION,
  PICCIRILLO_PHOTO,
  PRP_TUBE_CAPTION,
  PRP_TUBE_PHOTO,
  RESULTS_CAPTION,
  RUNELS_CAPTION,
  RUNELS_PHOTO,
  SUPPLIES_CAPTION,
  SUPPLIES_PHOTO,
  TREATMENT_ROOM_HEADING,
  TREATMENT_ROOM_PHOTOS,
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

/** A photo with its caption laid over the bottom edge. */
function Tile({ photo, caption, aspect = "aspect-[4/5]", badge }: { photo: ClinicPhoto; caption: string; aspect?: string; badge?: string }) {
  return (
    <figure className={`relative ${aspect} overflow-hidden rounded-2xl bg-base-200`}>
      <Photo photo={photo} />
      {badge && (
        <span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-base-100/95 text-xs font-semibold text-base-content shadow-sm">
          {badge}
        </span>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral/80 via-neutral/30 to-transparent px-4 pb-3 pt-12 text-sm leading-snug text-white">
        {caption}
      </figcaption>
    </figure>
  );
}

// Tidewater: the eyebrow label is shown only where `showEyebrow` is set (the homepage), as a quiet sentence-case note.
function SectionHeader({
  id,
  eyebrow,
  heading,
  intro,
  showEyebrow = false,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  showEyebrow?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      {showEyebrow && <p className="text-sm text-base-content/65">{eyebrow}</p>}
      <h2 id={id} className={`font-display ${showEyebrow ? "mt-3" : ""} text-3xl leading-tight tracking-tight text-base-content md:text-[2.4rem]`}>
        {heading}
      </h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-base-content/75 md:text-lg">{intro}</p>}
    </div>
  );
}

/** Crow's feet results: copy on the left, one large before/after with a result switcher on the right. */
export function CrowsFeetResults() {
  return (
    <section className="scroll-mt-28 py-12 text-left md:py-16" aria-labelledby="crows-feet-results" data-clinic-photos="crows-feet">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeader id="crows-feet-results" eyebrow="Real patient photos" heading={CROWS_FEET_HEADING} intro={CROWS_FEET_INTRO} />
          <p className="mt-6 max-w-md text-sm leading-relaxed text-base-content/65" data-results-caption>
            {RESULTS_CAPTION}
          </p>
          <p className="mt-2 text-sm text-base-content/65">{CROWS_FEET_PAIRS.length} results shown.</p>
        </div>
        <BeforeAfterShowcase />
      </div>
    </section>
  );
}

/** The underarm process: equal photos with numbered badges and captions on the image. */
export function HyperhidrosisSteps() {
  return (
    <section className="scroll-mt-28 py-12 text-left md:py-16" aria-labelledby="hyperhidrosis-steps" data-clinic-photos="hyperhidrosis">
      <SectionHeader id="hyperhidrosis-steps" eyebrow="Real clinic photos" heading={HYPERHIDROSIS_STEPS_HEADING} />
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HYPERHIDROSIS_STEPS.map((step, index) => (
          <li key={step.title}>
            <Tile photo={step.photo} caption={`${step.title}: ${step.caption}`} badge={String(index + 1)} />
          </li>
        ))}
        <li>
          <Tile photo={JENNY_TREATING_UNDERARM} caption={JENNY_TREATING_UNDERARM_CAPTION} />
        </li>
      </ol>
      <p className="mt-4 text-sm text-base-content/65">{HYPERHIDROSIS_STEPS_NOTE}</p>
    </section>
  );
}

// `exclude` drops the photo already shown as the page hero, so it doesn't repeat right under it.
export function EarPiercingPhotos({ exclude }: { exclude?: string }) {
  return (
    <section className="scroll-mt-28 py-12 text-left md:py-16" aria-labelledby="ear-piercing-photos" data-clinic-photos="ear-piercing">
      <SectionHeader id="ear-piercing-photos" eyebrow="Real photos from Jenny's patients" heading={EAR_PIERCING_PHOTOS_HEADING} />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {EAR_PIERCING_PHOTOS.filter(({ photo }) => photo.src !== exclude).map(({ photo, caption }) => (
          <Tile key={photo.src} photo={photo} caption={caption} />
        ))}
      </div>
    </section>
  );
}

const TRAINERS = [
  { key: "runels", photo: RUNELS_PHOTO, name: "Dr. Charles Runels", caption: RUNELS_CAPTION },
  { key: "piccirillo", photo: PICCIRILLO_PHOTO, name: "Dr. Jeff Piccirillo", caption: PICCIRILLO_CAPTION },
] as const;
type TrainerKey = (typeof TRAINERS)[number]["key"];

/** A slim "Trained by" credential row: round photo, name, one line. */
export function TrainedBy({ trainers = ["runels", "piccirillo"] }: { trainers?: TrainerKey[] }) {
  const shown = TRAINERS.filter((trainer) => trainers.includes(trainer.key));
  return (
    <section className="py-8 text-left" aria-label="Jenny's training" data-clinic-photos="trained-by">
      <p className="text-sm text-base-content/65">Trained by</p>
      <ul className={`mt-4 grid gap-4 ${shown.length > 1 ? "md:grid-cols-2" : "max-w-xl"}`}>
        {shown.map((trainer) => (
          <li key={trainer.key} className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-3 pr-5" data-clinic-photos={trainer.key}>
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full">
              <Photo photo={trainer.photo} className="object-[50%_20%]" />
            </div>
            <div>
              <p className="font-medium text-base-content">{trainer.name}</p>
              <p className="mt-1 text-sm leading-snug text-base-content/75">{trainer.caption}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Single-trainer rows for the OH-Shot and joint pages. */
export function RunelsTraining() {
  return <TrainedBy trainers={["runels"]} />;
}

export function PiccirilloTraining() {
  return <TrainedBy trainers={["piccirillo"]} />;
}

/** A photo with its caption underneath (no overlay). */
function CaptionedPhoto({ photo, caption, aspect = "aspect-[3/4]", className = "" }: { photo: ClinicPhoto; caption: string; aspect?: string; className?: string }) {
  return (
    <figure className={className}>
      <div className={`${aspect} overflow-hidden rounded-lg bg-base-200`}>
        <Photo photo={photo} />
      </div>
      <figcaption className="mt-3 text-sm leading-snug text-base-content/65">{caption}</figcaption>
    </figure>
  );
}

/** Homepage: one crow's feet pair and the triplets, editorial and quiet (Tidewater). */
export function HomeRealPhotos() {
  const pair = CROWS_FEET_PAIRS[0];
  const triplets = EAR_PIERCING_PHOTOS[0];
  return (
    <section className="w-full scroll-mt-28 py-16 md:py-24" aria-labelledby="home-real-photos" data-clinic-photos="home">
      <SectionHeader
        id="home-real-photos"
        eyebrow="Real photos from Jenny's patients"
        heading="Real patients, real results"
        intro="Xeomin for crow's feet, before and after."
        showEyebrow
      />
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <div className="grid grid-cols-2 gap-4 md:gap-6" data-active-pair={pair.id}>
            <CaptionedPhoto photo={pair.before} caption={BEFORE_LABEL} />
            <CaptionedPhoto photo={pair.after} caption={pair.afterLabel} />
          </div>
          <p className="mt-6 max-w-[60ch] text-sm leading-relaxed text-base-content/65">{RESULTS_CAPTION}</p>
          <p className="mt-4">
            <Link
              href="/procedures/xeomin"
              className="rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary"
            >
              More results
            </Link>
          </p>
        </div>
        <div>
          <CaptionedPhoto photo={triplets.photo} caption={triplets.caption} aspect="aspect-[4/5]" />
          <p className="mt-4">
            <Link
              href="/procedures/blomdahl-ear-piercing"
              className="rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary"
            >
              Ear piercing details
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/** PRP pages: the spun tube and the supplies, same height. */
export function PrpTubePhoto() {
  return (
    <section className="py-12 text-left md:py-16" aria-label="What PRP looks like" data-clinic-photos="prp-tube">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
        <Tile photo={PRP_TUBE_PHOTO} caption={PRP_TUBE_CAPTION} aspect="aspect-[4/5] sm:aspect-auto sm:h-80" />
        <Tile photo={SUPPLIES_PHOTO} caption={SUPPLIES_CAPTION} aspect="aspect-[4/3] sm:aspect-auto sm:h-80" />
      </div>
    </section>
  );
}

/** PRP joint page: Jenny injecting for carpal tunnel, with her orthopedic PRP trainer. */
export function JointPhotos() {
  return (
    <div className="grid gap-6 text-left lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center" data-clinic-photos="joint">
      <Tile photo={CARPAL_TUNNEL_PHOTO} caption={CARPAL_TUNNEL_CAPTION} />
      <PiccirilloTraining />
    </div>
  );
}

export function TreatmentRoomPhotos() {
  return (
    <section className="py-8 text-left" aria-labelledby="treatment-room" data-clinic-photos="treatment-room">
      <SectionHeader id="treatment-room" eyebrow="Real photos" heading={TREATMENT_ROOM_HEADING} />
      <div className="mt-6 grid grid-cols-2 gap-4">
        {TREATMENT_ROOM_PHOTOS.map((image) => (
          <figure key={image.src} className="aspect-[4/5] overflow-hidden rounded-2xl bg-base-200">
            <Photo photo={image} />
          </figure>
        ))}
      </div>
    </section>
  );
}
