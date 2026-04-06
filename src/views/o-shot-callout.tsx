import Image from "next/image";
import Link from "next/link";

import CmaCredentialStrip from "components/cma-credential-strip";
import InstantCheckoutButton from "components/instant-checkout-button";
import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";

export default function OShotCallout() {
  const oShot = getCatalogConfigBySlug("o-shot");
  if (!oShot) return null;

  return (
    <section
      id="o-shot-callout"
      className="mb-14 scroll-mt-24 py-6 md:mb-20 md:py-8 lg:py-10"
      aria-labelledby="o-shot-callout-heading"
    >
      <div className="mx-auto max-w-5xl">
        <article className="group relative isolate flex flex-col gap-8 md:flex-row md:items-center md:justify-between lg:gap-12">
          <div className="max-w-2xl flex-1">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">
              Featured Women&apos;s Sexual Wellness Treatment
            </p>

            <h2
              id="o-shot-callout-heading"
              className="mt-3 max-w-2xl text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content text-balance"
            >
              <span className="font-semibold">O-Shot®</span> for comfort, sensation, and intimate confidence.
            </h2>

            <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-base-content/80">
              A discreet in-office PRP treatment for women who want greater comfort, improved sensitivity, and more
              confidence with intimacy. If dryness, reduced sensation, mild stress urinary leakage, or
              intimacy-related discomfort have become part of the conversation, the O-Shot® may be a supportive option
              to discuss.
            </p>

            <CmaCredentialStrip className="mt-5 max-w-xl" />

            <p className="mt-5 text-sm md:text-base leading-relaxed text-base-content/70">
              {oShot.displayPrice} treatment. Pay online now, then choose your appointment time after checkout.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <InstantCheckoutButton slug={oShot.slug} kind={oShot.kind} quantity={oShot.minQuantity}>
                Book Now
              </InstantCheckoutButton>
              <Button asChild variant="secondary">
                <Link href="/procedures/o-shot">Learn More</Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-[18rem] overflow-hidden rounded-2xl bg-base-200 sm:max-w-[20rem] md:w-[17rem] lg:w-[19rem] md:shrink-0">
            <Image
              src={oShot.imagePath || "/procedure/grapefruit.jpg"}
              alt="Grapefruit visual representing the O-Shot intimate wellness treatment"
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
