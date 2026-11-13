import Image from "next/image";
import Link from "next/link";

import { getEventBySlug } from "lib/events";

export default function BotoxPartyCallout() {
  const botoxPartyEvent = getEventBySlug("botox-party");
  if (!botoxPartyEvent) return null;

  return (
    <section className="w-full scroll-mt-28 py-16 md:py-24" aria-labelledby="botox-party-callout-heading">
      <article className="grid items-center gap-8 lg:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)] lg:gap-16">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-base-200">
          <Image
            src={botoxPartyEvent.thumbnailImageSrc || botoxPartyEvent.heroImageSrc}
            alt={botoxPartyEvent.thumbnailImageAlt || botoxPartyEvent.heroImageAlt}
            fill
            sizes="(max-width: 1024px) 90vw, 320px"
            className="object-cover"
          />
        </div>

        <div className="max-w-2xl">
          <p className="text-sm text-base-content/65">Wrinkle Relaxer Party</p>

          <h2
            id="botox-party-callout-heading"
            className="font-display mt-3 max-w-xl text-2xl leading-[1.2] tracking-tight text-base-content text-balance md:text-[1.9rem]"
          >
            Host a wrinkle relaxer party and make your own treatment free.
          </h2>

          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/75">
            We use Xeomin®, a Botox® alternative. Bring 5 or more paid Xeomin guests and the host&apos;s own Xeomin
            treatment is free. Every additional 5 paid Xeomin guests unlocks more free products and procedure credits.
          </p>

          <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-base-content/65">
            Tell us the guest count, the planning window, and what else your group may want to discuss. We&apos;ll
            help you map the event and set up a quick planning call so the party feels organized from the start.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={botoxPartyEvent.canonicalPath} className="rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary">
              Plan a Wrinkle Relaxer Party
            </Link>
            <Link href="/procedures/xeomin" className="rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary">
              See Xeomin Details
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
