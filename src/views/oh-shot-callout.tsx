import Image from "next/image";
import Link from "next/link";

import CmaCredentialStrip from "components/cma-credential-strip";
import LegacyOhShotHash from "components/legacy-oh-shot-hash";
import InstantCheckoutButton from "components/instant-checkout-button";
import { BUTTON_ROW, H2, INTRO, SPLIT, SPLIT_MEDIA, SPLIT_TEXT } from "components/layout";
import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";

export default function OhShotCallout() {
  const ohShot = getCatalogConfigBySlug("oh-shot");
  if (!ohShot) return null;

  return (
    <section id="oh-shot-callout" className="scroll-mt-28 text-left" aria-labelledby="oh-shot-callout-heading">
      <LegacyOhShotHash />
      <article className={`${SPLIT} items-center`}>
        <div className={SPLIT_TEXT.wide}>
          <p className="eyebrow">Featured Women&apos;s Sexual Wellness Treatment</p>

          <h2 id="oh-shot-callout-heading" className={`mt-3 ${H2}`}>
            OH-Shot for comfort, sensation, and intimate confidence.
          </h2>

          <p className={`mt-4 ${INTRO}`}>
            A discreet in-office PRP treatment for women who want greater comfort, improved sensitivity, and more
            confidence with intimacy. If dryness, reduced sensation, mild stress urinary leakage, or
            intimacy-related discomfort have become part of the conversation, the OH-Shot may be a supportive option
            to discuss.
          </p>

          <CmaCredentialStrip className="mt-6 max-w-xl" />

          <p className="mt-6 text-sm leading-relaxed text-base-content/80 md:text-base">
            One treatment: {ohShot.displayPrice}. Pay online now, then text or call Jenny to book your appointment.
          </p>

          <div className={`mt-8 ${BUTTON_ROW}`}>
            <InstantCheckoutButton size="lg" className="w-full sm:w-auto" slug={ohShot.slug} kind={ohShot.kind} quantity={ohShot.minQuantity}>
              Book Now
            </InstantCheckoutButton>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/procedures/oh-shot">Explore OH-Shot Care</Link>
            </Button>
          </div>
        </div>

        <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-base-200 ${SPLIT_MEDIA.wide}`}>
          <Image
            src={ohShot.imagePath || "/procedure/oh-shot/womens-intimate-wellness-lifestyle.webp"}
            alt="Woman enjoying a confident, worry-free lifestyle after intimate wellness care planning"
            fill
            sizes="(max-width: 1024px) 90vw, 683px"
            className="object-cover"
          />
        </div>
      </article>
    </section>
  );
}
