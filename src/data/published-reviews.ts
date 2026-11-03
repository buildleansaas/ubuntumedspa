export type PublishedReview = {
  id: string;
  quote: string;
  displayName: string;
  datePublished: string;
  serviceSlug?: string;
  imageSrc?: string;
};

/**
 * Consented reviews with a real display name and publication date.
 * Leave this empty until Austin supplies them. Do not add paraphrased or unnamed quotes.
 */
export const publishedReviews: PublishedReview[] = [];

export const reviewsForService = (serviceSlug?: string) =>
  publishedReviews.filter((review) => {
    if (!review.displayName.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(review.datePublished)) return false;
    if (!serviceSlug) return true;
    return !review.serviceSlug || review.serviceSlug === serviceSlug;
  });
