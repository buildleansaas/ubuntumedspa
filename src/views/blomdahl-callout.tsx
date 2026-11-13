import Image from "next/image";
import Link from "next/link";

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
      className="scroll-mt-28"
      aria-labelledby="blomdahl-callout-heading"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-base-200">
          <Image
            src={CALLOUT_PHOTO.src}
            alt={CALLOUT_PHOTO.alt}
            fill
            sizes="(max-width: 1024px) 92vw, 600px"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <div className="mt-7 max-w-2xl">
          <p className="text-sm text-base-content/65">
            Blomdahl medical ear piercing
          </p>

          <h2
            id="blomdahl-callout-heading"
            className="font-display mt-3 max-w-xl text-2xl leading-[1.2] tracking-tight text-base-content text-balance md:text-[1.9rem]"
          >
            Ear piercing in Williamsburg for infants, children, and adults.
          </h2>

          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/75">
            Jenny Brady, MSN, RN, CPNP, PMHS uses sterile single-use Blomdahl cassettes and hypoallergenic Medical
            Plastic or Medical Grade Titanium starter earrings. Babies are generally pierced at 6 months or older with
            pediatrician guidance.
          </p>

          <p className="mt-5 text-sm leading-relaxed text-base-content/70">
            {piercing?.displayPrice}. Book the visit, then text or call Jenny to pick a time.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={EAR_PIERCING_BOOKING.homepageCallout}
              className="inline-flex h-9 items-center rounded-full border border-base-content/20 px-4 text-sm text-base-content transition-colors hover:bg-base-200"
            >
              Book ear piercing
            </Link>
            <Link href="/procedures/blomdahl-ear-piercing" className="rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary">
              Ear piercing details
            </Link>
            <Link href="/procedures/blomdahl-ear-piercing/for/children" className="rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary">
              Infant and kids piercing
            </Link>
          </div>
        </div>

      </article>
    </section>
  );
}
