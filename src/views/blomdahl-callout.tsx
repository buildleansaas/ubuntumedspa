import Image from "next/image";
import Link from "next/link";

import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { EAR_PIERCING_BOOKING } from "lib/ear-piercing-booking";
import { EAR_PIERCING_PHOTOS } from "config/clinic-photos";

// A real first-earrings photo (released; taken at home, so no caption names the clinic). The triplets photo already shows higher on the homepage.
const CALLOUT_PHOTO = EAR_PIERCING_PHOTOS[1].photo;

export default function BlomdahlCallout() {
  const piercing = getCatalogConfigBySlug("blomdahl-ear-piercing");

  return (
    <section
      id="blomdahl-callout"
      className="scroll-mt-28 border border-base-300"
      aria-labelledby="blomdahl-callout-heading"
    >
      <article className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-center lg:gap-12 lg:p-10">
        <div className="max-w-2xl">

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

        <div className="relative aspect-[4/5] w-full overflow-hidden border border-base-300 bg-base-200 lg:justify-self-end">
          <Image
            src={CALLOUT_PHOTO.src}
            alt={CALLOUT_PHOTO.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 384px"
            className="object-cover"
          />
        </div>
      </article>
    </section>
  );
}
