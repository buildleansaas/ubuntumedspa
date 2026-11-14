import Link from "next/link";

import { BUTTON_ROW, H2, INTRO, SPLIT, SPLIT_MEDIA, SPLIT_TEXT } from "components/layout";
import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { EAR_PIERCING_BOOKING } from "lib/ear-piercing-booking";
import { EarPiercingCarousel } from "components/clinic-photos";


export default function BlomdahlCallout() {
  const piercing = getCatalogConfigBySlug("blomdahl-ear-piercing");

  return (
    <section id="blomdahl-callout" className="scroll-mt-28 text-left" aria-labelledby="blomdahl-callout-heading">
      <article className={`${SPLIT} items-center`}>
        <div className={SPLIT_TEXT.wide}>
          <p className="eyebrow">Blomdahl medical ear piercing</p>

          <h2 id="blomdahl-callout-heading" className={`mt-3 ${H2}`}>
            Ear piercing in Williamsburg for infants, children, and adults.
          </h2>

          <p className={`mt-4 ${INTRO}`}>
            Jenny Brady, MSN, RN, CPNP, PMHS uses sterile single-use Blomdahl cassettes and hypoallergenic Medical
            Plastic or Medical Grade Titanium starter earrings. Babies are generally pierced at 6 months or older with
            pediatrician guidance.
          </p>

          <p className="mt-6 text-sm leading-relaxed text-base-content/80 md:text-base">
            {piercing?.displayPrice}. Book the visit, then text or call Jenny to pick a time.
          </p>

          <div className={`mt-8 ${BUTTON_ROW}`}>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={EAR_PIERCING_BOOKING.homepageCallout}>Book ear piercing</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/procedures/blomdahl-ear-piercing">Ear piercing details</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/procedures/blomdahl-ear-piercing/for/children">Infant and kids piercing</Link>
            </Button>
          </div>
        </div>

        {/* Every released ear piercing photo, as a carousel (Austin, round 3). */}
        <div className={`min-w-0 ${SPLIT_MEDIA.wide}`}>
          <EarPiercingCarousel bookHref={EAR_PIERCING_BOOKING.homepageCallout} stacked />
        </div>
      </article>
    </section>
  );
}
