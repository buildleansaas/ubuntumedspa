import Link from "next/link";

import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { EAR_PIERCING_BOOKING } from "lib/ear-piercing-booking";
import { EarPiercingCarousel } from "components/clinic-photos";


export default function BlomdahlCallout() {
  const piercing = getCatalogConfigBySlug("blomdahl-ear-piercing");

  return (
    <section
      id="blomdahl-callout"
      className="scroll-mt-28 rounded-2xl border border-base-300"
      aria-labelledby="blomdahl-callout-heading"
    >
      <article className="p-6 md:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">
            Blomdahl medical ear piercing
          </p>

          <h2
            id="blomdahl-callout-heading"
            className="font-display mt-3 max-w-xl text-3xl font-medium leading-[1.15] tracking-tight text-base-content text-balance md:text-4xl"
          >
            Ear piercing in Williamsburg for infants, children, and adults.
          </h2>

          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/85 md:text-lg">
            Jenny Brady, MSN, RN, CPNP, PMHS uses sterile single-use Blomdahl cassettes and hypoallergenic Medical
            Plastic or Medical Grade Titanium starter earrings. Babies are generally pierced at 6 months or older with
            pediatrician guidance.
          </p>

          <p className="mt-5 text-sm leading-relaxed text-base-content/80 md:text-base">
            {piercing?.displayPrice}. Book the visit, then text or call Jenny to pick a time.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="w-full sm:w-auto">
              <Link href={EAR_PIERCING_BOOKING.homepageCallout}>Book ear piercing</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/procedures/blomdahl-ear-piercing">Ear piercing details</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/procedures/blomdahl-ear-piercing/for/children">Infant and kids piercing</Link>
            </Button>
          </div>
        </div>

        {/* Every released ear piercing photo, as a carousel (Austin, round 3). */}
        <EarPiercingCarousel className="mt-10" bookHref={EAR_PIERCING_BOOKING.homepageCallout} />
      </article>
    </section>
  );
}
