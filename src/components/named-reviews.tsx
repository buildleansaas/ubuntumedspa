import Image from "next/image";

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

export default function NamedReviews({ serviceSlug, heading = "Patient reviews" }: { serviceSlug?: string; heading?: string }) {
  const reviews = reviewsForService(serviceSlug);
  if (!reviews.length) return null;

  return (
    <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-20" aria-labelledby="named-reviews-heading">
      <h2 id="named-reviews-heading" className="font-display text-3xl font-medium tracking-tight text-base-content md:text-4xl">
        {heading}
      </h2>
      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
          <li key={review.id} className="border border-base-300 p-6">
            <blockquote className="text-base leading-relaxed text-base-content/85">
              <p>{review.quote}</p>
            </blockquote>
            <p className="mt-4 text-sm text-base-content/75">
              <span className="font-medium text-base-content">{review.displayName}</span>
              <span aria-hidden> · </span>
              <time dateTime={review.datePublished}>{formatReviewDate(review.datePublished)}</time>
            </p>
            {review.imageSrc ? (
              <div className="relative mt-4 aspect-[4/3] max-w-xs overflow-hidden border border-base-300 bg-base-200">
                <Image src={review.imageSrc} alt="" fill sizes="320px" className="object-cover" />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
