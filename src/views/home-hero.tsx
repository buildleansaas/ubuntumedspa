import Image from "next/image";
import Link from "next/link";

export const HOME_BOOK_HREF = "/consult";

export const HOME_HERO_SENTENCE =
  "Xeomin, PRP, sweating treatment and medical ear piercing with Jenny Brady, the same nurse practitioner at every visit.";

export const HOME_HERO_FACTS = [
  "Jenny Brady, MSN, RN, CPNP, PMHS",
  "Xeomin only",
  "3900 Powhatan Parkway",
  "Cash prices, written out",
] as const;

// Tidewater hero: the one H1, one sentence, one price line, one filled button. Prices come in as props from the
// catalog (page.tsx), never typed here.
export default function HomeHero({ xeominCash, piercingCash }: { xeominCash: string; piercingCash: string }) {
  return (
    <section className="w-full pb-16 pt-6 md:pb-24 md:pt-12" aria-labelledby="home-hero-heading">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(16rem,23rem)] lg:gap-20">
        <div className="max-w-2xl">
          <h1
            id="home-hero-heading"
            className="font-display text-[2.4rem] leading-[1.08] tracking-tight text-base-content sm:text-5xl lg:text-[3.6rem]"
          >
            Nurse Practitioner Led Medical Spa in Williamsburg, VA
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-base-content/80 md:text-xl">{HOME_HERO_SENTENCE}</p>
          <p className="mt-5 text-[0.95rem] text-base-content/70" data-hero-prices>
            Xeomin from {xeominCash} cash <span aria-hidden="true" className="mx-1.5 hidden text-base-content/35 sm:inline">·</span>
            <span className="block sm:inline">
              Ear piercing {piercingCash} per ear, cash
            </span>
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href={HOME_BOOK_HREF}
              className="inline-flex h-12 items-center rounded-full bg-primary px-7 text-[0.95rem] font-medium text-primary-content transition-colors hover:bg-primary/90"
            >
              Book a visit
            </Link>
            <Link
              href="/prices"
              className="rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary"
            >
              See prices
            </Link>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-[17rem] sm:max-w-[19rem] lg:mx-0 lg:max-w-none lg:justify-self-end">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] bg-base-200">
            <Image
              src="/jenny.jpg"
              alt="Jenny Brady, the nurse practitioner at Williamsburg Med Spa"
              fill
              priority
              sizes="(max-width: 640px) 272px, (max-width: 1024px) 304px, 368px"
              className="object-cover object-[center_18%]"
            />
          </div>
        </figure>
      </div>

      <ul
        className="mt-14 flex flex-wrap gap-x-3 gap-y-2 border-t border-base-300 pt-6 text-sm text-base-content/70 md:mt-20"
        aria-label="At a glance"
      >
        {HOME_HERO_FACTS.map((fact) => (
          <li
            key={fact}
            className="after:ml-3 after:text-base-content/30 after:content-['·'] last:after:content-none"
          >
            {fact}
          </li>
        ))}
      </ul>
    </section>
  );
}
