import Image from "next/image";
import Link from "next/link";

import { Button } from "components/ui/button";
import { getEventBySlug } from "lib/events";

export default function BotoxPartyCallout() {
  const botoxPartyEvent = getEventBySlug("botox-party");
  if (!botoxPartyEvent) return null;

  return (
    <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-24" aria-labelledby="botox-party-callout-heading">
      <article className="grid items-center gap-8 lg:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)] lg:gap-14">
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-base-300 bg-base-200">
          <Image
            src={botoxPartyEvent.thumbnailImageSrc || botoxPartyEvent.heroImageSrc}
            alt={botoxPartyEvent.thumbnailImageAlt || botoxPartyEvent.heroImageAlt}
            fill
            sizes="(max-width: 1024px) 90vw, 320px"
            className="object-cover"
          />
        </div>

        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">Botox Party</p>

          <h2
            id="botox-party-callout-heading"
            className="font-display mt-3 max-w-xl text-3xl font-medium leading-[1.15] tracking-tight text-base-content text-balance md:text-4xl"
          >
            Host a Botox party and make your own treatment free.
          </h2>

          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/85 md:text-lg">
            Bring 5 or more paid Botox guests and the host&apos;s Botox is free. Every additional 5 paid Botox
            guests unlocks more free products and procedure credits.
          </p>

          <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-base-content/80 md:text-base">
            Tell us the guest count, the planning window, and what else your group may want to discuss. We&apos;ll
            help you map the event and set up a quick planning call so the party feels organized from the start.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="w-full sm:w-auto">
              <Link href={botoxPartyEvent.canonicalPath}>Plan a Botox Party</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/procedures/botox">See Botox Details</Link>
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}
