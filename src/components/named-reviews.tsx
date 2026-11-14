import Image from "next/image";

import { AFTER_HEADER, CARD, CARD_GRID, CARD_GRID_2, Section, SectionHeader } from "components/layout";
import { reviewsForService } from "data/published-reviews";

const formatReviewDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

export default function NamedReviews({
  serviceSlug,
  heading = "Patient reviews",
  embedded = false,
}: {
  serviceSlug?: string;
  heading?: string;
  /** Inside another section (procedure benefits): no band or section padding of its own. */
  embedded?: boolean;
}) {
  const reviews = reviewsForService(serviceSlug);
  if (!reviews.length) return null;

  const body = (
    <>
      <SectionHeader id="named-reviews-heading" title={heading} />
      <ul className={`${AFTER_HEADER} ${reviews.length > 2 ? CARD_GRID : CARD_GRID_2}`}>
        {reviews.map((review) => (
          <li key={review.id} className={CARD}>
            <blockquote className="text-base leading-relaxed text-base-content/85">
              <p>{review.quote}</p>
            </blockquote>
            <p className="mt-4 text-sm text-base-content/75">
              <span className="font-medium text-base-content">{review.displayName}</span>
              <span aria-hidden> · </span>
              <time dateTime={review.datePublished}>{formatReviewDate(review.datePublished)}</time>
            </p>
            {review.imageSrc ? (
              <div className="relative mt-4 aspect-[4/3] max-w-xs overflow-hidden rounded-2xl border border-base-300 bg-base-200">
                <Image src={review.imageSrc} alt="" fill sizes="320px" className="object-cover" />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );

  if (embedded) {
    return (
      <section className="mt-16 scroll-mt-28 text-left md:mt-20" aria-labelledby="named-reviews-heading">
        {body}
      </section>
    );
  }
  return <Section labelledBy="named-reviews-heading">{body}</Section>;
}
