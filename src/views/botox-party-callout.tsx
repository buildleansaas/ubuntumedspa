import Image from "next/image";
import Link from "next/link";

import { BUTTON_ROW, INTRO, SPLIT, SPLIT_MEDIA, SPLIT_TEXT, Section, SectionHeader } from "components/layout";
import { Button } from "components/ui/button";
import { getEventBySlug } from "lib/events";

export default function BotoxPartyCallout() {
  const botoxPartyEvent = getEventBySlug("botox-party");
  if (!botoxPartyEvent) return null;

  return (
    <Section labelledBy="botox-party-callout-heading">
      <article className={`${SPLIT} items-center`}>
        <div className={SPLIT_TEXT.wide}>
          <SectionHeader
            id="botox-party-callout-heading"
            eyebrow="Wrinkle Relaxer Party"
            title="Host a wrinkle relaxer party and make your own treatment free."
          />

          <p className={`mt-4 ${INTRO}`}>
            We use Xeomin®, a Botox® alternative. Bring 5 or more paid Xeomin guests and the host&apos;s own Xeomin
            treatment is free. Every additional 5 paid Xeomin guests unlocks more free products and procedure credits.
          </p>

          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/75">
            Tell us the guest count, the planning window, and what else your group may want to discuss. We&apos;ll
            help you map the event and set up a quick planning call so the party feels organized from the start.
          </p>

          <div className={`mt-8 ${BUTTON_ROW}`}>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={botoxPartyEvent.canonicalPath}>Plan a Wrinkle Relaxer Party</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/procedures/xeomin">See Xeomin Details</Link>
            </Button>
          </div>
        </div>

        <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-base-200 ${SPLIT_MEDIA.wide}`}>
          <Image
            src={botoxPartyEvent.thumbnailImageSrc || botoxPartyEvent.heroImageSrc}
            alt={botoxPartyEvent.thumbnailImageAlt || botoxPartyEvent.heroImageAlt}
            fill
            sizes="(max-width: 1024px) 90vw, 683px"
            className="object-cover"
          />
        </div>
      </article>
    </Section>
  );
}
