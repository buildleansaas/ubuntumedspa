import Image from "next/image";
import Link from "next/link";

import { Button } from "components/ui/button";

export default function AffiliateProgramCallout() {
  return (
    <section className="mb-14 py-6 md:mb-20 md:py-8 lg:py-10" aria-labelledby="affiliate-program-callout-heading">
      <div className="mx-auto max-w-5xl">
        <article className="group relative isolate flex flex-col gap-8 md:flex-row-reverse md:items-center md:justify-between lg:gap-12">
          <div className="max-w-2xl flex-1">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Affiliate Program</p>

            <h2
              id="affiliate-program-callout-heading"
              className="mt-3 max-w-2xl text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content text-balance"
            >
              Refer Williamsburg Med Spa and <span className="font-semibold">earn 20%</span>.
            </h2>

            <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-base-content/80">
              For people who already know the right friends, followers, or local contacts to send Jenny&apos;s way.
              Learn what to say, which procedures and products are easiest to recommend, and how to introduce
              Williamsburg Med Spa with confidence.
            </p>

            <p className="mt-5 max-w-2xl text-sm md:text-base leading-relaxed text-base-content/70">
              Imagine referring just 2 or 3 friends a month and turning a few trusted introductions into an extra
              $500 or more. On stronger months, a handful of higher-ticket referrals can climb toward $2,500+. We
              provide the guide, the copy-ready text, and the link. You just send people to the site.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/affiliates">Learn More</Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-[18rem] overflow-hidden rounded-2xl bg-base-200 sm:max-w-[20rem] md:w-[17rem] lg:w-[19rem] md:shrink-0">
            <Image
              src="/jenny.jpg"
              alt="Jenny Coleman for the Williamsburg Med Spa affiliate program"
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 272px, 304px"
              className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          </div>
        </article>
      </div>
    </section>
  );
}
