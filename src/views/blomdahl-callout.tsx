import Image from "next/image";
import Link from "next/link";

import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { EAR_PIERCING_BOOKING } from "lib/ear-piercing-booking";

export default function BlomdahlCallout() {
  const piercing = getCatalogConfigBySlug("blomdahl-ear-piercing");

  return (
    <section
      id="blomdahl-callout"
      className="scroll-mt-28 border border-base-300"
      aria-labelledby="blomdahl-callout-heading"
    >
      <article className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(14rem,18rem)] lg:items-center lg:gap-12 lg:p-10">
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
            Jenny Coleman, MSN, RN, CPNP, PMHS uses sterile single-use Blomdahl cassettes and hypoallergenic Medical
            Plastic or Medical Grade Titanium starter earrings. Babies are generally pierced at 6 months or older with
            pediatrician guidance.
          </p>

          <p className="mt-5 text-sm leading-relaxed text-base-content/80 md:text-base">
            {piercing?.displayPrice ?? "$45 per ear, or $80 for both ears"}. Book the visit, then choose a time.
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

        <div className="relative aspect-[4/5] w-full overflow-hidden border border-base-300 bg-base-200 lg:max-w-[18rem] lg:justify-self-end">
          <Image
            src={piercing?.imagePath || "/procedure/blomdahl-family-ear-piercing-consult-jenny.webp"}
            alt="Consultation about starter earrings for a child's ear piercing"
            fill
            sizes="(max-width: 1024px) 90vw, 288px"
            className="object-cover"
          />
        </div>
      </article>
    </section>
  );
}
