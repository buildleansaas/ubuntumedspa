import Image from "next/image";
import Link from "next/link";

import { Button } from "components/ui/button";
import { getEventBySlug } from "lib/events";

export default function BotoxPartyCallout() {
  const botoxPartyEvent = getEventBySlug("botox-party");
  if (!botoxPartyEvent) return null;

  return (
    <section className="mb-14 py-6 md:mb-20 md:py-8 lg:py-10" aria-labelledby="botox-party-callout-heading">
      <div className="mx-auto max-w-5xl">
        <article className="group relative isolate flex flex-col gap-8 md:flex-row md:items-center md:justify-between lg:gap-12">
          <div className="max-w-2xl flex-1">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Botox Party</p>

            <h2
              id="botox-party-callout-heading"
              className="mt-3 max-w-2xl text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content text-balance"
            >
              Host a <span className="font-semibold">Botox party</span> and make your own treatment free.
            </h2>

            <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-base-content/80">
              Bring 5 or more paid Botox guests and the host&apos;s Botox is free. Every additional 5 paid Botox
              guests unlocks more free products and procedure credits.
            </p>

            <p className="mt-5 max-w-2xl text-sm md:text-base leading-relaxed text-base-content/70">
              Tell us the guest count, the planning window, and what else your group may want to discuss. We&apos;ll
              help you map the event and set up a quick planning call so the party feels organized from the start.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={botoxPartyEvent.canonicalPath}>Plan a Botox Party</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/procedures/botox">See Botox Details</Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-[18rem] overflow-hidden rounded-2xl bg-base-200 sm:max-w-[20rem] md:w-[17rem] lg:w-[19rem] md:shrink-0">
            <Image
              src={botoxPartyEvent.thumbnailImageSrc || botoxPartyEvent.heroImageSrc}
              alt={botoxPartyEvent.thumbnailImageAlt || botoxPartyEvent.heroImageAlt}
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
