"use client";

import { Button } from "components/ui/button";
import { trackReviewClick } from "lib/analytics";
import { GOOGLE_REVIEW_URL } from "lib/seo";

export function ReviewButton() {
  return (
    <Button asChild size="lg" className="h-14 w-full text-base sm:w-auto">
      <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackReviewClick("review_page")}>
        Leave a Google Review
      </a>
    </Button>
  );
}
