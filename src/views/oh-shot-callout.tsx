import Image from "next/image";
import Link from "next/link";

import CmaCredentialStrip from "components/cma-credential-strip";
import LegacyOhShotHash from "components/legacy-oh-shot-hash";
import InstantCheckoutButton from "components/instant-checkout-button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";

export default function OhShotCallout() {
  const ohShot = getCatalogConfigBySlug("oh-shot");
  if (!ohShot) return null;

  return (
    <section
      id="oh-shot-callout"
      className="scroll-mt-28"
      aria-labelledby="oh-shot-callout-heading"
    >
      <LegacyOhShotHash />
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-base-200">
          <Image
            src={ohShot.imagePath || "/procedure/oh-shot/womens-intimate-wellness-lifestyle.webp"}
            alt="Woman enjoying a confident, worry-free lifestyle after intimate wellness care planning"
            fill
            sizes="(max-width: 1024px) 92vw, 600px"
            className="object-cover"
          />
        </div>
        <div className="mt-7 max-w-2xl">
          <p className="text-sm text-base-content/65">
            Featured Women&apos;s Sexual Wellness Treatment
          </p>

          <h2
            id="oh-shot-callout-heading"
            className="font-display mt-3 max-w-xl text-2xl leading-[1.2] tracking-tight text-base-content text-balance md:text-[1.9rem]"
          >
            OH-Shot for comfort, sensation, and intimate confidence.
          </h2>

          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/75">
            A discreet in-office PRP treatment for women who want greater comfort, improved sensitivity, and more
            confidence with intimacy. If dryness, reduced sensation, mild stress urinary leakage, or
            intimacy-related discomfort have become part of the conversation, the OH-Shot may be a supportive option
            to discuss.
          </p>

          <CmaCredentialStrip className="mt-5 max-w-xl" />

          <p className="mt-5 text-sm leading-relaxed text-base-content/70">
            One treatment: {ohShot.displayPrice}. Pay online now, then text or call Jenny to book your appointment.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <InstantCheckoutButton variant="outline" size="sm" slug={ohShot.slug} kind={ohShot.kind} quantity={ohShot.minQuantity}>
              Book Now
            </InstantCheckoutButton>
            <Link href="/procedures/oh-shot" className="rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary">
              Explore OH-Shot Care
            </Link>
          </div>
        </div>

      </article>
    </section>
  );
}
