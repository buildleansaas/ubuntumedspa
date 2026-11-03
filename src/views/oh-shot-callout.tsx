import Image from "next/image";
import Link from "next/link";

import CmaCredentialStrip from "components/cma-credential-strip";
import LegacyOhShotHash from "components/legacy-oh-shot-hash";
import InstantCheckoutButton from "components/instant-checkout-button";
import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";

export default function OhShotCallout() {
  const ohShot = getCatalogConfigBySlug("oh-shot");
  if (!ohShot) return null;

  return (
    <section
      id="oh-shot-callout"
      className="scroll-mt-28 border border-base-300"
      aria-labelledby="oh-shot-callout-heading"
    >
      <LegacyOhShotHash />
      <article className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(14rem,18rem)] lg:items-center lg:gap-12 lg:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">
            Featured Women&apos;s Sexual Wellness Treatment
          </p>

          <h2
            id="oh-shot-callout-heading"
            className="font-display mt-3 max-w-xl text-3xl font-medium leading-[1.15] tracking-tight text-base-content text-balance md:text-4xl"
          >
            OH-Shot for comfort, sensation, and intimate confidence.
          </h2>

          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/85 md:text-lg">
            A discreet in-office PRP treatment for women who want greater comfort, improved sensitivity, and more
            confidence with intimacy. If dryness, reduced sensation, mild stress urinary leakage, or
            intimacy-related discomfort have become part of the conversation, the OH-Shot may be a supportive option
            to discuss.
          </p>

          <CmaCredentialStrip className="mt-5 max-w-xl" />

          <p className="mt-5 text-sm leading-relaxed text-base-content/80 md:text-base">
            {ohShot.displayPrice} treatment. Pay online now, then choose your appointment time after checkout.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <InstantCheckoutButton className="w-full sm:w-auto" slug={ohShot.slug} kind={ohShot.kind} quantity={ohShot.minQuantity}>
              Book Now
            </InstantCheckoutButton>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/procedures/oh-shot">Explore OH-Shot Care</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden border border-base-300 bg-base-200 lg:max-w-[18rem] lg:justify-self-end">
          <Image
            src={ohShot.imagePath || "/procedure/oh-shot/womens-intimate-wellness-lifestyle.webp"}
            alt="Woman enjoying a confident, worry-free lifestyle after intimate wellness care planning"
            fill
            sizes="(max-width: 1024px) 90vw, 288px"
            className="object-cover"
          />
        </div>
      </article>
    </section>
  );
}
